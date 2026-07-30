// authService.js
// Wraps authentication calls. Connects to backend API Gateway.

import { API_BASE_URL, readError } from "./api.js";

export async function authenticateUser({ email, password }) {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, password: password })
    });
    
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      const errMsg = await readError(errData, "Authentication failed.");
      return { success: false, error: errMsg };
    }
    
    const data = await res.json();
    
    // Extract returned payload fields with fallbacks
    const patientId = data.patientId || data.data?.patientId || `P-${Math.floor(Math.random() * 90000 + 10000)}`;
    const name = data.name || data.data?.name || email.split("@")[0];
    const token = data.token || data.data?.token || `session-token-${patientId}`;

    // Clear all previous patient data from localStorage to ensure complete account isolation
    localStorage.clear();

    // Store in localStorage for other services to access
    localStorage.setItem("patientId", patientId);
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userName", name);
    localStorage.setItem("authToken", token);

    return {
      success: true,
      user: {
        id: patientId,
        name: name,
        email: email,
        role: "patient",
      },
      token: token,
    };
  } catch (err) {
    return { success: false, error: err.message || "Failed to reach backend server." };
  }
}

export async function registerUser({ email, password, name }) {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, password: password, name: name })
    });
    
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      const errMsg = await readError(errData, "Registration failed.");
      return { success: false, error: errMsg };
    }
    
    const data = await res.json();
    
    // Extract returned payload fields with fallbacks
    const displayName = data.name || data.data?.name || name || email.split("@")[0];
    const patientId = data.patientId || data.data?.patientId || `P-${Math.floor(Math.random() * 90000 + 10000)}`;
    const token = data.token || data.data?.token || `session-token-${patientId}`;

    // Clear all previous patient data from localStorage to ensure complete account isolation
    localStorage.clear();

    // Store in localStorage for other services to access
    localStorage.setItem("patientId", patientId);
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userName", displayName);
    localStorage.setItem("authToken", token);

    return {
      success: true,
      user: {
        id: patientId,
        name: displayName,
        email: email,
        role: "patient",
      },
      token: token,
    };
  } catch (err) {
    return { success: false, error: err.message || "Failed to reach backend server." };
  }
}

export async function logoutUser() {
  localStorage.clear();
  return { success: true };
}
