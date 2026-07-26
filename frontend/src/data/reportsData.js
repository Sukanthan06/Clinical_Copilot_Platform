// Mock data representing recent medical reports and uploaded files.

export const recentReports = [
  {
    id: "rep-1",
    name: "Complete Blood Count (CBC)",
    date: "Jul 18, 2026",
    type: "Lab Report",
    status: "Analyzed",
    hospital: "St. Mary's Medical Center",
  },
  {
    id: "rep-2",
    name: "Chest X-Ray",
    date: "Jul 10, 2026",
    type: "Imaging",
    status: "Analyzed",
    hospital: "Boston Radiology Group",
  },
  {
    id: "rep-3",
    name: "Lipid Panel",
    date: "Jun 29, 2026",
    type: "Lab Report",
    status: "Analyzed",
    hospital: "St. Mary's Medical Center",
  },
  {
    id: "rep-4",
    name: "Cardiology Consult Notes",
    date: "Jun 14, 2026",
    type: "Clinical Notes",
    status: "Processing",
    hospital: "Mass General Brigham",
  },
];

export const uploadedFilesSeed = [
  {
    id: "file-1",
    name: "cbc_july2026.pdf",
    size: "1.2 MB",
    progress: 100,
    status: "complete",
  },
  {
    id: "file-2",
    name: "chest_xray_scan.png",
    size: "3.4 MB",
    progress: 100,
    status: "complete",
  },
];

export const supportedFormats = ["PDF", "JPG", "PNG", "DICOM", "TXT"];
