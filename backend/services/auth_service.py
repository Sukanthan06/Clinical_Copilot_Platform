from typing import Any, Dict, Optional
from backend.services import mcp_client

class AuthService:
    async def register(self, email: str, password: str, name: Optional[str] = None) -> Dict[str, Any]:
        """Registers a new user by calling the authenticate_user wrapper."""
        res = await mcp_client.authenticate_user(email, password, "register", name=name)
        return res.model_dump()

    async def login(self, email: str, password: str) -> Dict[str, Any]:
        """Authenticates an existing user by calling the authenticate_user wrapper."""
        res = await mcp_client.authenticate_user(email, password, "login")
        return res.model_dump()
