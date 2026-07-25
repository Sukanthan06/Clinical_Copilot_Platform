// dashboardService.js
// Supplies data for the Dashboard page. Currently returns mock data.
// Backend contract: will aggregate reports, conditions, trial matches, referrals.

import { kpiData, recentActivity, aiInsights, quickActions } from "../data/dashboardData.js";

const MOCK_DELAY = 400;

export async function getDashboardSummary() {
  await wait(MOCK_DELAY);
  // TODO: replace with real call, e.g.
  // const res = await fetch(`${API_BASE_URL}/dashboard/summary`);
  // return res.json();
  return { kpis: kpiData, activity: recentActivity, insights: aiInsights, quickActions };
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
