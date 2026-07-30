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
    ExtractResponse,
    PatientProfile,
    TimelineResponse,
    ClinicalTrialResponse,
    ReferralResponse
)

logger = logging.getLogger("mcp_client.client")

REQUIRED_TOOL_NAMES = frozenset({
    "authenticate_user",
    "upload_medical_report",
    "extract_patient_information",
    "update_medical_timeline",
    "search_clinical_trials",
    "generate_referral",
})

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
        self._tool_names: set[str] = set()

    async def connect(self) -> None:
        """Establishes connection to the remote MCP SSE Server. Thread-safe."""
        async with self._lock:
            if self.session:
                return

            logger.info("Connecting to MCP server at %s...", self.sse_url)
            self._exit_stack = AsyncExitStack()
            try:
                # NitroCloud advertises `/mcp` as its raw SSE endpoint.
                read_stream, write_stream = await self._exit_stack.enter_async_context(
                    sse_client(self.sse_url)
                )
                self.session = await self._exit_stack.enter_async_context(
                    ClientSession(read_stream, write_stream)
                )
                # Perform protocol initialization
                await self.session.initialize()
                tools = await self.session.list_tools()
                self._tool_names = {tool.name for tool in tools.tools}
                logger.info("Connected and initialized MCP client session.")
            except Exception as e:
                logger.error("Failed to connect to MCP server: %s", e)
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
        self._tool_names.clear()
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

    async def verify_connection(self) -> list[str]:
        """Verify the active MCP session can make a request and list its tools."""
        await self.connect()
        if not self.session:
            raise MCPConnectionError("MCP session was not established")

        try:
            result = await self.session.list_tools()
            self._tool_names = {tool.name for tool in result.tools}
            return sorted(self._tool_names)
        except Exception as exc:
            logger.exception("MCP readiness check failed")
            await self.disconnect()
            raise MCPConnectionError(f"MCP readiness check failed: {exc}") from exc

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
                
                text_content = "\n".join(
                    block.text for block in result.content if hasattr(block, "text")
                )

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

    async def authenticate_user(self, username: str, password: str, action: str, name: Optional[str] = None) -> AuthenticationResponse:
        """
        Exposes authenticate_user wrapper directly on MCPClient instance.
        """
        payload = {
            "action": action,
            "email": username,
            "password": password
        }
        if action == "register" and name:
            payload["name"] = name

        # Verify validation criteria
        if "action" not in payload:
            print("ERROR: Backend is not sending 'action' field!")
        if "username" in payload:
            print("ERROR: Backend is using 'username' instead of 'email'!")
        if "email" not in payload or not payload["email"]:
            print("WARNING: Required field 'email' is missing!")
        if "password" not in payload or not payload["password"]:
            print("WARNING: Required field 'password' is missing!")
        if action == "register" and ("name" not in payload or not payload["name"]):
            print("WARNING: Required field 'name' is missing for registration!")

        result = await self.call_tool("authenticate_user", payload)
        return AuthenticationResponse.model_validate(result)

    async def upload_medical_report(self, patientId: Optional[str], fileName: str, reportType: str, base64Content: str) -> UploadResponse:
        """
        Exposes upload_medical_report wrapper directly on MCPClient instance.
        Maps keys to match 'patientId', 'file', 'reportType', and 'fileName' expected by NitroCloud tool schema.
        """
        if not patientId:
            raise ValueError("patientId is required for report upload and cannot be generated by the backend.")
            
        payload = {
            "patientId": patientId,
            "file": base64Content,
            "reportType": reportType,
            "fileName": fileName
        }
        result = await self.call_tool("upload_medical_report", payload)
        return UploadResponse.model_validate(result)

    async def extract_patient_information(self, patientId: str, fileId: str) -> ExtractResponse:
        """
        Exposes extract_patient_information wrapper directly on MCPClient instance.
        Maps 'fileId' to 'reportId' to match NitroCloud tool schema.
        """
        payload = {
            "patientId": patientId,
            "reportId": fileId
        }
        result = await self.call_tool("extract_patient_information", payload)
        return ExtractResponse.model_validate(result)

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

    async def generate_referral(self, patientId: str, doctorName: Optional[str], reason: Optional[str], trialId: Optional[str] = None) -> ReferralResponse:
        """
        Exposes generate_referral wrapper directly on MCPClient instance.
        """
        # Determine trial ID from arguments if not passed directly, but raise ValueError if none found
        target_trial_id = trialId
        if not target_trial_id:
            import re
            match = re.search(r"NCT\d+", (reason or "") + " " + (doctorName or ""))
            if match:
                target_trial_id = match.group(0)
            else:
                raise ValueError("trialId is required for referral generation and cannot be generated by the backend.")

        payload = {
            "patientId": patientId,
            "trialId": target_trial_id
        }
        result = await self.call_tool("generate_referral", payload)
        return ReferralResponse.model_validate(result)

    async def get_patient_profile(self, patient_id: str) -> PatientProfile:
        """Read the persisted profile. Requires the MCP read tool documented in README."""
        result = await self.call_tool("get_patient_profile", {"patientId": patient_id})
        return PatientProfile.model_validate(result)

    async def list_medical_reports(self, patient_id: str) -> Dict[str, Any]:
        """Read persisted report metadata. Requires the MCP read tool documented in README."""
        result = await self.call_tool("list_medical_reports", {"patientId": patient_id})
        if not isinstance(result, dict):
            raise MCPToolError("list_medical_reports returned a non-object response")
        return result
