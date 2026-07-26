import os
from typing import Dict, Any, List
from backend.ai.groq_client import GroqClient
from backend.ai.pinecone_client import PineconeClient
from backend.ai.retriever import Retriever, generate_embedding
from backend.ai.prompt_builder import PromptBuilder
from backend.ai.conversation_memory import ConversationMemory

class AIAssistant:
    def __init__(self):
        gemini_key = os.getenv("GEMINI_API_KEY", "")
        groq_key = os.getenv("GROK_API_KEY", "")
        pinecone_key = os.getenv("PINECONE_API_KEY", "")
        pinecone_index = os.getenv("PINECONE_INDEX", "clinical-copilot")
        
        self.gemini_key = gemini_key
        self.groq_client = GroqClient(api_key=groq_key)
        self.pinecone_client = PineconeClient(api_key=pinecone_key, index_name=pinecone_index)
        self.retriever = Retriever()
        self.memory = ConversationMemory()

    async def answer_question(self, patient_id: str, question: str) -> Dict[str, Any]:
        """
        Runs the full RAG pipeline:
        1. Retrieves profile & timeline
        2. Embeds question & queries Pinecone (top K = 5)
        3. Formats prompt & prepends history
        4. Invokes Groq & updates session state history
        """
        # 1. Fetch patient profile
        profile = await self.retriever.get_patient_profile(patient_id)
        
        # 2. Fetch timeline
        timeline = await self.retriever.get_timeline(patient_id)
        
        # 3. Generate embedding for user question
        try:
            embedding = await generate_embedding(question, self.gemini_key)
        except Exception as e:
            print(f"Error generating query embedding: {e}")
            # Fallback to zero vector to prevent query failure if embedding API is rate limited
            embedding = [0.0] * 1536
        
        # 4. Search Pinecone for chunks
        chunks = []
        try:
            chunks = await self.pinecone_client.search(embedding, top_k=5, patient_id=patient_id)
        except Exception as e:
            print(f"Error searching Pinecone: {e}")
        
        # 5. Build system prompt context
        system_prompt = PromptBuilder.build_system_prompt(profile, timeline, chunks)
        
        # 6. Retrieve history and format messages
        messages = [{"role": "system", "content": system_prompt}]
        history = self.memory.get_history(patient_id)
        messages.extend(history)
        messages.append({"role": "user", "content": question})
        
        # 7. Generate response from Groq
        try:
            answer = await self.groq_client.generate_response(messages)
        except Exception as e:
            print(f"Error generating response from Groq: {e}")
            answer = "I'm having trouble connecting to the medical processing service right now. Please try again in a moment."
        
        # 8. Update conversation history
        self.memory.add_message(patient_id, "user", question)
        self.memory.add_message(patient_id, "assistant", answer)
        
        # Extract unique sources
        sources = list(set([c["source"] for c in chunks if c.get("source")]))
        
        return {
            "success": True,
            "answer": answer,
            "sources": sources
        }
