from typing import Any, Dict
from backend.services import mcp_client
from mcp_client.tools import generate_referral

class ReferralService:
    async def create_referral(self, patient_id: str, doctor_name: str, reason: str) -> Dict[str, Any]:
        """
        Calls generate_referral wrapper to compile a referral PDF and return the URL.
        """
        res = await generate_referral(mcp_client, patient_id, doctor_name, reason)
        return res.model_dump()

