from fastapi import APIRouter, Depends, File, UploadFile, status
from backend.models.patient import PatientUploadResponse
from backend.services.patient_service import PatientService

router = APIRouter(prefix="/patient", tags=["Patients"])

def get_patient_service() -> PatientService:
    return PatientService()

@router.post("/upload", response_model=PatientUploadResponse, status_code=status.HTTP_201_CREATED)
async def upload_report(
    file: UploadFile = File(...), 
    service: PatientService = Depends(get_patient_service)
) -> PatientUploadResponse:
    """
    Accepts a medical report file via multipart form upload, 
    encodes it to Base64, and forwards it to the upload_medical_report MCP tool.
    """
    file_content = await file.read()
    file_name = file.filename or "unknown_file"
    content_type = file.content_type or "application/pdf"

    result = await service.upload_report(file_name, file_content, content_type)
    
    return PatientUploadResponse(
        success=result.get("success", True),
        patientId=result.get("patientId") or result.get("patient_id") or "",
        fileId=result.get("fileId") or result.get("file_id") or "",
        message=result.get("message") or "Report uploaded and stored successfully."
    )

