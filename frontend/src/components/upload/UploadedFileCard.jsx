import { HiOutlineDocument, HiOutlineCheckCircle, HiOutlineXMark } from "react-icons/hi2";

function UploadedFileCard({ file, onRemove }) {
  const { name, size, progress, status } = file;
  const isComplete = status === "complete";

  return (
    <div className="card flex items-center gap-4 p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-ink-50">
        <HiOutlineDocument className="h-5 w-5 text-ink-500" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-medium text-ink-800">{name}</p>
          <span className="shrink-0 font-mono text-xs text-ink-400">{size}</span>
        </div>

        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-mist-200">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isComplete ? "bg-teal-500" : "bg-amber-400"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {isComplete ? (
        <HiOutlineCheckCircle className="h-5 w-5 shrink-0 text-teal-500" />
      ) : (
        <span className="shrink-0 font-mono text-xs text-ink-400">{progress}%</span>
      )}

      {onRemove && (
        <button
          type="button"
          onClick={() => onRemove(file.id)}
          aria-label={`Remove ${name}`}
          className="shrink-0 text-ink-300 transition-colors hover:text-critical-400"
        >
          <HiOutlineXMark className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

export default UploadedFileCard;
