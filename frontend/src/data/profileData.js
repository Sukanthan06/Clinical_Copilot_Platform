// Mock data for the Patient Profile page.

export const patientProfile = {
  name: localStorage.getItem("userName") || "Patient",
  age: 42,
  gender: "Female",
  bloodGroup: "O+",
  avatarInitials: "SW",
  emergencyContact: {
    name: "Daniel Whitfield",
    relation: "Spouse",
    phone: "+1 (617) 555-0138",
  },
};

export const medicalConditions = [
  {
    id: "cond-1",
    name: "Type 2 Diabetes",
    diagnosedYear: 2019,
    status: "Managed",
    severity: "moderate",
  },
  {
    id: "cond-2",
    name: "Hypertension",
    diagnosedYear: 2021,
    status: "Monitored",
    severity: "moderate",
  },
  {
    id: "cond-3",
    name: "Seasonal Asthma",
    diagnosedYear: 2015,
    status: "Managed",
    severity: "mild",
  },
];

export const allergies = ["Penicillin", "Shellfish", "Latex"];

export const medications = [
  { id: "med-1", name: "Metformin", dosage: "500mg", frequency: "Twice daily" },
  { id: "med-2", name: "Lisinopril", dosage: "10mg", frequency: "Once daily" },
  { id: "med-3", name: "Albuterol Inhaler", dosage: "90mcg", frequency: "As needed" },
];

export const doctors = [
  { id: "doc-1", name: "Dr. Elena Ruiz", specialty: "Endocrinology" },
  { id: "doc-2", name: "Dr. Michael Chen", specialty: "Cardiology" },
  { id: "doc-3", name: "Dr. Priya Nair", specialty: "Primary Care" },
];
