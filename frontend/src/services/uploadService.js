// uploadService.js
// Handles medical report upload and extraction flows. Connects to backend API Gateway.

import { supportedFormats } from "../data/reportsData.js";

const API_BASE_URL = "http://127.0.0.1:8000";

export async function getUploadedFiles() {
  // Files are tracked in-session only — MongoDB via MCP is the source of truth.
  // We do NOT persist across sessions since clearing MongoDB would cause a stale UI.
  return { files: [], supportedFormats };
}

export async function uploadMedicalReport(file) {
  try {
    const patientId = localStorage.getItem("patientId") || "PAT001";
    const formData = new FormData();
    formData.append("file", file);
    formData.append("patientId", patientId);

    const res = await fetch(`${API_BASE_URL}/patient/upload`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.detail || errData.error || "Upload failed");
    }

    const data = await res.json();

    // Store references
    localStorage.setItem("lastFileId", data.reportId || data.fileId);
    if (data.patientId) {
      localStorage.setItem("patientId", data.patientId);
    }

    const newFile = {
      id: data.reportId || data.fileId || `file-${Date.now()}`,
      name: file?.name ?? "untitled_report.pdf",
      size: file ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : "0 MB",
      progress: 100,
      status: "complete",
    };

    // NOTE: We intentionally do NOT persist uploadedFilesList to localStorage
    // because MongoDB (via MCP) is the source of truth. LocalStorage would cause
    // stale file lists to reappear after DB clears or across sessions.

    return {
      success: true,
      file: newFile,
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      error: err.message,
    };
  }
}

export async function extractPatientInformation(fileId) {
  try {
    const patientId = localStorage.getItem("patientId") || "PAT001";
    const res = await fetch(`${API_BASE_URL}/extraction`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ patientId, reportId: fileId, fileId: fileId }),
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.detail || errData.error || "Extraction failed");
    }

    const data = await res.json();

    // Save extracted status in localStorage
    localStorage.setItem("extractionStatus", JSON.stringify(data));

    return { success: true, fileId, extracted: true, status: data };
  } catch (err) {
    console.error(err);
    throw err;
  }
}
