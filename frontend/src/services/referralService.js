// referralService.js
// Handles referral generation. Connects to backend API Gateway → MCP → MongoDB.
// MCP tool: generate_referral({ patientId, trialId })
// MCP response: { success, referralId, patientId, trialId, pdfUrl, llm }

const API_BASE_URL = "http://127.0.0.1:8000";

export async function generateReferral({ trialId }) {
  const patientId = localStorage.getItem("patientId") || "";

  if (!patientId) {
    throw new Error("No patient ID found. Please log in again.");
  }
  if (!trialId) {
    throw new Error("No trial ID provided. Please select a trial.");
  }

  const res = await fetch(`${API_BASE_URL}/patient/referral`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ patientId, trialId }),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail || errData.error || "Referral generation failed");
  }

  // MCP response shape:
  // { success, referralId, patientId, trialId, pdfUrl, llm, message }
  const data = await res.json();

  // Cache the PDF URL for later access
  if (data.pdfUrl) {
    localStorage.setItem("lastReferralPdfUrl", data.pdfUrl);
    localStorage.setItem("lastReferralId", data.referralId || "");
    localStorage.setItem("lastTrialId", trialId);
  }

  return {
    success: data.success ?? true,
    referral: {
      referralId: data.referralId || `ref-${Date.now()}`,
      patientId: data.patientId || patientId,
      trialId: data.trialId || trialId,
      pdfUrl: data.pdfUrl || "",
      llm: data.llm || data.llmUsed || "—",
      message: data.message || "Referral generated",
      dateGenerated: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    },
  };
}

export async function openReferralPdf() {
  const url = localStorage.getItem("lastReferralPdfUrl");
  if (url) {
    window.open(url, "_blank");
    return { success: true, url };
  }
  return { success: false };
}
