import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UploadBox from "../components/upload/UploadBox.jsx";
import UploadedFileCard from "../components/upload/UploadedFileCard.jsx";
import { getUploadedFiles, uploadMedicalReport, extractPatientInformation } from "../services/uploadService.js";

function Upload() {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [supportedFormats, setSupportedFormats] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [reportType, setReportType] = useState("");

  useEffect(() => {
    getUploadedFiles().then((res) => {
      setFiles(res.files);
      setSupportedFormats(res.supportedFormats);
    });
  }, []);

  async function handleFilesSelected(selected) {
    setIsUploading(true);
    const uploaded = await Promise.all(selected.map((file) => uploadMedicalReport(file, reportType)));
    const failed = uploaded.find((result) => !result.success);
    if (failed) alert(failed.error || "One or more uploads failed.");
    setFiles((prev) => [...prev, ...uploaded.filter((res) => res.success).map((res) => res.file)]);
    setIsUploading(false);
  }

  function handleRemove(id) {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }

  async function handleProcess() {
    if (files.length === 0) return;
    setIsProcessing(true);
    try {
      // Process files: send extraction requests to backend
      for (const file of files) {
        await extractPatientInformation(file.id);
      }
      // Navigate to Extracted Content page where the extracted LLM data will render
      navigate("/extracted-content");
    } catch (err) {
      console.error("Processing failed:", err);
      alert("Failed to process: " + (err.message || err));
    } finally {
      setIsProcessing(false);
    }
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

      <UploadBox onFilesSelected={handleFilesSelected} supportedFormats={supportedFormats} reportType={reportType} onReportTypeChange={setReportType} />

      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-base font-semibold text-ink-800">
            Uploaded Files {files.length > 0 && `(${files.length})`}
          </h3>
          {isUploading && <span className="text-xs font-medium text-teal-600">Uploading...</span>}
          {isProcessing && <span className="text-xs font-medium text-teal-600">Extracting details...</span>}
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

        <button 
          type="button" 
          disabled={files.length === 0 || isProcessing || isUploading} 
          onClick={handleProcess}
          className="btn-primary mt-6"
        >
          {isProcessing ? "Processing..." : `Process ${files.length > 0 ? `${files.length} File${files.length > 1 ? "s" : ""}` : "Files"}`}
        </button>
      </div>
    </div>
  );
}

export default Upload;
