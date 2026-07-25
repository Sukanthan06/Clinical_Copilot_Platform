import { useState } from "react";
import { HiOutlineArrowDownTray, HiOutlineDocumentText } from "react-icons/hi2";
import { patientProfile, medicalConditions } from "../data/profileData.js";
import { generateReferral } from "../services/referralService.js";

function Referral() {
  const [form, setForm] = useState({ hospital: "", doctor: "", reason: "" });
  const [referral, setReferral] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  async function handleGenerate(e) {
    e.preventDefault();
    setIsGenerating(true);
    const res = await generateReferral(form);
    setIsGenerating(false);
    if (res.success) setReferral(res.referral);
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-7">
        <p className="label-eyebrow">Step 6 of 6</p>
        <h2 className="mt-1 font-display text-2xl font-semibold text-ink-800">Generate Referral</h2>
        <p className="mt-1.5 text-sm text-ink-500">
          Create a referral packet to share with a specialist or partner hospital.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <form onSubmit={handleGenerate} className="card space-y-4 p-6">
          <h3 className="font-display text-base font-semibold text-ink-800">Referral Details</h3>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-ink-500">
              Hospital
            </label>
            <input
              required
              value={form.hospital}
              onChange={(e) => setForm((f) => ({ ...f, hospital: e.target.value }))}
              placeholder="e.g. Mass General Brigham"
              className="mt-2 w-full rounded-xl border border-mist-300 bg-mist-50 px-3.5 py-2.5 text-sm text-ink-800 outline-none transition-colors focus:border-teal-400 focus:bg-white"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-ink-500">
              Doctor
            </label>
            <input
              required
              value={form.doctor}
              onChange={(e) => setForm((f) => ({ ...f, doctor: e.target.value }))}
              placeholder="e.g. Dr. Elena Ruiz"
              className="mt-2 w-full rounded-xl border border-mist-300 bg-mist-50 px-3.5 py-2.5 text-sm text-ink-800 outline-none transition-colors focus:border-teal-400 focus:bg-white"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-ink-500">
              Reason for Referral
            </label>
            <textarea
              required
              rows={4}
              value={form.reason}
              onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))}
              placeholder="Briefly describe the reason for this referral..."
              className="mt-2 w-full resize-none rounded-xl border border-mist-300 bg-mist-50 px-3.5 py-2.5 text-sm text-ink-800 outline-none transition-colors focus:border-teal-400 focus:bg-white"
            />
          </div>

          <button type="submit" disabled={isGenerating} className="btn-primary w-full">
            {isGenerating ? "Generating..." : "Generate Referral"}
          </button>
        </form>

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
                <span className="font-semibold text-ink-800">Patient:</span> {patientProfile.name}{" "}
                &middot; {patientProfile.age} yrs &middot; {patientProfile.gender}
              </p>
              <p>
                <span className="font-semibold text-ink-800">Conditions:</span>{" "}
                {medicalConditions.map((c) => c.name).join(", ")}
              </p>
              <p>
                <span className="font-semibold text-ink-800">Referred To:</span>{" "}
                {referral?.hospital || form.hospital || "—"}
                {(referral?.doctor || form.doctor) && ` (${referral?.doctor || form.doctor})`}
              </p>
              <p>
                <span className="font-semibold text-ink-800">Reason:</span>{" "}
                {referral?.reason || form.reason || "—"}
              </p>
              <p>
                <span className="font-semibold text-ink-800">Date:</span>{" "}
                {referral?.dateGenerated || "Pending generation"}
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={!referral}
            className="btn-secondary mt-5 w-full disabled:opacity-40"
          >
            <HiOutlineArrowDownTray className="h-4 w-4" />
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}

export default Referral;
