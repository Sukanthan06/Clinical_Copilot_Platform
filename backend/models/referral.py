from typing import Any, Dict, Optional
from pydantic import BaseModel

class ReferralRequest(BaseModel):
    patientId: str
    trialId: str
    doctorName: Optional[str] = None
    reason: Optional[str] = None

class ReferralResponse(BaseModel):
    success: bool
    patientId: Optional[str] = None
    referralId: Optional[str] = None
    trialId: Optional[str] = None
    pdfUrl: str
    llmUsed: Optional[str] = None
    message: Optional[str] = None
    summary: Optional[Dict[str, Any]] = None

    model_config = {"extra": "allow"}
