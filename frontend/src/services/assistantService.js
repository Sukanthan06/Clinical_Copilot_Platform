import axios from "axios";

// Base URL can be set via VITE_API_BASE in .env (e.g., http://localhost:8000)
const API_BASE = import.meta.env.VITE_API_BASE ?? "";

/**
 * Send a message to the AI assistant backend.
 * @param {string} patientId - The patient identifier.
 * @param {string} message - User query.
 * @param {string} [token] - Optional JWT for authenticated endpoints.
 * @returns {Promise<{success: boolean, answer: string, sources: string[]}>}
 */
export const sendMessage = async (patientId, message, token) => {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const payload = { patientId, message };
  const { data } = await axios.post(`${API_BASE}/api/v1/assistant/chat`, payload, { headers });
  return data;
};
