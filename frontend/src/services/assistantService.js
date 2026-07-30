// assistantService.js
// Handles AI assistant chat calls. Connects to backend API Gateway → Groq (RAG pipeline).

const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
const API_BASE = configuredBaseUrl ? configuredBaseUrl.replace(/\/$/, "") : "";

/**
 * Send a message to the AI assistant backend.
 * @param {string} patientId - The patient identifier.
 * @param {string} message - User query.
 * @param {string} [token] - Optional JWT for authenticated endpoints.
 * @returns {Promise<{success: boolean, answer: string, sources: string[]}>}
 */
export const sendMessage = async (patientId, message, token) => {
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const payload = { patientId, message };
  const res = await fetch(`${API_BASE}/api/v1/assistant/chat`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || err.error || "Assistant request failed.");
  }
  return res.json();
};

