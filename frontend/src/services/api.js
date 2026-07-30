const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

export const API_BASE_URL = configuredBaseUrl
  ? configuredBaseUrl.replace(/\/$/, "")
  : "";

export function requirePatientId() {
  const patientId = localStorage.getItem("patientId")?.trim();
  if (!patientId || patientId === "undefined") {
    throw new Error("Your session does not include a patient ID. Please sign in again.");
  }
  return patientId;
}

export async function readError(responseOrData, fallback) {
  if (!responseOrData) return fallback;
  
  if (typeof responseOrData === "object" && !(responseOrData instanceof Response)) {
    return responseOrData.detail || responseOrData.error || responseOrData.message || fallback;
  }
  
  if (responseOrData instanceof Response) {
    if (responseOrData.bodyUsed) {
      return fallback;
    }
    const body = await responseOrData.json().catch(() => ({}));
    return body.detail || body.error || body.message || fallback;
  }
  
  return fallback;
}
