from typing import Any, Dict
from backend.services import mcp_client

class AuthService:
    async def register(self, username: str, password: str) -> Dict[str, Any]:
        """Registers a new user by calling authenticate_user MCP tool."""
        return await mcp_client.authenticate_user(username, password, "register")

    async def login(self, username: str, password: str) -> Dict[str, Any]:
        """Authenticates an existing user by calling authenticate_user MCP tool."""
        return await mcp_client.authenticate_user(username, password, "login")
