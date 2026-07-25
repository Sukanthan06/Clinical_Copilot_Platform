from fastapi import APIRouter, Depends, status
from backend.models.extraction import ExtractRequest, ExtractResponse
from backend.services.extraction_service import ExtractionService

router = APIRouter(prefix="/extraction", tags=["Extraction"])

def get_extraction_service() -> ExtractionService:
    return ExtractionService()

@router.post("", response_model=ExtractResponse, status_code=status.HTTP_200_OK)
async def extract_information(
    request: ExtractRequest,
    service: ExtractionService = Depends(get_extraction_service)
) -> ExtractResponse:
    """
    Invokes the extract_patient_information MCP tool to extract and structure
    patient clinical history from uploaded reports.
    """
    result = await service.extract_information(request.patientId, request.fileId)
    
    # Process potential nested response variations
    profile = result.get("patient_profile") or result
    return ExtractResponse(
        success=result.get("success", True),
        patient_profile=profile
    )
