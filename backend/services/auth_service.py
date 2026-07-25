from typing import Any, Dict
from backend.services import mcp_client

class AuthService:
    async def register(self, username: str, password: str) -> Dict[str, Any]:
        """Registers a new user by calling the authenticate_user wrapper."""
        res = await mcp_client.authenticate_user(username, password, "register")
        return res.model_dump()

    async def login(self, username: str, password: str) -> Dict[str, Any]:
        """Authenticates an existing user by calling the authenticate_user wrapper."""
        res = await mcp_client.authenticate_user(username, password, "login")
        return res.model_dump()


