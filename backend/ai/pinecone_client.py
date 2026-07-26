import asyncio
from pinecone import Pinecone
from typing import List, Dict, Any

class PineconeClient:
    def __init__(self, api_key: str, index_name: str = "clinical-copilot"):
        self.pc = Pinecone(api_key=api_key)
        self.index = self.pc.Index(index_name)

    async def search(self, vector: List[float], top_k: int = 5, patient_id: str = None) -> List[Dict[str, Any]]:
        """
        Queries the Pinecone index using the provided vector.
        Filters by patientId namespace/metadata if passed.
        """
        filter_dict = {}
        if patient_id:
            filter_dict["patientId"] = patient_id
            
        loop = asyncio.get_event_loop()
        results = await loop.run_in_executor(
            None,
            lambda: self.index.query(
                vector=vector,
                top_k=top_k,
                filter=filter_dict,
                include_metadata=True
            )
        )
        
        matches = []
        for match in results.matches:
            metadata = match.metadata or {}
            matches.append({
                "id": match.id,
                "score": match.score,
                "text": metadata.get("text") or metadata.get("content") or "",
                "source": metadata.get("fileName") or metadata.get("file") or "Medical Report"
            })
        return matches
