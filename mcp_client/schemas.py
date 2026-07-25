from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field

class AuthenticationRequest(BaseModel):
    username: str = Field(..., description="Username of the clinical user")
    password: str = Field(..., description="Password of the clinical user")
    action: str = Field(..., description="Action to perform (register or login)")

class AuthenticationResponse(BaseModel):
    success: bool = Field(True, description="Whether authentication was successful")
    message: str = Field("User authenticated successfully", description="Detailed message")
    token: Optional[str] = Field(None, description="Active session or authentication token")
    userId: Optional[str] = Field(None, description="Unique ID of the user account")
    patientId: Optional[str] = Field(None, description="Matched patient ID if registration linked")
    name: Optional[str] = Field(None, description="Full legal name of the patient")

    model_config = {
        "extra": "allow"
    }

class UploadRequest(BaseModel):
    patientId: Optional[str] = Field(None, description="Associated patient ID if existing")
    fileName: str = Field(..., description="Original name of the report file")
    contentType: str = Field(..., description="HTTP media content type of the report")
    base64Content: str = Field(..., description="Base64 encoded payload of the report")

class UploadResponse(BaseModel):
    success: bool = Field(True, description="Upload status success indicator")
    patientId: Optional[str] = Field(None, description="Generated or matched patient ID")
    fileId: Optional[str] = Field(None, description="Unique file storage identifier")
    message: str = Field("Report uploaded and stored successfully", description="Status feedback message")

    model_config = {
        "extra": "allow"
    }

class PatientProfile(BaseModel):
    patientId: Optional[str] = Field(None, description="Unique patient identifier")
    name: Optional[str] = Field(None, description="Full legal name of the patient")
    dob: Optional[str] = Field(None, description="Date of birth in YYYY-MM-DD format")
    diagnoses: List[str] = Field(default_factory=list, description="Extracted clinical diagnoses list")
    allergies: List[str] = Field(default_factory=list, description="Identified drug or systemic allergies")
    medications: List[str] = Field(default_factory=list, description="Currently prescribed patient medications")

    model_config = {
        "extra": "allow"
    }

class TimelineResponse(BaseModel):
    success: bool = Field(True, description="Timeline compilation success status")
    patientId: Optional[str] = Field(None, description="Patient ID")
    timeline: List[Dict[str, Any]] = Field(default_factory=list, description="Longitudinal timeline events list")

    model_config = {
        "extra": "allow"
    }

class ClinicalTrial(BaseModel):
    trialId: Optional[str] = Field(None, description="ClinicalTrials.gov identifier")
    title: Optional[str] = Field(None, description="Title of the clinical study trial")
    phase: Optional[str] = Field(None, description="Trial advancement phase (e.g. Phase III)")
    status: Optional[str] = Field(None, description="Trial enrollment/recruitment status")
    matchScore: Optional[float] = Field(0.0, description="Eligibility match coefficient from 0.0 to 1.0")

    model_config = {
        "extra": "allow"
    }

class ClinicalTrialResponse(BaseModel):
    success: bool = Field(True, description="Trial matching success status")
    patientId: Optional[str] = Field(None, description="Patient ID")
    trials: List[ClinicalTrial] = Field(default_factory=list, description="Matched trials ranked by eligibility score")

    model_config = {
        "extra": "allow"
    }

class ReferralResponse(BaseModel):
    success: bool = Field(True, description="Referral letter generation status")
    pdfUrl: Optional[str] = Field(None, description="Cloud storage address of the compiled PDF document")
    message: str = Field("Referral generated successfully", description="Status message")

    model_config = {
        "extra": "allow"
    }

