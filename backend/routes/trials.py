import json
from fastapi import APIRouter, Depends, HTTPException, status
from backend.models.trial import TrialResponse
from backend.services.trial_service import TrialService

router = APIRouter(prefix="/patient", tags=["Clinical Trials"])

def get_trial_service() -> TrialService:
    return TrialService()

@router.get("/{id}/clinical-trials", response_model=TrialResponse, status_code=status.HTTP_200_OK)
async def get_clinical_trials(
    id: str, 
    service: TrialService = Depends(get_trial_service)
) -> TrialResponse:
    """
    Finds and ranks matching clinical trials for a patient by calling 
    the search_clinical_trials MCP tool.
    """
    incoming = {"id_parameter": id}
    
    if not id or id == "undefined":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="patientId is required"
        )
        
    validated = {"patientId": id}
    payload = {"patientId": id}

    result = await service.get_trials(id)
    
    trials_data = []
    success = True
    
    if isinstance(result, list):
        trials_data = result
    elif isinstance(result, dict):
        trials_data = result.get("trials") or result.get("results") or [result]
        success = result.get("success", True)
        
    # Check for mismatches
    if isinstance(result, dict) and "trials" not in result:
        print("❌ MISMATCH")
        print("Expected: trials key from MCP")
        print(f"Found: {list(result.keys())}")
        
    response = TrialResponse(
        success=success,
        patientId=id,
        conditionSearched=result.get("conditionSearched") or result.get("disease") if isinstance(result, dict) else None,
        trialsCount=result.get("trialsCount") if isinstance(result, dict) else len(trials_data),
        llmEvaluated=result.get("llmEvaluated") if isinstance(result, dict) else True,
        llmEngine=result.get("llmEngine") if isinstance(result, dict) else "Gemini",
        trials=trials_data
    )
    
    print("==========================================")
    print(f"ENDPOINT: /patient/{id}/clinical-trials")
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
