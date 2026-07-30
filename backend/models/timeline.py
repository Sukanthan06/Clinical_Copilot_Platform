from typing import Any, Dict, List, Optional
from pydantic import BaseModel

class TimelineResponse(BaseModel):
    success: bool
    patientId: str
    timelineGenerated: Optional[bool] = None
    totalEvents: Optional[int] = None
    timeline: List[Dict[str, Any]]
    message: Optional[str] = None

    model_config = {"extra": "allow"}
