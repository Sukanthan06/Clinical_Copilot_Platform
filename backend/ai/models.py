from pydantic import BaseModel, Field
from typing import List

class ChatRequest(BaseModel):
    patientId: str = Field(..., description="The ID of the patient")
    message: str = Field(..., description="The message or question from the user")

class ChatResponse(BaseModel):
    success: bool = Field(True, description="Indicates whether the chat operation succeeded")
    answer: str = Field(..., description="The generated medical assistant response answer")
    sources: List[str] = Field(default_factory=list, description="List of report names or sources queried")
