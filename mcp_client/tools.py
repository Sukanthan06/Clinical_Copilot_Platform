from typing import Optional
from mcp_client.client import MCPClient
from mcp_client.schemas import (
    AuthenticationResponse,
    UploadResponse,
    PatientProfile,
    TimelineResponse,
    ClinicalTrialResponse,
    ReferralResponse
)

async def authenticate_user(
    client: MCPClient, 
    username: str, 
    password: str, 
    action: str
) -> AuthenticationResponse:
    """
    Exposes authenticate_user wrapper.
    Input: username, password, action (register/login)
    """
    payload = {
        "username": username,
        "password": password,
        "action": action
    }
    result = await client.call_tool("authenticate_user", payload)
    return AuthenticationResponse.model_validate(result)

async def upload_medical_report(
    client: MCPClient, 
    patient_id: Optional[str], 
    file_name: str, 
    content_type: str, 
    base64_content: str
) -> UploadResponse:
    """
    Exposes upload_medical_report wrapper.
    Input: patientId, fileName, contentType, base64Content
    """
    payload = {
        "patientId": patient_id,
        "fileName": file_name,
        "contentType": content_type,
        "base64Content": base64_content
    }
    result = await client.call_tool("upload_medical_report", payload)
    return UploadResponse.model_validate(result)

async def extract_patient_information(
    client: MCPClient, 
    patient_id: str, 
    file_id: str
) -> PatientProfile:
    """
    Exposes extract_patient_information wrapper.
    Input: patientId, fileId
    """
    payload = {
        "patientId": patient_id,
        "fileId": file_id
    }
    result = await client.call_tool("extract_patient_information", payload)
    
    # Handle response shape variation: if the tool nests the profile in "patient_profile"
    profile_data = result.get("patient_profile") if isinstance(result, dict) else None
    if profile_data is None:
        profile_data = result
        
    return PatientProfile.model_validate(profile_data)

async def update_medical_timeline(
    client: MCPClient, 
    patient_id: str
) -> TimelineResponse:
    """
    Exposes update_medical_timeline wrapper.
    Input: patientId
    """
    payload = {
        "patientId": patient_id
    }
    result = await client.call_tool("update_medical_timeline", payload)
    
    timeline_data = result.get("timeline") if isinstance(result, dict) else None
    if timeline_data is None:
        if isinstance(result, list):
            timeline_data = result
        else:
            timeline_data = []
            
    return TimelineResponse(
        success=result.get("success", True) if isinstance(result, dict) else True,
        patientId=patient_id,
        timeline=timeline_data
    )

async def search_clinical_trials(
    client: MCPClient, 
    patient_id: str
) -> ClinicalTrialResponse:
    """
    Exposes search_clinical_trials wrapper.
    Input: patientId
    """
    payload = {
        "patientId": patient_id
    }
    result = await client.call_tool("search_clinical_trials", payload)
    
    trials_data = result.get("trials") if isinstance(result, dict) else None
    if trials_data is None:
        if isinstance(result, list):
            trials_data = result
        else:
            trials_data = []
            
    return ClinicalTrialResponse(
        success=result.get("success", True) if isinstance(result, dict) else True,
        patientId=patient_id,
        trials=trials_data
    )

async def generate_referral(
    client: MCPClient, 
    patient_id: str, 
    doctor_name: str, 
    reason: str
) -> ReferralResponse:
    """
    Exposes generate_referral wrapper.
    Input: patientId, doctorName, reason
    """
    payload = {
        "patientId": patient_id,
        "doctorName": doctor_name,
        "reason": reason
    }
    result = await client.call_tool("generate_referral", payload)
    return ReferralResponse.model_validate(result)
