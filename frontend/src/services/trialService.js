// trialService.js
// Supplies clinical trial matches. Currently returns mock data.
// Backend contract: search_clinical_trials()

import { clinicalTrials } from "../data/trialData.js";

const MOCK_DELAY = 500;

export async function searchClinicalTrials(query = {}) {
  await wait(MOCK_DELAY);
  // TODO: replace with real call, e.g.
  // const res = await fetch(`${API_BASE_URL}/trials/search`, { method: "POST", body: JSON.stringify(query) });
  // return res.json();
  return { trials: clinicalTrials };
}

export async function applyToTrial(trialId) {
  await wait(500);
  return { success: true, trialId, status: "Application submitted" };
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
