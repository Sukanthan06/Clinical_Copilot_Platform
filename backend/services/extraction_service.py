from typing import Any, Dict
from backend.services import mcp_client

class ExtractionService:
    async def extract_information(self, patient_id: str, file_id: str) -> Dict[str, Any]:
        """
        Invokes extract_patient_information MCP tool to perform medical extraction.
        """
        # TODO: Connect to extract_patient_information tool on external MCP client
        return await mcp_client.extract_patient_information(patient_id, file_id)
