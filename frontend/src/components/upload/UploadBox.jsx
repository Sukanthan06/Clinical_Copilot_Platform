import { useRef, useState } from "react";
import { HiOutlineCloudArrowUp } from "react-icons/hi2";

function UploadBox({ onFilesSelected, supportedFormats = [], reportType, onReportTypeChange }) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  function handleDrop(e) {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files ?? []);
    if (files.length) onFilesSelected(files);
  }

  function handleBrowse(e) {
    const files = Array.from(e.target.files ?? []);
    if (files.length) onFilesSelected(files);
    e.target.value = "";
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-16 text-center transition-colors duration-200 ${
        isDragging ? "border-teal-400 bg-teal-50" : "border-mist-300 bg-mist-50"
      }`}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-500/10">
        <HiOutlineCloudArrowUp className="h-7 w-7 text-teal-600" />
      </div>

      <p className="mt-5 font-display text-lg font-semibold text-ink-800">
        Drag & drop medical reports
      </p>
      <p className="mt-1.5 max-w-sm text-sm text-ink-500">
        Upload lab results, imaging, or clinical notes. Our AI will extract and organize the
        details automatically.
      </p>

      <label className="mt-5 w-full max-w-sm text-left text-sm font-medium text-ink-700">
        Report type
        <select required value={reportType} onChange={(event) => onReportTypeChange(event.target.value)} className="mt-1 block w-full rounded-lg border border-mist-300 bg-white px-3 py-2 text-sm">
          <option value="">Select a report type</option>
          <option value="Discharge Summary">Discharge Summary</option>
          <option value="Blood Report">Blood Report</option>
          <option value="Radiology">Radiology</option>
          <option value="Clinical Notes">Clinical Notes</option>
          <option value="Other">Other</option>
        </select>
      </label>

      <button type="button" disabled={!reportType} onClick={() => inputRef.current?.click()} className="btn-primary mt-6">
        Browse Files
      </button>
      <input
        ref={inputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleBrowse}
        accept={supportedFormats.map((f) => `.${f.toLowerCase()}`).join(",")}
      />

      <p className="mt-5 text-xs text-ink-400">
        Supported formats:{" "}
        <span className="font-mono font-medium text-ink-500">
          {supportedFormats.join(", ")}
        </span>
      </p>
    </div>
  );
}

export default UploadBox;
