import asyncio
import json
import logging
from contextlib import AsyncExitStack
from typing import Any, Dict, Optional

from mcp import ClientSession
from mcp.client.sse import sse_client
from mcp_client.config import config
from mcp_client.exceptions import MCPConnectionError, MCPToolError, MCPTimeoutError
from mcp_client.schemas import (
    AuthenticationResponse,
    UploadResponse,
    PatientProfile,
    TimelineResponse,
    ClinicalTrialResponse,
    ReferralResponse
)

logger = logging.getLogger("mcp_client.client")

class MCPClient:
    """
    Asynchronous Model Context Protocol (MCP) Client.
    Manages SSE connections to the NitroCloud MCP server and encapsulates tool invocations.
    """
    def __init__(self) -> None:
        self.sse_url: str = config.MCP_SERVER_URL
        self.timeout: float = config.MCP_TIMEOUT
        self.session: Optional[ClientSession] = None
        self._exit_stack: Optional[AsyncExitStack] = None
        self._lock = asyncio.Lock()

    async def connect(self) -> None:
        """Establishes connection to the remote MCP SSE Server. Thread-safe."""
        async with self._lock:
            if self.session:
                return

            logger.info("Connecting to MCP SSE Server at %s...", self.sse_url)
            self._exit_stack = AsyncExitStack()
            try:
                # sse_client returns (read_stream, write_stream)
                read_stream, write_stream = await self._exit_stack.enter_async_context(
                    sse_client(self.sse_url)
                )
                self.session = await self._exit_stack.enter_async_context(
                    ClientSession(read_stream, write_stream)
                )
                # Perform protocol initialization
                await self.session.initialize()
                logger.info("Connected and initialized MCP Client session.")
            except Exception as e:
                logger.error("Failed to connect to MCP SSE Server: %s", e)
                await self._disconnect_internal()
                raise MCPConnectionError(f"Failed to connect to MCP server: {e}")

    async def disconnect(self) -> None:
        """Closes the active connection and cleans up resources."""
        async with self._lock:
            await self._disconnect_internal()

    async def _disconnect_internal(self) -> None:
        """Internal helper to clean up resources, assumed lock is already acquired."""
        if self._exit_stack:
            logger.info("Disconnecting MCP Client...")
            try:
                await self._exit_stack.aclose()
            except Exception as e:
                logger.warning("Error closing MCP client exit stack: %s", e)
            self._exit_stack = None
        self.session = None
        logger.info("MCP Client disconnected.")

    def is_connected(self) -> bool:
        """Validates if the connection session is active."""
        return self.session is not None

    async def health(self) -> Dict[str, str]:
        """Checks gateway and client connection health status."""
        return {
            "status": "healthy" if self.is_connected() else "unhealthy",
            "mcp": "connected" if self.is_connected() else "disconnected"
        }

    async def call_tool(self, tool_name: str, arguments: Optional[Dict[str, Any]] = None) -> Any:
        """
        Executes a tool on the MCP server with request timeouts, logging, and automatic reconnection.
        Raises MCPTimeoutError on timeout.
        Raises MCPConnectionError on transport failures.
        Raises MCPToolError on tool execution issues.
        """
        # Ensure session is connected
        if not self.session:
            logger.info("Session not active. Attempting reconnect before calling tool '%s'...", tool_name)
            try:
                await self.connect()
            except Exception as e:
                logger.error("Failed auto-reconnect before calling tool: %s", e)
                raise MCPConnectionError("MCP Server unavailable")

        # Retry logic: up to 2 attempts
        attempts = 2
        for attempt in range(1, attempts + 1):
            try:
                logger.info("Calling Tool: '%s' (Attempt %d/%d)", tool_name, attempt, attempts)
                
                # Execute with Request Timeout
                async with asyncio.timeout(self.timeout):
                    result = await self.session.call_tool(tool_name, arguments or {})
                
                # Check for tool-reported errors
                if getattr(result, "isError", False):
                    err_msg = result.content[0].text if result.content else "Unknown execution error"
                    logger.error("Tool Failure: '%s' returned error: %s", tool_name, err_msg)
                    raise MCPToolError(err_msg)

                logger.info("Tool Success: '%s' completed successfully", tool_name)
                
                text_content = result.content[0].text if result.content else ""
                
                # Debugging log for raw response
                if tool_name == "upload_medical_report":
                    print("========== RAW MCP RESPONSE ==========")
                    print(text_content)
                    try:
                        parsed_dict = json.loads(text_content)
                        print("Response Type:")
                        print(type(parsed_dict))
                        print("Keys:")
                        for k in parsed_dict.keys():
                            print(k)
                        print("patientId:")
                        print(repr(parsed_dict.get("patientId")))
                        print("fileId:")
                        print(repr(parsed_dict.get("fileId")))
                    except Exception as parse_err:
                        print(f"Error parsing raw response: {parse_err}")
                    print("======================================")

                try:
                    return json.loads(text_content)
                except json.JSONDecodeError:
                    return {"raw_text": text_content}

            except TimeoutError as te:
                logger.error("Timeout: Tool execution of '%s' timed out after %s seconds", tool_name, self.timeout)
                raise MCPTimeoutError(f"Tool '{tool_name}' timed out after {self.timeout}s") from te
            
            except MCPToolError:
                # Do not retry on explicit tool logic exceptions
                raise
            
            except Exception as e:
                logger.warning("Connection lost or exception during tool execution: %s", e)
                if attempt < attempts:
                    logger.info("Reconnect: Attempting Reconnect and retry...")
                    try:
                        await self.disconnect()
                        await self.connect()
                    except Exception as rc_err:
                        logger.error("Reconnection attempt failed: %s", rc_err)
                else:
                    logger.error("Tool Failure: All execution attempts for '%s' failed.", tool_name)
                    raise MCPConnectionError(f"Failed to communicate with MCP server: {e}") from e

    # --- Tool Wrapper Methods Exposed Directly on client ---

    async def authenticate_user(self, username: str, password: str, action: str) -> AuthenticationResponse:
        """
        Exposes authenticate_user wrapper directly on MCPClient instance.
        Maps 'username' to 'email' to match NitroCloud tool schema.
        """
        payload = {
            "email": username,
            "password": password
        }
        result = await self.call_tool("authenticate_user", payload)
        return AuthenticationResponse.model_validate(result)

    async def upload_medical_report(self, patientId: Optional[str], fileName: str, contentType: str, base64Content: str) -> UploadResponse:
        """
        Exposes upload_medical_report wrapper directly on MCPClient instance.
        Maps keys to match 'patientId', 'file', 'reportType', and 'fileName' expected by NitroCloud tool schema.
        """
        # patientId is required on the remote server schema; default to PAT001 if none provided
        patient_id = patientId or "PAT001"
        payload = {
            "patientId": patient_id,
            "file": base64Content,
            "reportType": "Blood Report",  # Default report type required by NitroCloud tool
            "fileName": fileName
        }
        result = await self.call_tool("upload_medical_report", payload)
        mapped = UploadResponse.model_validate(result)
        
        print("========== AFTER MAPPING ==========")
        print(mapped.model_dump())
        print("===================================")
        
        return mapped

    async def extract_patient_information(self, patientId: str, fileId: str) -> PatientProfile:
        """
        Exposes extract_patient_information wrapper directly on MCPClient instance.
        Maps 'fileId' to 'reportId' to match NitroCloud tool schema.
        """
        payload = {
            "patientId": patientId,
            "reportId": fileId
        }
        result = await self.call_tool("extract_patient_information", payload)
        
        profile_data = result.get("patient_profile") if isinstance(result, dict) else None
        if profile_data is None:
            profile_data = result
            
        return PatientProfile.model_validate(profile_data)

    async def update_medical_timeline(self, patientId: str) -> TimelineResponse:
        """
        Exposes update_medical_timeline wrapper directly on MCPClient instance.
        """
        payload = {
            "patientId": patientId
        }
        result = await self.call_tool("update_medical_timeline", payload)
        
        timeline_data = result.get("timeline") if isinstance(result, dict) else None
        if timeline_data is None:
            if isinstance(result, list):
                timeline_data = result
            else:
                timeline_data = []
                
        return TimelineResponse(
            success=result.get("success", True) if isinstance(result, dict) else True,
            patientId=patientId,
            timeline=timeline_data
        )

    async def search_clinical_trials(self, patientId: str) -> ClinicalTrialResponse:
        """
        Exposes search_clinical_trials wrapper directly on MCPClient instance.
        """
        payload = {
            "patientId": patientId
        }
        result = await self.call_tool("search_clinical_trials", payload)
        
        trials_data = result.get("trials") if isinstance(result, dict) else None
        if trials_data is None:
            if isinstance(result, list):
                trials_data = result
            else:
                trials_data = []
                
        return ClinicalTrialResponse(
            success=result.get("success", True) if isinstance(result, dict) else True,
            patientId=patientId,
            trials=trials_data
        )

    async def generate_referral(self, patientId: str, doctorName: str, reason: str, trialId: Optional[str] = None) -> ReferralResponse:
        """
        Exposes generate_referral wrapper directly on MCPClient instance.
        Extracts trial ID (like NCT054321) from reason/doctorName or defaults to NCT054321 to match tool requirements.
        """
        import re
        
        # Determine trial ID from arguments if not passed directly
        target_trial_id = trialId
        if not target_trial_id:
            match = re.search(r"NCT\d+", reason + " " + doctorName)
            target_trial_id = match.group(0) if match else "NCT054321"

        payload = {
            "patientId": patientId,
            "trialId": target_trial_id
        }
        result = await self.call_tool("generate_referral", payload)
        return ReferralResponse.model_validate(result)
