// dashboardService.js
// Supplies data for the Dashboard page. Calculated dynamically based on user state.

const API_BASE_URL = "http://127.0.0.1:8000";

export async function getDashboardSummary() {
  const patientId = localStorage.getItem("patientId") || "";
  
  let timeline = [];
  let trialsCount = 0;
  let conditionsCount = 0;
  let reportsCount = 0;

  if (patientId && patientId !== "patient_mock_123" && patientId !== "undefined") {
    try {
      // Fetch actual data from backend which reads from MongoDB via MCP
      const [timelineRes, trialsRes, profileRes] = await Promise.all([
        fetch(`${API_BASE_URL}/patient/${patientId}/timeline`).catch(() => null),
        fetch(`${API_BASE_URL}/patient/${patientId}/clinical-trials`).catch(() => null),
        fetch(`${API_BASE_URL}/patient/${patientId}`).catch(() => null)
      ]);

      if (timelineRes && timelineRes.ok) {
        const tData = await timelineRes.json();
        timeline = tData.timeline || [];
      }
      if (trialsRes && trialsRes.ok) {
        const trData = await trialsRes.json();
        trialsCount = trData.trials?.length || 0;
      }
      if (profileRes && profileRes.ok) {
        const pData = await profileRes.json();
        conditionsCount = pData.diagnoses?.length || 0;
      }
      
      // Since there's no backend endpoint for fetching the reports list yet,
      // we infer report presence from timeline events.
      reportsCount = timeline.length > 0 ? 1 : 0;
    } catch (e) {
      console.error("Failed to fetch dashboard data from backend", e);
    }
  }
  
  const kpis = [
    {
      id: "kpi-reports",
      label: "Medical Reports",
      value: String(reportsCount),
      change: reportsCount > 0 ? "+100%" : "0%",
      changeType: "increase",
      trend: "up"
    },
    {
      id: "kpi-conditions",
      label: "Active Conditions",
      value: String(conditionsCount),
      change: "0 new",
      changeType: "neutral",
      trend: "flat"
    },
    {
      id: "kpi-trials",
      label: "Matched Trials",
      value: String(trialsCount),
      change: trialsCount > 0 ? `${trialsCount} matched` : "0",
      changeType: "increase",
      trend: "up"
    },
    {
      id: "kpi-care",
      label: "Timeline Status",
      value: timeline.length > 0 ? "Synchronized" : "Pending",
      change: timeline.length > 0 ? "Updated" : "No events",
      changeType: timeline.length > 0 ? "increase" : "neutral",
      trend: timeline.length > 0 ? "up" : "flat"
    }
  ];

  const activity = [];
  if (reportsCount > 0) {
    activity.push({
      id: "act-upload",
      type: "upload",
      title: "Uploaded Report",
      description: `Successfully uploaded medical report.`,
      time: "Recent"
    });
  }
  if (timeline.length > 0) {
    activity.push({
      id: "act-timeline",
      type: "timeline",
      title: "Timeline Updated",
      description: `Chronological events compiled from reports.`,
      time: "Recent"
    });
  }
  if (activity.length === 0) {
    activity.push({
      id: "act-welcome",
      type: "system",
      title: "Welcome to Clinical Copilot",
      description: "Get started by uploading your first medical report in the Upload section.",
      time: "Now"
    });
  }

  const insights = [];
  if (reportsCount === 0) {
    insights.push({
      id: "ins-getstarted",
      type: "info",
      title: "Upload Required",
      content: "Upload a PDF or image report to trigger OCR text extraction and clinical trial matching."
    });
  } else if (timeline.length === 0) {
    insights.push({
      id: "ins-process",
      type: "warning",
      title: "Processing Pending",
      content: "You have uploaded reports. Please navigate to the Upload section and click 'Process Files' to run extraction."
    });
  } else {
    insights.push({
      id: "ins-timeline",
      type: "success",
      title: "Clinical Extraction Complete",
      content: `Extracted condition data successfully from report. You match ${trialsCount} active clinical trial protocols.`
    });
  }

  const quickActions = [
    {
      id: "qa-upload",
      label: "Upload New Report",
      path: "/upload",
      icon: "upload"
    },
    {
      id: "qa-profile",
      label: "View Patient Profile",
      path: "/profile",
      icon: "profile"
    },
    {
      id: "qa-timeline",
      label: "Track Medical Timeline",
      path: "/timeline",
      icon: "timeline"
    }
  ];

  return { kpis, activity, insights, quickActions, recentReports: [] };
}
