from typing import Any, Dict
from backend.services import mcp_client

class TimelineService:
    async def get_timeline(self, patient_id: str) -> Dict[str, Any]:
        """
        Calls update_medical_timeline MCP tool to compile/update the patient's medical timeline.
        """
        return await mcp_client.update_medical_timeline(patient_id)
