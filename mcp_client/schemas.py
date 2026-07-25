from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field

class AuthenticationRequest(BaseModel):
    username: str = Field(..., description="Username of the clinical user")
    password: str = Field(..., description="Password of the clinical user")
    action: str = Field(..., description="Action to perform (register or login)")

class AuthenticationResponse(BaseModel):
    success: bool = Field(..., description="Whether authentication was successful")
    message: str = Field(..., description="Detailed message")
    token: Optional[str] = Field(None, description="Active session or authentication token")
    userId: Optional[str] = Field(None, description="Unique ID of the user account")

class UploadRequest(BaseModel):
    patientId: Optional[str] = Field(None, description="Associated patient ID if existing")
    fileName: str = Field(..., description="Original name of the report file")
    contentType: str = Field(..., description="HTTP media content type of the report")
    base64Content: str = Field(..., description="Base64 encoded payload of the report")

class UploadResponse(BaseModel):
    success: bool = Field(..., description="Upload status success indicator")
    patientId: str = Field(..., description="Generated or matched patient ID")
    fileId: str = Field(..., description="Unique file storage identifier")
    message: str = Field(..., description="Status feedback message")

class PatientProfile(BaseModel):
    patientId: str = Field(..., description="Unique patient identifier")
    name: str = Field(..., description="Full legal name of the patient")
    dob: Optional[str] = Field(None, description="Date of birth in YYYY-MM-DD format")
    diagnoses: List[str] = Field(default_factory=list, description="Extracted clinical diagnoses list")
    allergies: List[str] = Field(default_factory=list, description="Identified drug or systemic allergies")
    medications: List[str] = Field(default_factory=list, description="Currently prescribed patient medications")

class TimelineResponse(BaseModel):
    success: bool = Field(..., description="Timeline compilation success status")
    patientId: str = Field(..., description="Patient ID")
    timeline: List[Dict[str, Any]] = Field(default_factory=list, description="Longitudinal timeline events list")

class ClinicalTrial(BaseModel):
    trialId: str = Field(..., description="ClinicalTrials.gov identifier")
    title: str = Field(..., description="Title of the clinical study trial")
    phase: Optional[str] = Field(None, description="Trial advancement phase (e.g. Phase III)")
    status: Optional[str] = Field(None, description="Trial enrollment/recruitment status")
    matchScore: float = Field(..., description="Eligibility match coefficient from 0.0 to 1.0")

class ClinicalTrialResponse(BaseModel):
    success: bool = Field(..., description="Trial matching success status")
    patientId: str = Field(..., description="Patient ID")
    trials: List[ClinicalTrial] = Field(default_factory=list, description="Matched trials ranked by eligibility score")

class ReferralResponse(BaseModel):
    success: bool = Field(..., description="Referral letter generation status")
    pdfUrl: str = Field(..., description="Cloud storage address of the compiled PDF document")
    message: str = Field(..., description="Status message")
