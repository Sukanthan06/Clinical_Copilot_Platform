import base64
from typing import Any, Dict
from backend.services import mcp_client
from mcp_client.tools import upload_medical_report

class PatientService:
    async def upload_report(self, file_name: str, file_content: bytes, content_type: str) -> Dict[str, Any]:
        """
        Encodes report file bytes to Base64, then calls the upload_medical_report wrapper.
        """
        file_content_base64 = base64.b64encode(file_content).decode("utf-8")
        res = await upload_medical_report(mcp_client, None, file_name, content_type, file_content_base64)
        return res.model_dump()


