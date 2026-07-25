// Mock data for the Dashboard page.
// Replace with responses from dashboardService.js once the backend is live.

export const kpiData = [
  {
    id: "kpi-reports",
    label: "Medical Reports",
    value: 24,
    delta: "+3 this month",
    trend: "up",
    icon: "reports",
  },
  {
    id: "kpi-conditions",
    label: "Active Conditions",
    value: 3,
    delta: "Stable",
    trend: "flat",
    icon: "conditions",
  },
  {
    id: "kpi-trials",
    label: "Clinical Trial Matches",
    value: 7,
    delta: "+2 new matches",
    trend: "up",
    icon: "trials",
  },
  {
    id: "kpi-referrals",
    label: "Generated Referrals",
    value: 5,
    delta: "1 pending review",
    trend: "flat",
    icon: "referrals",
  },
];

export const recentActivity = [
  {
    id: "act-1",
    title: "Lab report analyzed",
    description: "CBC panel processed and added to timeline",
    time: "2 hours ago",
    type: "upload",
  },
  {
    id: "act-2",
    title: "New trial match found",
    description: "Phase II diabetes trial at Mass General — 91% match",
    time: "5 hours ago",
    type: "trial",
  },
  {
    id: "act-3",
    title: "Referral generated",
    description: "Cardiology referral sent to Dr. Elena Ruiz",
    time: "Yesterday",
    type: "referral",
  },
  {
    id: "act-4",
    title: "Profile updated",
    description: "Medication list synced from pharmacy record",
    time: "2 days ago",
    type: "profile",
  },
];

export const aiInsights = [
  {
    id: "insight-1",
    title: "Blood pressure trending upward",
    description:
      "Last 3 readings show a gradual increase. Consider discussing with your cardiologist at the next visit.",
    severity: "warning",
  },
  {
    id: "insight-2",
    title: "A1C within target range",
    description: "Your most recent A1C of 6.2% is consistent with good glycemic control.",
    severity: "positive",
  },
  {
    id: "insight-3",
    title: "Missed medication refill",
    description: "Metformin refill appears overdue by 4 days based on prescription cadence.",
    severity: "critical",
  },
];

export const quickActions = [
  { id: "qa-1", label: "Upload Report", to: "/upload", icon: "upload" },
  { id: "qa-2", label: "View Timeline", to: "/timeline", icon: "timeline" },
  { id: "qa-3", label: "Ask AI Assistant", to: "/chat", icon: "chat" },
  { id: "qa-4", label: "Find Trials", to: "/trials", icon: "trials" },
];
