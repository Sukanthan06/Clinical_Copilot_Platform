import json
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from backend.models.auth import UserAuthRequest, AuthResponse
from backend.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["Authentication"])

def get_auth_service() -> AuthService:
    return AuthService()

@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def register(request: UserAuthRequest, service: AuthService = Depends(get_auth_service)) -> AuthResponse:
    """Registers a new user by calling authenticate_user MCP tool."""
    incoming = request.model_dump()
    email_val = request.email.strip().lower()
        
    validated = {
        "email": email_val,
        "password": request.password,
        "name": request.name,
        "action": "register"
    }
    
    payload = {
        "action": "register",
        "email": email_val,
        "password": request.password
    }
    if request.name:
        payload["name"] = request.name
        
    try:
        result = await service.register(email_val, request.password, request.name)
    except Exception as e:
        err_msg = str(e)
        if "Tool Failure:" in err_msg:
            err_msg = err_msg.split("returned error:", 1)[-1].strip()
        print(f"❌ Registration error: {err_msg}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=err_msg or "Registration failed."
        )

    if isinstance(result, dict) and result.get("success") is False:
        err_msg = result.get("message") or result.get("error") or "Registration failed."
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=err_msg
        )

    patient_id = result.get("patientId") or result.get("patient_id") or result.get("id")
    token = result.get("token") or result.get("access_token")
    name = result.get("name") or request.name or email_val.split("@")[0].capitalize()
    message = result.get("message") or "Account registration successful."

    if not patient_id or not token:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Registration failed: Invalid response from authentication server."
        )

    response = AuthResponse(
        success=True,
        action="register",
        patientId=patient_id,
        token=token,
        name=name,
        message=message,
        data={
            "success": True,
            "patientId": patient_id,
            "token": token,
            "name": name,
            "message": message
        }
    )
    
    print("==========================================")
    print("ENDPOINT: /auth/register")
    print("==========================================")
    print("Incoming Request:")
    print(json.dumps(incoming, indent=2, default=str))
    print("v")
    print("Validated Request:")
    print(json.dumps(validated, indent=2, default=str))
    print("v")
    print("Payload Sent To MCP:")
    print(json.dumps(payload, indent=2, default=str))
    print("v")
    print("Raw MCP Response:")
    print(json.dumps(result, indent=2, default=str))
    print("v")
    print("Returned Response:")
    print(response.model_dump_json(indent=2))
    print("==========================================")
    
    return response

@router.post("/login", response_model=AuthResponse, status_code=status.HTTP_200_OK)
async def login(request: UserAuthRequest, service: AuthService = Depends(get_auth_service)) -> AuthResponse:
    """Logs in an existing user by calling authenticate_user MCP tool."""
    incoming = request.model_dump()
    email_val = request.email.strip().lower()
        
    validated = {
        "email": email_val,
        "password": request.password,
        "action": "login"
    }
    
    payload = {
        "action": "login",
        "email": email_val,
        "password": request.password
    }
    
    try:
        result = await service.login(email_val, request.password)
    except Exception as e:
        err_msg = str(e)
        if "Tool Failure:" in err_msg:
            err_msg = err_msg.split("returned error:", 1)[-1].strip()
        print(f"❌ Login error: {err_msg}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=err_msg or "Authentication failed."
        )

    if isinstance(result, dict) and result.get("success") is False:
        err_msg = result.get("message") or result.get("error") or "Authentication failed."
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=err_msg
        )

    patient_id = result.get("patientId") or result.get("patient_id") or result.get("id")
    token = result.get("token") or result.get("access_token")
    name = result.get("name") or email_val.split("@")[0].capitalize()
    message = result.get("message") or "Login successful."

    if not patient_id or not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication failed: Invalid response from authentication server."
        )

    response = AuthResponse(
        success=True,
        action="login",
        patientId=patient_id,
        token=token,
        name=name,
        message=message,
        data={
            "success": True,
            "patientId": patient_id,
            "token": token,
            "name": name,
            "message": message
        }
    )
    
    print("==========================================")
    print("ENDPOINT: /auth/login")
    print("==========================================")
    print("Incoming Request:")
    print(json.dumps(incoming, indent=2, default=str))
    print("v")
    print("Validated Request:")
    print(json.dumps(validated, indent=2, default=str))
    print("v")
    print("Payload Sent To MCP:")
    print(json.dumps(payload, indent=2, default=str))
    print("v")
    print("Raw MCP Response:")
    print(json.dumps(result, indent=2, default=str))
    print("v")
    print("Returned Response:")
    print(response.model_dump_json(indent=2))
    print("==========================================")
    
    return response
