import json
from fastapi import APIRouter, Depends, HTTPException, status
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
    incoming = request.model_dump()
    
    if not request.patientId:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="patientId is required"
        )
    if not request.trialId:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="trialId is required"
        )
        
    validated = {
        "patientId": request.patientId,
        "trialId": request.trialId,
        "doctorName": request.doctorName,
        "reason": request.reason
    }
    
    payload = {
        "patientId": request.patientId,
        "trialId": request.trialId
    }

    result = await service.create_referral(
        patientId=request.patientId,
        trialId=request.trialId,
        doctorName=request.doctorName,
        reason=request.reason
    )
    
    # Process potential nested response variations
    success = result.get("success", True)
    pdf_url = result.get("pdfUrl") or result.get("pdf_url") or ""
    referral_id = result.get("referralId") or result.get("referral_id") or ""
    message = result.get("message") or "Referral letter PDF generated successfully."
    
    # Check for mismatches
    if not pdf_url:
        print("❌ MISMATCH")
        print("Expected: pdfUrl from MCP")
        print(f"Found: None in {result}")

    response = ReferralResponse(
        success=success,
        patientId=result.get("patientId"),
        referralId=referral_id,
        trialId=result.get("trialId"),
        pdfUrl=pdf_url,
        llmUsed=result.get("llmUsed") or result.get("llm") or "Gemini",
        message=message,
        summary=result.get("summary")
    )
    
    print("==========================================")
    print("ENDPOINT: /patient/referral")
    print("==========================================")
    print("Incoming Request:")
    print(json.dumps(incoming, indent=2, default=str))
    print("v")
    print("Validated Request:")
    print(json.dumps(validated, indent=2, default=str))
    print("v")
    print("Payload Sent To MCP:")
    print(json.dumps(payload, indent=2, default=str))
    print("v")
    print("Raw MCP Response:")
    print(json.dumps(result, indent=2, default=str))
    print("v")
    print("Mapped Response:")
    print(response.model_dump_json(indent=2))
    print("v")
    print("Returned Response:")
    print(response.model_dump_json(indent=2))
    print("==========================================")
    
    return response
