import { useEffect, useState } from "react";
import { HiOutlineDocumentText, HiOutlineSparkles, HiOutlineCheckCircle, HiOutlineChevronDown, HiOutlineChevronUp, HiOutlineBeaker, HiOutlineTag, HiOutlineClipboardDocumentCheck } from "react-icons/hi2";
import { API_BASE_URL } from "../services/api.js";

function ExtractedContent() {
  const [extractedReports, setExtractedReports] = useState([]);
  const [expandedText, setExpandedText] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    const currentPatientId = localStorage.getItem("patientId") || "";

    // Load extraction results scoped for current patientId
    const storedStatus = currentPatientId 
      ? localStorage.getItem(`extractionStatus_${currentPatientId}`) 
      : localStorage.getItem("extractionStatus");
    const storedMap = currentPatientId 
      ? localStorage.getItem(`extractedReportsMap_${currentPatientId}`) 
      : localStorage.getItem("extractedReportsMap");
    
    let reportsList = [];
    if (storedMap) {
      try {
        reportsList = Object.values(JSON.parse(storedMap));
      } catch (e) {
        console.error("Failed to parse extractedReportsMap", e);
      }
    }
    
    if (reportsList.length === 0 && storedStatus) {
      try {
        const single = JSON.parse(storedStatus);
        if (single && single.reportId) {
          reportsList = [single];
        }
      } catch (e) {
        console.error("Failed to parse extractionStatus", e);
      }
    }

    // Enforce strict patient ID isolation
    const filteredForPatient = reportsList.filter((rep) => {
      if (!currentPatientId) return false;
      const repPatientId = rep.patientId || rep.patient_id;
      if (repPatientId && repPatientId !== currentPatientId) {
        return false;
      }
      return true;
    });

    setExtractedReports(filteredForPatient);
  }, []);

  function toggleTextExpand(reportId) {
    setExpandedText((prev) => ({ ...prev, [reportId]: !prev[reportId] }));
  }

  function handleCopy(text, id) {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  const filteredReports = extractedReports.filter((rep) => {
    const q = searchQuery.toLowerCase();
    const repId = (rep.reportId || rep.fileId || "").toLowerCase();
    const llm = (rep.llm || "").toLowerCase();
    const info = JSON.stringify(rep.extractedMedicalInfo || rep.extracted_medical_info || {}).toLowerCase();
    return repId.includes(q) || llm.includes(q) || info.includes(q);
  });

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="label-eyebrow">LLM Extracted Insights</p>
          <h2 className="mt-1 font-display text-2xl font-semibold text-ink-800">
            Document Extracted Content
          </h2>
          <p className="mt-1.5 text-sm text-ink-500">
            Detailed clinical fields extracted directly from your medical reports via Gemini & Grok LLM reasoning.
          </p>
        </div>

        {extractedReports.length > 0 && (
          <input
            type="text"
            placeholder="Search extracted fields..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-mist-300 bg-white px-4 py-2 text-sm text-ink-800 shadow-sm outline-none focus:border-teal-400 sm:w-64"
          />
        )}
      </div>

      {extractedReports.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
            <HiOutlineDocumentText className="h-7 w-7" />
          </div>
          <h3 className="mt-4 font-display text-lg font-semibold text-ink-800">
            No Extracted Content Yet
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-ink-500">
            Upload medical reports in the <strong>Upload Reports</strong> tab and click <strong>Process Files</strong> to run LLM extraction and view structured clinical data here.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredReports.map((report, idx) => {
            const reportId = report.reportId || report.fileId || `REP_${idx + 1}`;
            const medicalInfo = report.extractedMedicalInfo || report.extracted_medical_info || {};
            const rawText = report.extractedText || report.extracted_text || "";

            const diagnoses = Array.isArray(medicalInfo.diagnosis) 
              ? medicalInfo.diagnosis 
              : medicalInfo.diagnosis ? [medicalInfo.diagnosis] : (medicalInfo.disease ? [medicalInfo.disease] : []);
            
            const medications = Array.isArray(medicalInfo.medications) 
              ? medicalInfo.medications 
              : medicalInfo.medications ? [medicalInfo.medications] : [];
            
            const labValues = typeof medicalInfo.labValues === "object" && medicalInfo.labValues !== null
              ? Object.entries(medicalInfo.labValues)
              : [];

            return (
              <div key={reportId} className="card overflow-hidden p-6 transition-all border border-mist-200 shadow-sm">
                {/* Header */}
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-mist-200 pb-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600">
                      <HiOutlineSparkles className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-display text-base font-semibold text-ink-800">
                          Extracted Report ({reportId})
                        </h3>
                        <span className="inline-flex items-center rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-semibold text-teal-700">
                          {report.extractionQuality || "High"} Quality
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-ink-400">
                        Processed via {report.llm || "Gemini"} Engine • LLM Extraction Complete
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 font-medium text-emerald-700">
                      <HiOutlineCheckCircle className="h-4 w-4" /> Profile Updated
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 px-2.5 py-1 font-medium text-indigo-700">
                      <HiOutlineCheckCircle className="h-4 w-4" /> Vector Indexed (Pinecone)
                    </span>
                  </div>
                </div>

                {/* Main Content Grid */}
                <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
                  {/* Diagnoses & Conditions */}
                  <div className="rounded-xl bg-mist-50 p-4">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink-500">
                      <HiOutlineTag className="h-4 w-4 text-teal-600" />
                      <span>Diagnoses & Condition</span>
                    </div>
                    <div className="mt-3 space-y-2">
                      {medicalInfo.disease && (
                        <p className="text-sm font-semibold text-ink-800">
                          Primary: <span className="text-teal-700">{medicalInfo.disease}</span>
                        </p>
                      )}
                      {diagnoses.length > 0 ? (
                        diagnoses.map((diag, dIdx) => (
                          <div key={dIdx} className="rounded-lg bg-white p-2.5 text-xs font-medium text-ink-700 shadow-2xs border border-mist-200">
                            {diag}
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-ink-400">No explicit diagnosis listed.</p>
                      )}
                    </div>
                  </div>

                  {/* Prescribed Medications */}
                  <div className="rounded-xl bg-mist-50 p-4">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink-500">
                      <HiOutlineBeaker className="h-4 w-4 text-teal-600" />
                      <span>Extracted Medications</span>
                    </div>
                    <div className="mt-3 space-y-2">
                      {medications.length > 0 ? (
                        medications.map((med, mIdx) => (
                          <div key={mIdx} className="rounded-lg bg-white p-2.5 text-xs font-medium text-ink-700 shadow-2xs border border-mist-200">
                            💊 {med}
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-ink-400">No medications identified in document.</p>
                      )}
                    </div>
                  </div>

                  {/* Demographics & Lab Values */}
                  <div className="rounded-xl bg-mist-50 p-4">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink-500">
                      <HiOutlineClipboardDocumentCheck className="h-4 w-4 text-teal-600" />
                      <span>Extracted Labs & Metadata</span>
                    </div>
                    <div className="mt-3 space-y-2 text-xs text-ink-700">
                      {(medicalInfo.name || medicalInfo.age || medicalInfo.gender) && (
                        <div className="rounded-lg bg-white p-2.5 shadow-2xs border border-mist-200">
                          {medicalInfo.name && <p><span className="font-semibold">Patient:</span> {medicalInfo.name}</p>}
                          {medicalInfo.age && <p><span className="font-semibold">Age:</span> {medicalInfo.age} yrs</p>}
                          {medicalInfo.gender && <p><span className="font-semibold">Gender:</span> {medicalInfo.gender}</p>}
                        </div>
                      )}

                      {labValues.length > 0 ? (
                        labValues.map(([k, v], lIdx) => (
                          <div key={lIdx} className="flex justify-between rounded-lg bg-white p-2.5 font-medium shadow-2xs border border-mist-200">
                            <span>{k}</span>
                            <span className="font-semibold text-teal-700">{String(v)}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-ink-400">No structured lab parameters found.</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Raw Extracted OCR Document Viewer */}
                {rawText && (
                  <div className="mt-6 border-t border-mist-200 pt-4">
                    <button
                      onClick={() => toggleTextExpand(reportId)}
                      className="flex w-full items-center justify-between text-xs font-semibold text-teal-600 hover:text-teal-700"
                    >
                      <span className="flex items-center gap-1.5">
                        <HiOutlineDocumentText className="h-4 w-4" />
                        {expandedText[reportId] ? "Hide Extracted Document Text" : "View Raw Extracted OCR / Document Text"}
                      </span>
                      {expandedText[reportId] ? <HiOutlineChevronUp className="h-4 w-4" /> : <HiOutlineChevronDown className="h-4 w-4" />}
                    </button>

                    {expandedText[reportId] && (
                      <div className="relative mt-3 rounded-xl bg-ink-800 p-4 font-mono text-xs text-mist-100">
                        <button
                          onClick={() => handleCopy(rawText, reportId)}
                          className="absolute right-3 top-3 rounded-lg bg-white/10 px-2.5 py-1 text-[11px] font-sans text-white hover:bg-white/20"
                        >
                          {copiedId === reportId ? "Copied!" : "Copy Text"}
                        </button>
                        <pre className="max-h-80 overflow-y-auto whitespace-pre-wrap leading-relaxed pr-16">
                          {rawText}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ExtractedContent;
