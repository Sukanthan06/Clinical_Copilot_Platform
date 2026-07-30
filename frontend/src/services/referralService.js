// referralService.js
// Handles referral generation. Connects to backend API Gateway → MCP → MongoDB.
// MCP tool: generate_referral({ patientId, trialId })
// MCP response: { success, referralId, patientId, trialId, pdfUrl, llm }

import { API_BASE_URL, readError, requirePatientId } from "./api.js";

export async function generateReferral({ trialId }) {
  const patientId = requirePatientId();

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
    throw new Error(await readError(res, "Referral generation failed"));
  }

  // MCP response shape:
  // { success, referralId, patientId, trialId, pdfUrl, llm, message }
  const data = await res.json();

  // Cache the PDF URL for later access (patient-scoped)
  if (data.pdfUrl) {
    localStorage.setItem(`lastReferralPdfUrl_${patientId}`, data.pdfUrl);
    localStorage.setItem("lastReferralPdfUrl", data.pdfUrl);
    localStorage.setItem(`lastReferralId_${patientId}`, data.referralId || "");
    localStorage.setItem(`lastTrialId_${patientId}`, trialId);
  }

  return {
    success: data.success ?? true,
    referral: {
      referralId: data.referralId,
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
  const patientId = localStorage.getItem("patientId") || "";
  const url = patientId 
    ? localStorage.getItem(`lastReferralPdfUrl_${patientId}`) || localStorage.getItem("lastReferralPdfUrl")
    : localStorage.getItem("lastReferralPdfUrl");
  if (url) {
    window.open(url, "_blank");
    return { success: true, url };
  }
  return { success: false };
}
