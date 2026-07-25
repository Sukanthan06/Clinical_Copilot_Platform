from typing import Any, Dict
from backend.services import mcp_client
from mcp_client.tools import update_medical_timeline

class TimelineService:
    async def get_timeline(self, patient_id: str) -> Dict[str, Any]:
        """
        Calls update_medical_timeline wrapper to compile/update the patient's medical timeline.
        """
        res = await update_medical_timeline(mcp_client, patient_id)
        return res.model_dump()

