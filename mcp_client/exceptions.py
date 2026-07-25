class MCPClientError(Exception):
    """Base exception for all MCP Client errors."""
    def __init__(self, message: str):
        self.message = message
        super().__init__(self.message)

class MCPConnectionError(MCPClientError):
    """Raised when the connection to the MCP server fails or drops."""
    pass

class MCPToolError(MCPClientError):
    """Raised when tool execution returns an error or invalid structure."""
    pass

class MCPTimeoutError(MCPClientError):
    """Raised when the tool execution exceeds the request timeout."""
    pass
