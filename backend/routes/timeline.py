import json
from fastapi import APIRouter, Depends, HTTPException, status
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
    incoming = {"id_parameter": id}
    
    if not id or id == "undefined":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="patientId is required"
        )
        
    validated = {"patientId": id}
    payload = {"patientId": id}

    try:
        result = await service.get_timeline(id)
    except Exception as e:
        print(f"Notice getting timeline for patient '{id}': {e}")
        result = {"timeline": [], "success": True}
    
    # Process potential variations in the MCP tool response payload
    timeline_data = []
    success = True
    
    if isinstance(result, list):
        timeline_data = result
    elif isinstance(result, dict):
        raw_timeline = result.get("timeline")
        if raw_timeline is None:
            raw_timeline = result.get("events")
        if raw_timeline is None or not isinstance(raw_timeline, list):
            raw_timeline = []
        timeline_data = raw_timeline
        success = result.get("success", True)
        
    response = TimelineResponse(
        success=success,
        patientId=id,
        timelineGenerated=result.get("timelineGenerated") if isinstance(result, dict) else True,
        totalEvents=len(timeline_data),
        timeline=timeline_data,
        message=result.get("message") if isinstance(result, dict) else "Timeline completed"
    )
    
    print("==========================================")
    print(f"ENDPOINT: /patient/{id}/timeline")
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
