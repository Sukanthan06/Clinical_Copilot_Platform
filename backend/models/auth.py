from typing import Any, Dict, Optional
from pydantic import BaseModel, Field

class UserAuthRequest(BaseModel):
    username: str = Field(..., min_length=3, max_length=50, description="The username of the user")
    password: str = Field(..., min_length=4, description="The password of the user")

class AuthResponse(BaseModel):
    success: bool
    message: str
    data: Optional[Dict[str, Any]] = None
