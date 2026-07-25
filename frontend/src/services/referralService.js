// referralService.js
// Handles referral generation. Currently returns mock data.
// Backend contract: generate_referral()

const MOCK_DELAY = 700;

export async function generateReferral({ hospital, doctor, reason }) {
  await wait(MOCK_DELAY);
  // TODO: replace with real call, e.g.
  // const res = await fetch(`${API_BASE_URL}/referral/generate`, { method: "POST", body: JSON.stringify({ hospital, doctor, reason }) });
  // return res.json();
  return {
    success: true,
    referral: {
      id: `ref-${Date.now()}`,
      hospital,
      doctor,
      reason,
      dateGenerated: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    },
  };
}

export async function downloadReferralPdf(referralId) {
  await wait(300);
  // TODO: call backend endpoint that streams the generated PDF
  return { success: true, referralId, url: "#" };
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
