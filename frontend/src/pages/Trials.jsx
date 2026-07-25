import { useEffect, useState } from "react";
import TrialCard from "../components/trials/TrialCard.jsx";
import { searchClinicalTrials, applyToTrial } from "../services/trialService.js";

function Trials() {
  const [trials, setTrials] = useState([]);
  const [appliedIds, setAppliedIds] = useState([]);

  useEffect(() => {
    searchClinicalTrials().then((res) => setTrials(res.trials));
  }, []);

  async function handleApply(trialId) {
    const res = await applyToTrial(trialId);
    if (res.success) setAppliedIds((prev) => [...prev, trialId]);
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-7">
        <p className="label-eyebrow">Step 5 of 6</p>
        <h2 className="mt-1 font-display text-2xl font-semibold text-ink-800">
          Clinical Trial Matches
        </h2>
        <p className="mt-1.5 text-sm text-ink-500">
          Trials ranked by AI confidence match based on your medical profile.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {trials.map((trial) => (
          <div key={trial.id} className="relative">
            <TrialCard trial={trial} onApply={handleApply} />
            {appliedIds.includes(trial.id) && (
              <div className="absolute right-4 top-4 rounded-full bg-teal-500 px-2.5 py-0.5 text-[11px] font-semibold text-white shadow-soft">
                Applied
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Trials;
