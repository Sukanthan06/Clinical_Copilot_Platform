from typing import Any, Dict, List
from pydantic import BaseModel

class TimelineResponse(BaseModel):
    success: bool
    patientId: str
    timeline: List[Dict[str, Any]]
