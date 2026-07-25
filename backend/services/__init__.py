# Services Package
from mcp_client.client import MCPClient

# Global singleton instance of the external MCPClient
# TODO: In production, ensure the mcp_client package is installed or in PYTHONPATH
mcp_client = MCPClient()
