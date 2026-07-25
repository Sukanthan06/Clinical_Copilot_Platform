from typing import Any, Dict, Optional
from backend.services import mcp_client

class ReferralService:
    async def create_referral(self, patient_id: str, doctor_name: str, reason: str, trial_id: Optional[str] = None) -> Dict[str, Any]:
        """
        Calls generate_referral wrapper to compile a referral PDF and return the URL.
        """
        res = await mcp_client.generate_referral(patient_id, doctor_name, reason, trialId=trial_id)
        return res.model_dump()



