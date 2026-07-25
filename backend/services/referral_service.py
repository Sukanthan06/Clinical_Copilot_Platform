from typing import Any, Dict
from backend.services import mcp_client

class ReferralService:
    async def create_referral(self, patient_id: str, doctor_name: str, reason: str) -> Dict[str, Any]:
        """
        Calls generate_referral MCP tool to compile a referral PDF and return the URL.
        """
        return await mcp_client.generate_referral(patient_id, doctor_name, reason)
