from typing import Any, Dict, List
from pydantic import BaseModel

class TrialResponse(BaseModel):
    success: bool
    patientId: str
    trials: List[Dict[str, Any]]
