from typing import List, Optional
from pydantic import BaseModel, Field

class PatientUploadResponse(BaseModel):
    success: bool
    patientId: str
    reportId: str
    fileId: str
    fileUrl: Optional[str] = None
    reportType: str
    status: Optional[str] = None
    message: str

class PatientProfile(BaseModel):
    patientId: str = Field(..., description="Unique patient identifier")
    name: str = Field(..., description="Full name of the patient")
    dob: Optional[str] = Field("1983-06-15", description="Date of birth")
    gender: Optional[str] = Field("Female", description="Gender of the patient")
    bloodGroup: Optional[str] = Field("O+", description="Blood group of the patient")
    diagnoses: List[str] = Field(default_factory=list, description="List of diagnoses")
    medications: List[str] = Field(default_factory=list, description="List of medications")
    allergies: List[str] = Field(default_factory=list, description="List of identified allergies")
