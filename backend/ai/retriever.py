import httpx
from backend.config import settings
from typing import List, Dict, Any

class Retriever:
    def __init__(self, base_url: str | None = None):
        self.base_url = (base_url or settings.INTERNAL_API_BASE_URL or f"http://{settings.HOST}:{settings.PORT}").rstrip("/")

    async def get_patient_profile(self, patient_id: str) -> Dict[str, Any]:
        """Queries local backend API to retrieve unified patient profile details."""
        async with httpx.AsyncClient() as client:
            try:
                res = await client.get(f"{self.base_url}/patient/{patient_id}", timeout=10.0)
                if res.status_code == 200:
                    return res.json()
            except Exception as e:
                print(f"Error retrieving patient profile: {e}")
        return {"name": "Patient", "diagnoses": [], "medications": [], "allergies": []}

    async def get_timeline(self, patient_id: str) -> List[Dict[str, Any]]:
        """Queries local backend API to retrieve timeline history logs."""
        async with httpx.AsyncClient() as client:
            try:
                res = await client.get(f"{self.base_url}/patient/{patient_id}/timeline", timeout=10.0)
                if res.status_code == 200:
                    return res.json().get("timeline", [])
            except Exception as e:
                print(f"Error retrieving timeline: {e}")
        return []

async def generate_embedding(text: str, api_key: str) -> List[float]:
    """Generates a 1536-dimensional semantic query vector using Gemini API."""
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-2:embedContent?key={api_key}"
    payload = {
        "content": {
            "parts": [
                {
                    "text": text
                }
            ]
        },
        "outputDimensionality": 1536
    }
    async with httpx.AsyncClient() as client:
        res = await client.post(url, json=payload, timeout=10.0)
        res.raise_for_status()
        return res.json()["embedding"]["values"]
