from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field, model_validator

class AuthenticationRequest(BaseModel):
    email: str = Field(..., description="Email of the clinical user")
    password: str = Field(..., description="Password of the clinical user")
    action: str = Field(..., description="Action to perform (register or login)")
    name: Optional[str] = Field(None, description="Optional patient name for registration")

class AuthenticationResponse(BaseModel):
    success: bool = Field(True, description="Whether authentication was successful")
    action: Optional[str] = Field(None, description="The action performed")
    patientId: Optional[str] = Field(None, description="Matched patient ID")
    token: Optional[str] = Field(None, description="Active session or authentication token")
    name: Optional[str] = Field(None, description="Full name of the user/patient")
    message: Optional[str] = Field(None, description="Detailed message")

    @model_validator(mode="before")
    @classmethod
    def normalize_fields(cls, data: Any) -> Any:
        if isinstance(data, dict):
            data["patientId"] = data.get("patientId") or data.get("patient_id") or data.get("id") or data.get("userId") or data.get("user_id")
            data["token"] = data.get("token") or data.get("access_token") or data.get("session_token") or data.get("authToken")
            data["name"] = data.get("name") or data.get("displayName") or data.get("full_name")
        return data

    model_config = {
        "extra": "allow"
    }

class UploadRequest(BaseModel):
    patientId: str = Field(..., description="Associated patient ID")
    file: str = Field(..., description="Base64 encoded payload of the report")
    reportType: str = Field(..., description="The type of the report")
    fileName: str = Field(..., description="Original name of the report file")

class UploadResponse(BaseModel):
    success: bool = Field(True, description="Upload status success indicator")
    patientId: Optional[str] = Field(None, description="Generated or matched patient ID")
    reportId: Optional[str] = Field(None, description="Unique report entry identifier")
    fileId: Optional[str] = Field(None, description="Unique file storage identifier")
    fileUrl: Optional[str] = Field(None, description="The stored file URL")
    reportType: Optional[str] = Field(None, description="The report type")
    status: Optional[str] = Field(None, description="Detail upload status")
    message: Optional[str] = Field(None, description="Status feedback message")

    model_config = {
        "extra": "allow"
    }

class ExtractResponse(BaseModel):
    success: bool = Field(True, description="Extraction success indicator")
    patientId: Optional[str] = Field(None, description="Patient ID")
    reportId: Optional[str] = Field(None, description="Report ID")
    processed: bool = Field(True, description="Whether processing was completed")
    llm: Optional[str] = Field(None, description="LLM used")
    profileUpdated: bool = Field(True, description="Whether the profile was updated")
    embeddingStored: bool = Field(True, description="Whether embedding was stored")
    extractionQuality: Optional[str] = Field(None, description="Quality indicator")
    message: Optional[str] = Field(None, description="Detailed message")

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
    timelineGenerated: Optional[bool] = Field(None, description="Timeline generated status")
    totalEvents: Optional[int] = Field(None, description="Total events count")
    timeline: List[Dict[str, Any]] = Field(default_factory=list, description="Longitudinal timeline events list")
    message: Optional[str] = Field(None, description="Status message")

    model_config = {
        "extra": "allow"
    }

    model_config = {
        "extra": "allow"
    }

class ClinicalTrial(BaseModel):
    trialId: Optional[str] = Field(None, description="ClinicalTrials.gov identifier")
    title: Optional[str] = Field(None, description="Title of the clinical study trial")
    eligibilityScore: Optional[float] = Field(0.0, description="Eligibility score from MCP")
    eligibilityStatus: Optional[str] = Field(None, description="Clinical eligibility category status")
    reasoning: Optional[str] = Field(None, description="LLM clinical evaluation reasoning")
    matchingCriteria: List[str] = Field(default_factory=list, description="Matching inclusion criteria list")
    unmatchedCriteria: List[str] = Field(default_factory=list, description="Unmatched exclusion criteria list")
    phase: Optional[str] = Field(None, description="Trial advancement phase")
    status: Optional[str] = Field(None, description="Trial enrollment/recruitment status")
    locations: List[str] = Field(default_factory=list, description="Trial hospital locations list")

    model_config = {
        "extra": "allow"
    }

class ClinicalTrialResponse(BaseModel):
    success: bool = Field(True, description="Trial matching success status")
    patientId: Optional[str] = Field(None, description="Patient ID")
    conditionSearched: Optional[str] = Field(None, description="The condition queried")
    trialsCount: Optional[int] = Field(None, description="Total trials count matched")
    llmEvaluated: Optional[bool] = Field(None, description="Whether LLM was used for evaluation")
    llmEngine: Optional[str] = Field(None, description="The LLM engine used")
    trials: List[ClinicalTrial] = Field(default_factory=list, description="Matched trials ranked by eligibility score")

    model_config = {
        "extra": "allow"
    }

class ReferralResponse(BaseModel):
    success: bool = Field(True, description="Referral letter generation status")
    patientId: Optional[str] = Field(None, description="Patient ID")
    referralId: Optional[str] = Field(None, description="Unique identifier for the referral record")
    trialId: Optional[str] = Field(None, description="Trial ID matched")
    pdfUrl: Optional[str] = Field(None, description="Cloud storage address of the compiled PDF document")
    llmUsed: Optional[str] = Field(None, description="LLM model used")
    message: Optional[str] = Field(None, description="Status message")
    summary: Optional[Dict[str, Any]] = Field(None, description="Referral letter metadata summary")

    model_config = {
        "extra": "allow"
    }
