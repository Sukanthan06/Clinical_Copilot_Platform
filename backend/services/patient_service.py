import base64
from typing import Any, Dict, Optional
from backend.services import mcp_client

class PatientService:
    async def upload_report(self, patientId: Optional[str], file_name: str, file_content: bytes, report_type: str) -> Dict[str, Any]:
        """
        Encodes report file bytes to Base64, then calls the upload_medical_report wrapper.
        """
        file_content_base64 = base64.b64encode(file_content).decode("utf-8")
        res = await mcp_client.upload_medical_report(patientId, file_name, report_type, file_content_base64)
        return res.model_dump()

    async def get_profile(self, patient_id: str) -> Dict[str, Any]:
        return (await mcp_client.get_patient_profile(patient_id)).model_dump()

    async def list_reports(self, patient_id: str) -> Dict[str, Any]:
        return await mcp_client.list_medical_reports(patient_id)
