from typing import Any, Dict
from backend.services import mcp_client
from mcp_client.tools import extract_patient_information

class ExtractionService:
    async def extract_information(self, patient_id: str, file_id: str) -> Dict[str, Any]:
        """
        Invokes extract_patient_information wrapper to perform medical extraction.
        """
        res = await extract_patient_information(mcp_client, patient_id, file_id)
        return res.model_dump()

