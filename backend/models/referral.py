from pydantic import BaseModel, Field

class ReferralRequest(BaseModel):
    patientId: str = Field(..., description="The patient ID to refer")
    doctorName: str = Field(..., description="Recipient doctor's name")
    reason: str = Field(..., description="Reason/notes for referring the patient")

class ReferralResponse(BaseModel):
    success: bool
    pdfUrl: str
    message: str
