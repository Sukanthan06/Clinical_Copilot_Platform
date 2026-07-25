// patientService.js
// Supplies patient profile data. Currently returns mock data.
// Backend contract: extract_patient_information()

import {
  patientProfile,
  medicalConditions,
  allergies,
  medications,
  doctors,
} from "../data/profileData.js";
import { recentReports } from "../data/reportsData.js";

const MOCK_DELAY = 400;

export async function getPatientProfile() {
  await wait(MOCK_DELAY);
  // TODO: replace with real call, e.g.
  // const res = await fetch(`${API_BASE_URL}/patient/profile`);
  // return res.json();
  return {
    profile: patientProfile,
    conditions: medicalConditions,
    allergies,
    medications,
    doctors,
    recentReports,
  };
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
