// timelineService.js
// Supplies medical timeline events. Currently returns mock data.
// Backend contract: update_medical_timeline()

import { timelineEvents } from "../data/timelineData.js";

const MOCK_DELAY = 400;

export async function getTimelineEvents() {
  await wait(MOCK_DELAY);
  // TODO: replace with real call, e.g.
  // const res = await fetch(`${API_BASE_URL}/timeline`);
  // return res.json();
  return { events: timelineEvents };
}

export async function addTimelineEvent(event) {
  await wait(500);
  // TODO: call update_medical_timeline() on the backend
  return { success: true, event: { id: `tl-${Date.now()}`, ...event } };
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
