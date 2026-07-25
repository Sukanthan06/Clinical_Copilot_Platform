import { Link } from "react-router-dom";
import ReportCard from "./ReportCard.jsx";

function RecentReports({ reports = [] }) {
  return (
    <div className="card p-6">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="font-display text-base font-semibold text-ink-800">Recent Medical Reports</h3>
        <Link to="/upload" className="text-xs font-semibold text-teal-600 hover:text-teal-700">
          View all
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {reports.map((report) => (
          <ReportCard key={report.id} report={report} />
        ))}
      </div>
    </div>
  );
}

export default RecentReports;
