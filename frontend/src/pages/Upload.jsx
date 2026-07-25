import { useEffect, useState } from "react";
import UploadBox from "../components/upload/UploadBox.jsx";
import UploadedFileCard from "../components/upload/UploadedFileCard.jsx";
import { getUploadedFiles, uploadMedicalReport } from "../services/uploadService.js";

function Upload() {
  const [files, setFiles] = useState([]);
  const [supportedFormats, setSupportedFormats] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    getUploadedFiles().then((res) => {
      setFiles(res.files);
      setSupportedFormats(res.supportedFormats);
    });
  }, []);

  async function handleFilesSelected(selected) {
    setIsUploading(true);
    const uploaded = await Promise.all(selected.map((file) => uploadMedicalReport(file)));
    setFiles((prev) => [...prev, ...uploaded.map((res) => res.file)]);
    setIsUploading(false);
  }

  function handleRemove(id) {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-7">
        <p className="label-eyebrow">Step 2 of 6</p>
        <h2 className="mt-1 font-display text-2xl font-semibold text-ink-800">
          Upload Medical Reports
        </h2>
        <p className="mt-1.5 text-sm text-ink-500">
          Add lab results, imaging, or clinical notes so the AI can extract and organize your
          health record.
        </p>
      </div>

      <UploadBox onFilesSelected={handleFilesSelected} supportedFormats={supportedFormats} />

      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-base font-semibold text-ink-800">
            Uploaded Files {files.length > 0 && `(${files.length})`}
          </h3>
          {isUploading && <span className="text-xs font-medium text-teal-600">Uploading...</span>}
        </div>

        {files.length === 0 ? (
          <div className="card p-8 text-center text-sm text-ink-400">
            No files uploaded yet. Drag a report above to get started.
          </div>
        ) : (
          <div className="space-y-3">
            {files.map((file) => (
              <UploadedFileCard key={file.id} file={file} onRemove={handleRemove} />
            ))}
          </div>
        )}

        <button type="button" disabled={files.length === 0} className="btn-primary mt-6">
          Process {files.length > 0 ? `${files.length} File${files.length > 1 ? "s" : ""}` : "Files"}
        </button>
      </div>
    </div>
  );
}

export default Upload;
