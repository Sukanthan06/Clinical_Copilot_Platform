from fastapi import APIRouter, Depends, status
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
    result = await service.get_trials(id)
    
    trials_data = []
    success = True
    
    if isinstance(result, list):
        trials_data = result
    elif isinstance(result, dict):
        trials_data = result.get("trials") or result.get("results") or [result]
        success = result.get("success", True)
        
    return TrialResponse(
        success=success,
        patientId=id,
        trials=trials_data
    )
