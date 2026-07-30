from typing import Any, Dict, Optional
from pydantic import BaseModel, Field

class ExtractRequest(BaseModel):
    patientId: str = Field(..., description="The ID of the patient")
    reportId: Optional[str] = Field(None, description="The ID of the report")
    fileId: Optional[str] = Field(None, description="The ID of the uploaded file (legacy frontend key)")

class ExtractResponse(BaseModel):
    success: bool
    patientId: str
    reportId: str
    processed: bool
    llm: str
    profileUpdated: bool
    embeddingStored: bool
    extractionQuality: Optional[str] = None
    message: Optional[str] = None
    documentType: Optional[str] = None
    patientProfile: Optional[Dict[str, Any]] = None
    patient_profile: Optional[Dict[str, Any]] = None
    extractedText: Optional[str] = None
    extractedMedicalInfo: Optional[Dict[str, Any]] = None
    extracted_medical_info: Optional[Dict[str, Any]] = None

    model_config = {"extra": "allow"}
