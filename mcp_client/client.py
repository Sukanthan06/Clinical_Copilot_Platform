import asyncio
import json
import logging
from contextlib import AsyncExitStack
from typing import Any, Dict, Optional

from mcp import ClientSession
from mcp.client.sse import sse_client
from mcp_client.config import config
from mcp_client.exceptions import MCPConnectionError, MCPToolError, MCPTimeoutError

logger = logging.getLogger("mcp_client.client")

class MCPClient:
    """
    Asynchronous Model Context Protocol (MCP) Client.
    Manages SSE connections to the NitroCloud MCP server and encapsulates tool invocation.
    """
    def __init__(self) -> None:
        self.sse_url: str = config.MCP_SERVER_URL
        self.timeout: float = config.REQUEST_TIMEOUT
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
                
                if not result.content:
                    return {}

                text_content = result.content[0].text
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
