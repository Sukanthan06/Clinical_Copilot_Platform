from fastapi import APIRouter, Depends, status
from backend.models.referral import ReferralRequest, ReferralResponse
from backend.services.referral_service import ReferralService

router = APIRouter(prefix="/patient", tags=["Referrals"])

def get_referral_service() -> ReferralService:
    return ReferralService()

@router.post("/referral", response_model=ReferralResponse, status_code=status.HTTP_201_CREATED)
async def generate_referral(
    request: ReferralRequest, 
    service: ReferralService = Depends(get_referral_service)
) -> ReferralResponse:
    """
    Triggers generation of a clinical referral letter by calling the generate_referral MCP tool.
    """
    result = await service.create_referral(
        patient_id=request.patientId,
        doctor_name=request.doctorName,
        reason=request.reason
    )
    
    return ReferralResponse(
        success=result.get("success", True),
        pdfUrl=result.get("pdfUrl") or result.get("pdf_url") or "",
        message=result.get("message") or "Referral letter PDF generated successfully."
    )
