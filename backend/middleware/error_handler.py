import logging
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

logger = logging.getLogger("backend.error_handler")

class MCPUnavailableException(Exception):
    """Exception raised when the MCP server is down or unresponsive."""
    def __init__(self, message: str = "MCP Server unavailable"):
        self.message = message
        super().__init__(self.message)

class MCPToolException(Exception):
    """Exception raised when an MCP tool call fails."""
    def __init__(self, message: str):
        self.message = message
        super().__init__(self.message)

def setup_exception_handlers(app: FastAPI) -> None:
    """Configures centralized error handling handlers on the FastAPI app."""
    
    @app.exception_handler(MCPUnavailableException)
    async def mcp_unavailable_handler(request: Request, exc: MCPUnavailableException) -> JSONResponse:
        logger.error("MCP Server Unavailable: %s", exc.message)
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={"error": exc.message}
        )

    @app.exception_handler(MCPToolException)
    async def mcp_tool_handler(request: Request, exc: MCPToolException) -> JSONResponse:
        logger.error("MCP Tool Failure: %s", exc.message)
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

    @app.exception_handler(RuntimeError)
    async def runtime_error_handler(request: Request, exc: RuntimeError) -> JSONResponse:
        err_msg = str(exc)
        # Map raw client/session missing issues to standard HTTP 503 responses
        if "MCP Server unavailable" in err_msg:
            return JSONResponse(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                content={"error": "MCP Server unavailable"}
            )
        logger.error("Unhandled runtime error: %s", err_msg, exc_info=True)
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"error": "Internal Server Error", "details": err_msg}
        )

    @app.exception_handler(Exception)
    async def general_exception_handler(request: Request, exc: Exception) -> JSONResponse:
        logger.error("Unhandled exception: %s", str(exc), exc_info=True)
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"error": "Internal Server Error", "details": str(exc)}
        )
