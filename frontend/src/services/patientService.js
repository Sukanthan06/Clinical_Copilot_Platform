// patientService.js
// Supplies patient profile data. Fetches from backend API Gateway → MongoDB via MCP.

import { API_BASE_URL } from "./api.js";

export async function getPatientProfile() {
  const patientId = localStorage.getItem("patientId") || "";
  const nameVal = localStorage.getItem("userName") || "";
  const initials = nameVal
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase() || "PT";

  // Default empty profile — shown when DB is empty or no data yet
  const emptyProfile = {
    profile: {
      id: patientId,
      name: nameVal,
      age: localStorage.getItem("userAge") || "—",
      gender: "—",
      bloodGroup: localStorage.getItem("userBloodGroup") || "—",
      avatarInitials: initials,
      emergencyContact: { name: "—", relation: "—", phone: "—" },
    },
    conditions: [],
    allergies: [],
    medications: [],
    doctors: [],
    recentReports: [],
  };

  if (!patientId || patientId === "undefined") {
    return emptyProfile;
  }

  try {
    // Fetch profile from backend (which reads from MongoDB via MCP)
    const profileRes = await fetch(`${API_BASE_URL}/patient/${patientId}`);

    if (!profileRes.ok) {
      return emptyProfile;
    }

    const data = await profileRes.json();

    // Map diagnoses → conditions
    const conditions = (data.diagnoses || []).map((d, i) => ({
      id: `diag-${i}`,
      name: d,
      status: "Active",
      severity: "Moderate",
      dateDiagnosed: "—",
    }));

    // Map medications (can be strings or objects)
    const medications = (data.medications || []).map((m, i) => {
      if (typeof m === "string") {
        return { id: `med-${i}`, name: m, dosage: "As prescribed", frequency: "Daily" };
      }
      return { id: `med-${i}`, name: m.name || m, dosage: m.dosage || "As prescribed", frequency: m.frequency || "Daily" };
    });

    return {
      profile: {
        id: patientId,
        name: data.name || nameVal,
        age: localStorage.getItem("userAge") || "—",
        gender: data.gender || "—",
        bloodGroup: data.bloodGroup || localStorage.getItem("userBloodGroup") || "—",
        avatarInitials: initials,
        emergencyContact: { name: "—", relation: "—", phone: "—" },
      },
      conditions,
      allergies: data.allergies || [],
      medications,
      doctors: [],
      recentReports: [],
    };
  } catch (err) {
    console.error("Failed to fetch patient profile from backend:", err);
    return emptyProfile;
  }
}
