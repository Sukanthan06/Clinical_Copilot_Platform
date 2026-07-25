from typing import Any, Dict
from backend.services import mcp_client
from mcp_client.tools import search_clinical_trials

class TrialService:
    async def get_trials(self, patient_id: str) -> Dict[str, Any]:
        """
        Calls search_clinical_trials wrapper to retrieve clinical trials matching the patient.
        """
        res = await search_clinical_trials(mcp_client, patient_id)
        return res.model_dump()

