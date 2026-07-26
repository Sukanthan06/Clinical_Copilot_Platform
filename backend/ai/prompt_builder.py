from typing import List, Dict, Any

class PromptBuilder:
    @staticmethod
    def build_system_prompt(profile: Dict[str, Any], timeline: List[Dict[str, Any]], chunks: List[Dict[str, Any]]) -> str:
        """
        Structures the extracted health summary, longitudinal visits, and report chunks
        into a clean, detailed prompt context for the LLM.
        """
        # Patient Details
        name = profile.get("name") or "Unknown"
        age = profile.get("age") or "—"
        gender = profile.get("gender") or "—"
        blood_group = profile.get("bloodGroup") or "—"
        
        profile_str = (
            f"Name: {name}\n"
            f"Age: {age} years\n"
            f"Gender: {gender}\n"
            f"Blood Group: {blood_group}\n"
            f"Diagnoses: {', '.join(profile.get('diagnoses', [])) or 'None'}\n"
            f"Medications: {', '.join(profile.get('medications', [])) or 'None'}\n"
            f"Allergies: {', '.join(profile.get('allergies', [])) or 'None'}\n"
        )

        # Timeline Records
        timeline_str = ""
        for evt in timeline:
            date = evt.get("date") or "Unknown Date"
            title = evt.get("title") or "Clinical Event"
            desc = evt.get("description") or ""
            timeline_str += f"- [{date}] {title}: {desc}\n"
        if not timeline_str:
            timeline_str = "No events logged in patient timeline.\n"

        # Report Chunks
        chunks_str = ""
        for chunk in chunks:
            text = chunk.get("text", "").strip()
            source = chunk.get("source") or "Medical Report"
            if text:
                chunks_str += f"[Source: {source}]\n{text}\n\n"
        if not chunks_str:
            chunks_str = "No semantic text chunks found in medical reports.\n"

        return (
            "You are Clinical Copilot, an AI healthcare assistant.\n"
            "Answer the patient's questions ONLY using the provided patient profile, medical report chunks, and timeline data.\n"
            "Be precise, professional, and medically sound. Never hallucinate details.\n"
            "If the information is not available in the records, say: 'I couldn't find that information in your medical records.'\n\n"
            "=== PATIENT PROFILE ===\n"
            f"{profile_str}\n"
            "=== MEDICAL TIMELINE ===\n"
            f"{timeline_str}\n"
            "=== RELEVANT REPORT CHUNKS ===\n"
            f"{chunks_str}"
        )
