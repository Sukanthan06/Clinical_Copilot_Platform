// timelineService.js
// Supplies medical timeline events. Connects to backend API Gateway.

import { API_BASE_URL, requirePatientId } from "./api.js";

export async function getTimelineEvents() {
  const patientId = requirePatientId();
  try {
    const res = await fetch(`${API_BASE_URL}/patient/${patientId}/timeline`);
    if (!res.ok) {
      throw new Error("Timeline retrieval failed");
    }
    const data = await res.json(); // { success: true, timeline: [...] }

    if (data.timeline && data.timeline.length > 0) {
      // NOTE: We do NOT cache timeline to localStorage — MongoDB via MCP is source of truth.

      const mapped = data.timeline.map((item, index) => {
        const parsedDate = new Date(item.date);
        const displayDate = isNaN(parsedDate.getTime()) 
          ? item.date 
          : parsedDate.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
          
        return {
          id: item.eventId || `tl-live-${index}`,
          date: displayDate,
          type: "consultation",
          event: item.title || "Clinical Event",
          description: item.description || "Medical timeline event logged.",
          icon: "consultation",
          color: "blue"
        };
      });
      return { events: mapped };
    }
  } catch (err) {
    console.error("Failed to fetch live timeline events:", err);
  }
  
  return { events: [] };
}

export async function addTimelineEvent(event) {
  throw new Error("Manual timeline entries are not supported by the configured MCP tools.");
}
