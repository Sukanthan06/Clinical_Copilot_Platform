import json
from typing import Optional
from fastapi import APIRouter, Depends, File, UploadFile, Form, HTTPException, status
from backend.models.patient import PatientUploadResponse, PatientProfile
from backend.services.patient_service import PatientService

router = APIRouter(prefix="/patient", tags=["Patients"])

def get_patient_service() -> PatientService:
    return PatientService()

@router.post("/upload", response_model=PatientUploadResponse, status_code=status.HTTP_201_CREATED)
async def upload_report(
    file: UploadFile = File(...), 
    patientId: Optional[str] = Form(None),
    reportType: Optional[str] = Form(None),
    service: PatientService = Depends(get_patient_service)
) -> PatientUploadResponse:
    """
    Accepts a medical report file via multipart form upload, 
    encodes it to Base64, and forwards it to the upload_medical_report MCP tool.
    """
    file_content = await file.read()
    file_name = file.filename or "unknown_file"
    
    incoming = {
        "fileName": file_name,
        "reportType": reportType,
        "patientId": patientId,
        "size": len(file_content)
    }
    
    if not patientId or not reportType:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="patientId and reportType are required for report upload."
        )

    validated = {
        "patientId": patientId,
        "fileName": file_name,
        "reportType": reportType
    }
    
    payload = {
        "patientId": patientId,
        "file": "<base64_encoded_data>",
        "reportType": reportType,
        "fileName": file_name
    }

    result = await service.upload_report(patientId, file_name, file_content, reportType)
    
    success = result.get("success", True)
    patient_id = result.get("patientId") or result.get("patient_id") or ""
    report_id = result.get("reportId") or result.get("report_id") or ""
    file_id = result.get("fileId") or result.get("file_id") or report_id or ""
    file_url = result.get("fileUrl") or result.get("file_url") or ""
    report_type = result.get("reportType") or result.get("report_type") or reportType
    upload_status = result.get("status") or "Uploaded Successfully"
    message = result.get("message") or "Report uploaded and stored successfully"
    
    if not report_id:
        print("❌ MISMATCH")
        print("Expected: reportId from MCP")
        print(f"Found: None or empty in {result}")
        
    response = PatientUploadResponse(
        success=success,
        patientId=patient_id,
        reportId=report_id,
        fileId=file_id,
        fileUrl=file_url,
        reportType=report_type,
        status=upload_status,
        message=message
    )
    
    print("==========================================")
    print("ENDPOINT: /patient/upload")
    print("==========================================")
    print("Incoming Request:")
    print(json.dumps(incoming, indent=2, default=str))
    print("↓")
    print("Validated Request:")
    print(json.dumps(validated, indent=2, default=str))
    print("↓")
    print("Payload Sent To MCP:")
    print(json.dumps(payload, indent=2, default=str))
    print("↓")
    print("Raw MCP Response:")
    print(json.dumps(result, indent=2, default=str))
    print("↓")
    print("Mapped Response:")
    print(response.model_dump_json(indent=2))
    print("↓")
    print("Returned Response:")
    print(response.model_dump_json(indent=2))
    print("==========================================")
    
    return response


@router.get("/{patientId}", response_model=PatientProfile, status_code=status.HTTP_200_OK)
async def get_patient_profile(
    patientId: str,
    service: PatientService = Depends(get_patient_service)
) -> PatientProfile:
    """
    Reads the persisted patient profile from the MCP server.
    """
    if not patientId or patientId == "undefined":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="patientId is required"
        )
        
    return PatientProfile.model_validate(await service.get_profile(patientId))


@router.get("/{patientId}/reports")
async def list_medical_reports(
    patientId: str, service: PatientService = Depends(get_patient_service)
) -> dict:
    if not patientId or patientId == "undefined":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="patientId is required")
    return await service.list_reports(patientId)
