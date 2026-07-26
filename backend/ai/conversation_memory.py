from collections import defaultdict
from typing import List, Dict

class ConversationMemory:
    def __init__(self, max_messages: int = 10):
        self.max_messages = max_messages
        # maps patientId -> list of message dicts: [{"role": "user"/"assistant", "content": "..."}]
        self.history = defaultdict(list)

    def get_history(self, patient_id: str) -> List[Dict[str, str]]:
        """Returns the last N messages in the conversation history for a patient."""
        return self.history[patient_id][-self.max_messages:]

    def add_message(self, patient_id: str, role: str, content: str):
        """Adds a message to the history, enforcing length constraints."""
        self.history[patient_id].append({"role": role, "content": content})
        if len(self.history[patient_id]) > self.max_messages:
            self.history[patient_id] = self.history[patient_id][-self.max_messages:]
