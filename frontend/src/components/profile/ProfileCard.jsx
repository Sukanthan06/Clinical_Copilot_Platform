import { HiOutlinePhone } from "react-icons/hi2";

function ProfileCard({ profile }) {
  const { name, age, gender, bloodGroup, avatarInitials, emergencyContact } = profile;

  return (
    <div className="card p-6">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-teal-500 font-mono text-xl font-semibold text-white">
          {avatarInitials}
        </div>
        <div>
          <h2 className="font-display text-xl font-semibold text-ink-800">{name}</h2>
          <p className="mt-0.5 text-sm text-ink-500">
            {age} yrs &middot; {gender}
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="rounded-xl bg-mist-50 p-3.5">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">
            Blood Group
          </p>
          <p className="mt-1 font-mono text-lg font-semibold text-ink-800">{bloodGroup}</p>
        </div>
        <div className="rounded-xl bg-mist-50 p-3.5">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">Gender</p>
          <p className="mt-1 text-lg font-semibold text-ink-800">{gender}</p>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-mist-300/70 p-3.5">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">
          Emergency Contact
        </p>
        <div className="mt-2 flex items-center gap-2">
          <HiOutlinePhone className="h-4 w-4 text-teal-600" />
          <div>
            <p className="text-sm font-medium text-ink-800">
              {emergencyContact.name}{" "}
              <span className="font-normal text-ink-400">({emergencyContact.relation})</span>
            </p>
            <p className="font-mono text-xs text-ink-500">{emergencyContact.phone}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;
