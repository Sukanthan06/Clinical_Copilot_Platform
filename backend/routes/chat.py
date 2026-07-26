import json
from fastapi import APIRouter, HTTPException, status
from backend.ai.models import ChatRequest, ChatResponse
from backend.ai.assistant import AIAssistant

router = APIRouter(prefix="/api/v1/assistant", tags=["AI Assistant"])

# Instantiate orchestrator as a singleton to persist conversation memory
assistant = AIAssistant()

@router.post("/chat", response_model=ChatResponse, status_code=status.HTTP_200_OK)
async def chat_with_assistant(request: ChatRequest) -> ChatResponse:
    """
    Enables interactive conversation with Clinical Copilot.
    Queries relevant patient reports from Pinecone and aggregates profiles.
    """
    incoming = request.model_dump()
    
    if not request.patientId:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="patientId is required"
        )
    if not request.message:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="message is required"
        )
        
    try:
        res = await assistant.answer_question(request.patientId, request.message)
        
        response = ChatResponse(
            success=res.get("success", True),
            answer=res.get("answer", ""),
            sources=res.get("sources", [])
        )
        
        print("==========================================")
        print("ENDPOINT: /api/v1/assistant/chat")
        print("==========================================")
        print("Incoming Request:")
        print(json.dumps(incoming, indent=2, default=str))
        print("↓")
        print("Assistant Answer:")
        print(response.answer)
        print("Sources Query:")
        print(response.sources)
        print("==========================================")
        
        return response
        
    except Exception as e:
        print(f"Error in chat_with_assistant endpoint: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while generating the assistant response: {str(e)}"
        )
