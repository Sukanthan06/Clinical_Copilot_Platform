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
    email_val = request.email
        
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
        
    result = await service.register(email_val, request.password, request.name)
    
    # Process potential nested response variations
    success = result.get("success", True)
    patient_id = result.get("patientId") or result.get("patient_id") or ""
    token = result.get("token") or ""
    name = result.get("name") or request.name or ""
    message = result.get("message") or "Account registration successful."
    
    # Check for mismatch
    if "patientId" not in result:
        print("❌ MISMATCH")
        print("Expected: patientId")
        print(f"Found: {list(result.keys())}")
        
    response = AuthResponse(
        success=success,
        action="register",
        patientId=patient_id,
        token=token,
        name=name,
        message=message,
        data={
            "success": success,
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
    print("Mapped Response:")
    print(response.model_dump_json(indent=2))
    print("v")
    print("Returned Response:")
    print(response.model_dump_json(indent=2))
    print("==========================================")
    
    return response

@router.post("/login", response_model=AuthResponse, status_code=status.HTTP_200_OK)
async def login(request: UserAuthRequest, service: AuthService = Depends(get_auth_service)) -> AuthResponse:
    """Logs in an existing user by calling authenticate_user MCP tool."""
    incoming = request.model_dump()
    email_val = request.email
        
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
    
    result = await service.login(email_val, request.password)
    
    success = result.get("success", True)
    patient_id = result.get("patientId") or result.get("patient_id") or ""
    token = result.get("token") or ""
    name = result.get("name") or ""
    message = result.get("message") or "Login successful."
    
    # Check for mismatch
    if "patientId" not in result:
        print("❌ MISMATCH")
        print("Expected: patientId")
        print(f"Found: {list(result.keys())}")
        
    response = AuthResponse(
        success=success,
        action="login",
        patientId=patient_id,
        token=token,
        name=name,
        message=message,
        data={
            "success": success,
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
    print("Mapped Response:")
    print(response.model_dump_json(indent=2))
    print("v")
    print("Returned Response:")
    print(response.model_dump_json(indent=2))
    print("==========================================")
    
    return response
