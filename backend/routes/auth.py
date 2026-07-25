from fastapi import APIRouter, Depends, status
from backend.models.auth import UserAuthRequest, AuthResponse
from backend.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["Authentication"])

def get_auth_service() -> AuthService:
    return AuthService()

@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def register(request: UserAuthRequest, service: AuthService = Depends(get_auth_service)) -> AuthResponse:
    """Registers a new user by calling authenticate_user MCP tool."""
    result = await service.register(request.username, request.password)
    
    # Standardize result payload
    success = result.get("success", True)
    message = result.get("message", "User registered successfully")
    return AuthResponse(
        success=success,
        message=message,
        data=result.get("data") or result
    )

@router.post("/login", response_model=AuthResponse, status_code=status.HTTP_200_OK)
async def login(request: UserAuthRequest, service: AuthService = Depends(get_auth_service)) -> AuthResponse:
    """Logs in an existing user by calling authenticate_user MCP tool."""
    result = await service.login(request.username, request.password)
    
    success = result.get("success", True)
    message = result.get("message", "User logged in successfully")
    return AuthResponse(
        success=success,
        message=message,
        data=result.get("data") or result
    )
