import { useState, useEffect } from "react";
import {
  HiOutlineArrowTopRightOnSquare,
  HiOutlineDocumentText,
  HiOutlineCheckCircle,
  HiOutlineSparkles,
} from "react-icons/hi2";
import { generateReferral } from "../services/referralService.js";
import { searchClinicalTrials } from "../services/trialService.js";

function Referral() {
  const [trials, setTrials] = useState([]);
  const [selectedTrialId, setSelectedTrialId] = useState(
    localStorage.getItem("lastTrialId") || ""
  );
  const [referral, setReferral] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const patientName = localStorage.getItem("userName") || "Patient";

  useEffect(() => {
    searchClinicalTrials().then((res) => {
      setTrials(res.trials || []);
      // Auto-select last used trial
      if (!selectedTrialId && res.trials?.length > 0) {
        setSelectedTrialId(res.trials[0].trialId || res.trials[0].id || "");
      }
    });
  }, []);

  async function handleGenerate(e) {
    e.preventDefault();
    if (!selectedTrialId) {
      setError("Please select a clinical trial to generate a referral.");
      return;
    }
    setError(null);
    setIsGenerating(true);
    try {
      const res = await generateReferral({ trialId: selectedTrialId });
      if (res.success) {
        setReferral(res.referral);
      } else {
        setError("Referral generation failed. Please try again.");
      }
    } catch (err) {
      setError("Failed to generate referral: " + err.message);
    } finally {
      setIsGenerating(false);
    }
  }

  const selectedTrial = trials.find(
    (t) => (t.trialId || t.id) === selectedTrialId
  );

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-7">
        <p className="label-eyebrow">Step 6 of 6</p>
        <h2 className="mt-1 font-display text-2xl font-semibold text-ink-800">
          Generate Referral
        </h2>
        <p className="mt-1.5 text-sm text-ink-500">
          Select a matched clinical trial and generate a PDF referral letter.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left: Trial selector + generate button */}
        <form onSubmit={handleGenerate} className="card space-y-5 p-6">
          <h3 className="font-display text-base font-semibold text-ink-800">
            Referral Details
          </h3>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-ink-500">
              Patient
            </label>
            <p className="mt-1.5 rounded-xl border border-mist-200 bg-mist-50 px-3.5 py-2.5 text-sm font-medium text-ink-700">
              {patientName}
            </p>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-ink-500">
              Select Clinical Trial
            </label>
            {trials.length === 0 ? (
              <p className="mt-2 text-sm text-ink-400 italic">
                No matched trials found. Please complete the Clinical Trials step first.
              </p>
            ) : (
              <select
                required
                value={selectedTrialId}
                onChange={(e) => {
                  setSelectedTrialId(e.target.value);
                  localStorage.setItem("lastTrialId", e.target.value);
                }}
                className="mt-2 w-full rounded-xl border border-mist-300 bg-mist-50 px-3.5 py-2.5 text-sm text-ink-800 outline-none transition-colors focus:border-teal-400 focus:bg-white"
              >
                <option value="">— Choose a trial —</option>
                {trials.map((t) => {
                  const tid = t.trialId || t.id;
                  return (
                    <option key={tid} value={tid}>
                      {tid} — {t.name || t.title || "Clinical Trial"}
                    </option>
                  );
                })}
              </select>
            )}
          </div>

          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-2.5 text-xs font-medium text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isGenerating || !selectedTrialId}
            className="btn-primary w-full disabled:opacity-50"
          >
            {isGenerating ? (
              <span className="flex items-center justify-center gap-2">
                <HiOutlineSparkles className="h-4 w-4 animate-pulse" />
                Generating Referral…
              </span>
            ) : (
              "Generate Referral Letter"
            )}
          </button>
        </form>

        {/* Right: Referral preview / result */}
        <div className="card p-6">
          <h3 className="mb-4 font-display text-base font-semibold text-ink-800">
            Referral Preview
          </h3>

          <div className="rounded-xl border border-mist-300/70 bg-mist-50 p-5">
            <div className="flex items-center gap-2 border-b border-mist-300 pb-3">
              <HiOutlineDocumentText className="h-5 w-5 text-teal-600" />
              <p className="font-display text-sm font-semibold text-ink-800">
                Patient Referral Summary
              </p>
            </div>

            <div className="mt-4 space-y-2.5 text-xs text-ink-600">
              <p>
                <span className="font-semibold text-ink-800">Patient:</span>{" "}
                {patientName}
              </p>
              <p>
                <span className="font-semibold text-ink-800">Trial ID:</span>{" "}
                {referral?.trialId || selectedTrialId || "—"}
              </p>
              {selectedTrial && (
                <p>
                  <span className="font-semibold text-ink-800">Trial:</span>{" "}
                  {selectedTrial.name || selectedTrial.title}
                </p>
              )}
              <p>
                <span className="font-semibold text-ink-800">Referral ID:</span>{" "}
                {referral?.referralId || "Pending generation"}
              </p>
              <p>
                <span className="font-semibold text-ink-800">LLM Used:</span>{" "}
                {referral?.llm || "—"}
              </p>
              <p>
                <span className="font-semibold text-ink-800">Date:</span>{" "}
                {referral?.dateGenerated || "Pending generation"}
              </p>
            </div>
          </div>

          {referral?.pdfUrl ? (
            <div className="mt-5 space-y-3">
              <div className="flex items-center gap-2 rounded-xl bg-teal-50 px-4 py-3">
                <HiOutlineCheckCircle className="h-5 w-5 shrink-0 text-teal-600" />
                <p className="text-xs font-medium text-teal-700">
                  Referral letter generated successfully!
                </p>
              </div>
              <a
                href={referral.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary flex w-full items-center justify-center gap-2"
              >
                <HiOutlineArrowTopRightOnSquare className="h-4 w-4" />
                Open PDF Referral Letter
              </a>
            </div>
          ) : (
            <button
              type="button"
              disabled
              className="btn-secondary mt-5 w-full opacity-40"
            >
              Download PDF
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Referral;
