from typing import List
from fastapi import APIRouter, Depends, status
from backend.models.timeline import TimelineResponse
from backend.services.timeline_service import TimelineService

router = APIRouter(prefix="/patient", tags=["Timeline"])

def get_timeline_service() -> TimelineService:
    return TimelineService()

@router.get("/{id}/timeline", response_model=TimelineResponse, status_code=status.HTTP_200_OK)
async def get_timeline(
    id: str, 
    service: TimelineService = Depends(get_timeline_service)
) -> TimelineResponse:
    """
    Retrieves and updates the patient's longitudinal medical timeline using 
    the update_medical_timeline MCP tool.
    """
    result = await service.get_timeline(id)
    
    # Process potential variations in the MCP tool response payload
    timeline_data = []
    success = True
    
    if isinstance(result, list):
        timeline_data = result
    elif isinstance(result, dict):
        timeline_data = result.get("timeline") or result.get("events") or [result]
        success = result.get("success", True)
        
    return TimelineResponse(
        success=success,
        patientId=id,
        timeline=timeline_data
    )
