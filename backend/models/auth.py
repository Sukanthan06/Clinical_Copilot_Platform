from typing import Any, Dict, Optional
from pydantic import BaseModel, Field

class UserAuthRequest(BaseModel):
    email: str = Field(..., description="The email address or username of the user")
    password: str = Field(..., min_length=6, description="The password of the user (minimum 6 characters)")
    name: Optional[str] = Field(None, description="Optional full name (used during registration)")

class AuthResponse(BaseModel):
    success: bool
    action: str
    patientId: str
    token: str
    name: str
    message: str
    data: Optional[Dict[str, Any]] = None
