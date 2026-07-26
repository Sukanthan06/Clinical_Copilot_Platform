// authService.js
// Wraps authentication calls. Connects to backend API Gateway.

const API_BASE_URL = "http://127.0.0.1:8000";

export async function authenticateUser({ email, password }) {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, password: password })
    });
    
    if (!res.ok) {
      const errData = await res.json();
      return { success: false, error: errData.detail || errData.error || "Authentication failed." };
    }
    
    const data = await res.json();
    
    // Extract returned payload fields
    const patientId = data.patientId || data.data?.patientId || "patient_mock_123";
    const name = data.name || data.data?.name || "Patient";
    const token = data.token || data.data?.token || "mock-jwt-token";

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
      const errData = await res.json();
      return { success: false, error: errData.detail || errData.error || "Registration failed." };
    }
    
    const data = await res.json();
    
    // Extract returned payload fields
    const patientId = data.patientId || data.data?.patientId || "patient_mock_123";
    const displayName = data.name || data.data?.name || name || "Patient";
    const token = data.token || data.data?.token || "mock-jwt-token";

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
  localStorage.removeItem("patientId");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("userName");
  localStorage.removeItem("authToken");
  // Clear session-cached data so next login starts clean
  localStorage.removeItem("extractedProfile");
  localStorage.removeItem("uploadedFilesList");
  localStorage.removeItem("lastTimelineData");
  localStorage.removeItem("lastFileId");
  localStorage.removeItem("lastTrialId");
  localStorage.removeItem("lastReferralPdfUrl");
  localStorage.removeItem("lastReferralId");
  localStorage.removeItem("extractionStatus");
  localStorage.removeItem("userAge");
  localStorage.removeItem("userBloodGroup");
  return { success: true };
}
