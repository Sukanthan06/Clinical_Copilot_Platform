import { Link } from "react-router-dom";
import ReportCard from "./ReportCard.jsx";
import { HiOutlineDocumentText, HiArrowRight } from "react-icons/hi2";

function RecentReports({ reports = [] }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur-md p-6 shadow-soft border border-mist-300/80 transition-all duration-300 hover:shadow-card">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/10 text-teal-600 border border-teal-500/20 shadow-sm">
            <HiOutlineDocumentText className="h-4 w-4 text-teal-600 animate-pulse" />
          </div>
          <div>
            <h3 className="font-display text-base font-bold text-ink-900">Recent Medical Reports</h3>
            <p className="text-xs text-ink-400">Latest uploaded clinical documents</p>
          </div>
        </div>

        <Link
          to="/upload"
          className="group inline-flex items-center gap-1 text-xs font-bold text-teal-600 hover:text-teal-700 transition-colors"
        >
          View all
          <HiArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="grid gap-3.5 sm:grid-cols-2">
        {reports.map((report) => (
          <ReportCard key={report.id} report={report} />
        ))}
      </div>
    </div>
  );
}

export default RecentReports;
