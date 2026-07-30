// uploadService.js
// Handles medical report upload and extraction flows. Connects to backend API Gateway.

import { API_BASE_URL, readError, requirePatientId } from "./api.js";

export const supportedFormats = ["PDF", "PNG", "JPG", "JPEG", "TIFF", "BMP", "DOCX", "TXT", "CSV", "XLSX"];

export async function getUploadedFiles() {
  try {
    const patientId = requirePatientId();
    const response = await fetch(`${API_BASE_URL}/patient/${patientId}/reports`);
    if (!response.ok) throw new Error(await readError(response, "Unable to load reports"));
    const data = await response.json();
    return {
      files: (data.reports || []).map((report) => ({
        id: report.reportId || report.fileId,
        name: report.fileName || "Unnamed report",
        size: report.size || "—",
        progress: 100,
        status: report.status || "complete",
      })),
      supportedFormats,
    };
  } catch (error) {
    console.error("Unable to load uploaded reports:", error);
    return { files: [], supportedFormats };
  }
}

export async function uploadMedicalReport(file, reportType) {
  try {
    const patientId = requirePatientId();
    if (!reportType) throw new Error("Choose a report type before uploading.");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("patientId", patientId);
    formData.append("reportType", reportType);

    const res = await fetch(`${API_BASE_URL}/patient/upload`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      throw new Error(await readError(res, "Upload failed"));
    }

    const data = await res.json();

    // Store references scoped to current patientId
    localStorage.setItem(`lastFileId_${patientId}`, data.reportId || data.fileId);
    localStorage.setItem("lastFileId", data.reportId || data.fileId);

    const newFile = {
      id: data.reportId || data.fileId,
      name: file?.name ?? "untitled_report.pdf",
      size: file ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : "0 MB",
      progress: 100,
      status: "complete",
    };

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
    const patientId = requirePatientId();
    const res = await fetch(`${API_BASE_URL}/extraction`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ patientId, reportId: fileId, fileId: fileId }),
    });

    if (!res.ok) {
      throw new Error(await readError(res, "Extraction failed"));
    }

    const data = await res.json();
    // Ensure patientId is attached to extraction result data
    data.patientId = data.patientId || patientId;

    // Save extracted status in patient-scoped localStorage
    localStorage.setItem(`extractionStatus_${patientId}`, JSON.stringify(data));
    localStorage.setItem("extractionStatus", JSON.stringify(data));
    
    // Save into aggregated extractedReportsMap dictionary scoped to patientId
    let reportsMap = {};
    try {
      const existing = localStorage.getItem(`extractedReportsMap_${patientId}`);
      if (existing) reportsMap = JSON.parse(existing);
    } catch (e) {
      console.error("Failed to parse extractedReportsMap", e);
    }
    reportsMap[fileId] = data;
    localStorage.setItem(`extractedReportsMap_${patientId}`, JSON.stringify(reportsMap));

    return { success: true, fileId, extracted: true, status: data };
  } catch (err) {
    console.error(err);
    throw err;
  }
}
