const severityDot = {
  mild: "bg-teal-400",
  moderate: "bg-amber-400",
  severe: "bg-critical-400",
};

function MedicalConditionCard({ condition }) {
  const { name, diagnosedYear, status, severity } = condition;

  return (
    <div className="card card-hover flex items-center justify-between p-4">
      <div className="flex items-center gap-3">
        <span className={`h-2.5 w-2.5 rounded-full ${severityDot[severity] ?? "bg-ink-300"}`} />
        <div>
          <p className="text-sm font-semibold text-ink-800">{name}</p>
          <p className="text-xs text-ink-400">Diagnosed {diagnosedYear}</p>
        </div>
      </div>
      <span className="rounded-full bg-mist-100 px-2.5 py-1 text-xs font-medium text-ink-500">
        {status}
      </span>
    </div>
  );
}

export default MedicalConditionCard;
