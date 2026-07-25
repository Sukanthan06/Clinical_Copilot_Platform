from typing import Any, Dict
from pydantic import BaseModel, Field

class ExtractRequest(BaseModel):
    patientId: str = Field(..., description="The ID of the patient")
    fileId: str = Field(..., description="The ID of the uploaded file")

class ExtractResponse(BaseModel):
    success: bool
    patient_profile: Dict[str, Any]
