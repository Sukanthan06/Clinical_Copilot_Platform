from pydantic import BaseModel

class PatientUploadResponse(BaseModel):
    success: bool
    patientId: str
    fileId: str
    message: str

