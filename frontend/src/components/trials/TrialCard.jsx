import { HiOutlineBuildingOffice2, HiOutlineMapPin } from "react-icons/hi2";

const statusStyles = {
  RECRUITING: "bg-teal-50 text-teal-700",
  Recruiting: "bg-teal-50 text-teal-700",
  NOT_YET_RECRUITING: "bg-amber-400/10 text-amber-500",
  "Not Yet Recruiting": "bg-amber-400/10 text-amber-500",
  COMPLETED: "bg-blue-50 text-blue-600",
  Completed: "bg-blue-50 text-blue-600",
  TERMINATED: "bg-red-50 text-red-500",
  Terminated: "bg-red-50 text-red-500",
};

function ConfidenceRing({ value }) {
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative flex h-14 w-14 shrink-0 items-center justify-center">
      <svg width="56" height="56" viewBox="0 0 56 56" className="-rotate-90">
        <circle cx="28" cy="28" r={radius} fill="none" stroke="#E9EEEC" strokeWidth="5" />
        <circle
          cx="28"
          cy="28"
          r={radius}
          fill="none"
          stroke="#0E9384"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="absolute font-mono text-xs font-semibold text-ink-800">{value}%</span>
    </div>
  );
}

function TrialCard({ trial, onApply }) {
  const { name, hospital, status, phase, eligibility, distance, confidence } = trial;

  return (
    <div className="card card-hover p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <span
            className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
              statusStyles[status] ?? "bg-mist-200 text-ink-500"
            }`}
          >
            {status}
          </span>
          <h3 className="mt-2 font-display text-base font-semibold text-ink-800 line-clamp-2">{name}</h3>
          {hospital && hospital !== "—" && (
            <p className="mt-1 flex items-center gap-1.5 text-xs text-ink-500">
              <HiOutlineBuildingOffice2 className="h-3.5 w-3.5 shrink-0 text-ink-400" />
              <span className="truncate">{hospital}</span>
            </p>
          )}
        </div>
        <ConfidenceRing value={confidence ?? 0} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-mist-200 pt-4 text-xs">
        <div>
          <p className="font-semibold uppercase tracking-wide text-ink-400">Phase</p>
          <p className="mt-1 font-medium text-ink-700">{phase}</p>
        </div>
        <div>
          <p className="flex items-center gap-1 font-semibold uppercase tracking-wide text-ink-400">
            <HiOutlineMapPin className="h-3 w-3" /> Location
          </p>
          <p className="mt-1 font-medium text-ink-700 truncate" title={distance}>
            {distance && distance !== "—" ? distance : "Not specified"}
          </p>
        </div>
        {eligibility && (
          <div className="col-span-2">
            <p className="font-semibold uppercase tracking-wide text-ink-400">Eligibility Reasons</p>
            <p className="mt-1 text-ink-600 leading-relaxed">{eligibility}</p>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => onApply?.(trial.id)}
        className="btn-primary mt-5 w-full"
      >
        Apply to Trial
      </button>
    </div>
  );
}

export default TrialCard;
