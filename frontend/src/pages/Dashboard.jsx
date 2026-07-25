import { useEffect, useState } from "react";
import StatCard from "../components/StatCard.jsx";
import RecentActivity from "../components/RecentActivity.jsx";
import AIInsights from "../components/AIInsights.jsx";
import QuickActions from "../components/QuickActions.jsx";
import RecentReports from "../components/RecentReports.jsx";
import { getDashboardSummary } from "../services/dashboardService.js";
import { recentReports } from "../data/reportsData.js";

function Dashboard() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    getDashboardSummary().then(setSummary);
  }, []);

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-7">
        <p className="label-eyebrow">Welcome back</p>
        <h2 className="mt-1 font-display text-2xl font-semibold text-ink-800">
          Sarah, here's your health snapshot
        </h2>
        <p className="mt-1.5 text-sm text-ink-500">
          Here's what's new across your reports, trials, and care plan.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {(summary?.kpis ?? []).map((kpi) => (
          <StatCard key={kpi.id} {...kpi} />
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <RecentActivity items={summary?.activity ?? []} />
        </div>
        <div className="lg:col-span-1">
          <AIInsights items={summary?.insights ?? []} />
        </div>
        <div className="lg:col-span-1">
          <QuickActions actions={summary?.quickActions ?? []} />
        </div>
      </div>

      <div className="mt-6">
        <RecentReports reports={recentReports} />
      </div>
    </div>
  );
}

export default Dashboard;
