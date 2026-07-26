import asyncio
from groq import Groq
from typing import List, Dict

class GroqClient:
    def __init__(self, api_key: str, model: str = "llama-3.3-70b-versatile"):
        self.client = Groq(api_key=api_key)
        self.model = model

    async def generate_response(self, messages: List[Dict[str, str]]) -> str:
        """
        Calls the Groq completions endpoint asynchronously.
        Sets temperature low for clinical accuracy.
        """
        loop = asyncio.get_event_loop()
        response = await loop.run_in_executor(
            None,
            lambda: self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=0.1,
            )
        )
        return response.choices[0].message.content
