from typing import Any, Dict
from backend.services import mcp_client

class TrialService:
    async def get_trials(self, patient_id: str) -> Dict[str, Any]:
        """
        Calls search_clinical_trials MCP tool to retrieve clinical trials matching the patient.
        """
        return await mcp_client.search_clinical_trials(patient_id)
