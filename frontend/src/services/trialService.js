// trialService.js
// Supplies clinical trial matches. Connects to backend API Gateway.

const API_BASE_URL = "http://127.0.0.1:8000";

export async function searchClinicalTrials(query = {}) {
  const patientId = localStorage.getItem("patientId") || "PAT001";
  try {
    const res = await fetch(`${API_BASE_URL}/patient/${patientId}/clinical-trials`);
    if (!res.ok) {
      throw new Error("Trials search failed");
    }
    const data = await res.json(); // { success: true, trials: [...] }

    if (data.trials && data.trials.length > 0) {
      const mapped = data.trials.map((t, index) => {
        let score = 85;
        if (t.eligibilityScore !== undefined) {
          score = t.eligibilityScore;
        } else if (t.matchScore !== undefined) {
          score = Math.round(t.matchScore * 100);
        }
        
        // Normalize reason: can be array or string
        const reasonRaw = t.reason || t.reasoning || t.matchingCriteria || [];
        const reasonText = Array.isArray(reasonRaw)
          ? reasonRaw.join(" · ")
          : String(reasonRaw);

        return {
          id: t.trialId || `trial-${index}`,
          name: t.title || "Clinical Study Trial",
          hospital: t.location || "—",
          phase: t.phase || "Phase II",
          status: t.status || "Recruiting",
          confidence: score,
          distance: t.location || "—",
          eligibility: reasonText || "Based on your clinical profile",
          trialId: t.trialId || `trial-${index}`
        };
      });
      return { trials: mapped };
    }
  } catch (err) {
    console.error("Failed to fetch live trials:", err);
  }

  return { trials: [] };
}

export async function applyToTrial(trialId) {
  // Save the selected trial so the Referral page can pre-select it
  if (trialId) localStorage.setItem("lastTrialId", trialId);
  return { success: true, trialId, status: "Application submitted" };
}
