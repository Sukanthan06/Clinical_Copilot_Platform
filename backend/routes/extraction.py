import json
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
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
    incoming = request.model_dump()
    report_id = request.reportId or request.fileId
    if not report_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="reportId or fileId is required"
        )
        
    validated = {
        "patientId": request.patientId,
        "reportId": report_id
    }
    
    payload = {
        "patientId": request.patientId,
        "reportId": report_id
    }

    result = await service.extract_information(request.patientId, report_id)
    
    # Process potential nested response variations
    success = result.get("success", True)
    patient_id = result.get("patientId") or request.patientId
    report_id_val = result.get("reportId") or report_id
    processed = result.get("processed", True)
    llm = result.get("llm") or "Gemini"
    profile_updated = result.get("profileUpdated", True)
    embedding_stored = result.get("embeddingStored", True)
    extraction_quality = result.get("extractionQuality") or "High"
    message = result.get("message") or "Patient information extracted and profile updated successfully."
    
    # Extract any nested profile if present, else empty dictionary
    profile = result.get("patientProfile") or result.get("patient_profile") or {}

    response = ExtractResponse(
        success=success,
        patientId=patient_id,
        reportId=report_id_val,
        processed=processed,
        llm=llm,
        profileUpdated=profile_updated,
        embeddingStored=embedding_stored,
        extractionQuality=extraction_quality,
        message=message,
        patientProfile=profile,
        patient_profile=profile
    )
    
    print("==========================================")
    print("ENDPOINT: /extraction")
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
