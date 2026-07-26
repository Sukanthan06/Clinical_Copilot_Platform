import { useEffect, useState } from "react";
import ProfileCard from "../components/profile/ProfileCard.jsx";
import MedicalConditionCard from "../components/profile/MedicalConditionCard.jsx";
import ReportCard from "../components/ReportCard.jsx";
import { getPatientProfile } from "../services/patientService.js";

function Profile() {
  const [data, setData] = useState(null);

  function loadProfile() {
    getPatientProfile().then(setData);
  }

  useEffect(() => {
    loadProfile();
  }, []);

  if (!data) return null;

  const { profile, conditions, allergies, medications, doctors, recentReports } = data;

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-7">
        <p className="label-eyebrow">Step 3 of 6</p>
        <h2 className="mt-1 font-display text-2xl font-semibold text-ink-800">Patient Profile</h2>
        <p className="mt-1.5 text-sm text-ink-500">
          A complete summary of your health record, kept in sync with your care team.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <ProfileCard profile={profile} onUpdate={loadProfile} />
        </div>

        <div className="space-y-6 lg:col-span-2">
          <div className="card p-6">
            <h3 className="mb-4 font-display text-base font-semibold text-ink-800">
              Medical Conditions
            </h3>
            <div className="space-y-3">
              {conditions.map((condition) => (
                <MedicalConditionCard key={condition.id} condition={condition} />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="card p-6">
              <h3 className="mb-4 font-display text-base font-semibold text-ink-800">Allergies</h3>
              <div className="flex flex-wrap gap-2">
                {allergies.map((a) => (
                  <span
                    key={a}
                    className="rounded-full bg-critical-400/10 px-3 py-1 text-xs font-medium text-critical-500"
                  >
                    {a}
                  </span>
                ))}
              </div>
            </div>

            <div className="card p-6">
              <h3 className="mb-4 font-display text-base font-semibold text-ink-800">
                Care Team
              </h3>
              <div className="space-y-3">
                {doctors.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between text-sm">
                    <span className="font-medium text-ink-700">{doc.name}</span>
                    <span className="text-xs text-ink-400">{doc.specialty}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="mb-4 font-display text-base font-semibold text-ink-800">Medications</h3>
            <div className="grid gap-3 sm:grid-cols-3">
              {medications.map((med) => (
                <div key={med.id} className="rounded-xl bg-mist-50 p-3.5">
                  <p className="text-sm font-semibold text-ink-800">{med.name}</p>
                  <p className="mt-1 font-mono text-xs text-ink-500">{med.dosage}</p>
                  <p className="mt-0.5 text-xs text-ink-400">{med.frequency}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <h3 className="mb-4 font-display text-base font-semibold text-ink-800">
              Recent Reports
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {recentReports.slice(0, 4).map((report) => (
                <ReportCard key={report.id} report={report} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
