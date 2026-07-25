from typing import Any, Dict
from backend.services import mcp_client

class ExtractionService:
    async def extract_information(self, patient_id: str, file_id: str) -> Dict[str, Any]:
        """
        Invokes extract_patient_information wrapper to perform medical extraction.
        """
        res = await mcp_client.extract_patient_information(patient_id, file_id)
        return res.model_dump()


