import { HiOutlineDocumentText } from "react-icons/hi2";

const statusStyles = {
  Analyzed: "bg-teal-50 text-teal-700",
  Processing: "bg-amber-400/10 text-amber-500",
};

function ReportCard({ report }) {
  const { name, date, type, status, hospital } = report;

  return (
    <div className="card card-hover flex items-center gap-4 p-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-ink-50">
        <HiOutlineDocumentText className="h-5 w-5 text-ink-500" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-ink-800">{name}</p>
        <p className="mt-0.5 truncate text-xs text-ink-400">
          {hospital} &middot; {type}
        </p>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1.5">
        <span
          className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
            statusStyles[status] ?? "bg-mist-200 text-ink-500"
          }`}
        >
          {status}
        </span>
        <span className="font-mono text-[11px] text-ink-400">{date}</span>
      </div>
    </div>
  );
}

export default ReportCard;
