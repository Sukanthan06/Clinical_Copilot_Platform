from typing import Any, Dict, List, Optional
from pydantic import BaseModel

class TrialResponse(BaseModel):
    success: bool
    patientId: str
    conditionSearched: Optional[str] = None
    trialsCount: Optional[int] = None
    llmEvaluated: Optional[bool] = None
    llmEngine: Optional[str] = None
    trials: List[Dict[str, Any]]

    model_config = {"extra": "allow"}
