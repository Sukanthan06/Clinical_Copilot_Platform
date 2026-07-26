from typing import Any, Dict, Optional
from backend.services import mcp_client

class ReferralService:
    async def create_referral(self, patientId: str, trialId: str, doctorName: Optional[str] = None, reason: Optional[str] = None) -> Dict[str, Any]:
        """
        Calls generate_referral wrapper to compile a referral PDF and return the URL.
        """
        res = await mcp_client.generate_referral(patientId, doctorName, reason, trialId=trialId)
        return res.model_dump()
