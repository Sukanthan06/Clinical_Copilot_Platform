import logging
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from mcp_client.exceptions import MCPConnectionError, MCPToolError, MCPTimeoutError

logger = logging.getLogger("backend.error_handler")

def setup_exception_handlers(app: FastAPI) -> None:
    """Configures centralized error handling handlers on the FastAPI app."""
    
    @app.exception_handler(MCPConnectionError)
    async def mcp_connection_handler(request: Request, exc: MCPConnectionError) -> JSONResponse:
        logger.error("MCP Server Connection Error: %s", exc.message)
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={"error": "MCP Server unavailable"}
        )

    @app.exception_handler(MCPTimeoutError)
    async def mcp_timeout_handler(request: Request, exc: MCPTimeoutError) -> JSONResponse:
        logger.error("MCP Request Timeout: %s", exc.message)
        return JSONResponse(
            status_code=status.HTTP_504_GATEWAY_TIMEOUT,
            content={"error": "MCP request timed out"}
        )

    @app.exception_handler(MCPToolError)
    async def mcp_tool_handler(request: Request, exc: MCPToolError) -> JSONResponse:
        logger.error("MCP Tool Execution Failure: %s", exc.message)
        return JSONResponse(
            status_code=status.HTTP_502_BAD_GATEWAY,
            content={"error": f"MCP tool error: {exc.message}"}
        )

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
        logger.warning("Request validation failed for path %s: %s", request.url.path, exc.errors())
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content={
                "error": "Validation Error",
                "details": exc.errors()
            }
        )

    @app.exception_handler(Exception)
    async def general_exception_handler(request: Request, exc: Exception) -> JSONResponse:
        logger.error("Unhandled exception: %s", str(exc), exc_info=True)
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"error": "Internal Server Error", "details": str(exc)}
        )

