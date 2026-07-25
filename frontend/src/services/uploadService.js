// uploadService.js
// Handles medical report upload flow. Currently returns mock data.
// Backend contract: upload_medical_report(), extract_patient_information()

import { uploadedFilesSeed, supportedFormats } from "../data/reportsData.js";

const MOCK_DELAY = 600;

export async function getUploadedFiles() {
  await wait(MOCK_DELAY);
  return { files: uploadedFilesSeed, supportedFormats };
}

export async function uploadMedicalReport(file) {
  await wait(800);
  // TODO: replace with real call, e.g.
  // const formData = new FormData();
  // formData.append("file", file);
  // const res = await fetch(`${API_BASE_URL}/reports/upload`, { method: "POST", body: formData });
  // return res.json();
  return {
    success: true,
    file: {
      id: `file-${Date.now()}`,
      name: file?.name ?? "untitled_report.pdf",
      size: file ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : "0 MB",
      progress: 100,
      status: "complete",
    },
  };
}

export async function extractPatientInformation(fileId) {
  await wait(1000);
  // TODO: call extract_patient_information() on the backend
  return { success: true, fileId, extracted: true };
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
