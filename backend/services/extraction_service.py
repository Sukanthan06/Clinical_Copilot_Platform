from typing import Any, Dict
from backend.services import mcp_client

class ExtractionService:
    async def extract_information(self, patientId: str, reportId: str) -> Dict[str, Any]:
        """
        Invokes extract_patient_information wrapper to perform medical extraction.
        """
        res = await mcp_client.extract_patient_information(patientId, reportId)
        return res.model_dump()
