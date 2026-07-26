import { useState } from "react";
import { HiOutlinePhone, HiOutlinePencilSquare, HiOutlineCheck } from "react-icons/hi2";

function ProfileCard({ profile, onUpdate }) {
  const { name, age, gender, bloodGroup, avatarInitials, emergencyContact } = profile;
  const [isEditing, setIsEditing] = useState(false);
  const [editedAge, setEditedAge] = useState(age === "—" ? "" : age);
  const [editedBloodGroup, setEditedBloodGroup] = useState(bloodGroup === "—" ? "" : bloodGroup);

  function handleSave() {
    localStorage.setItem("userAge", editedAge || "—");
    localStorage.setItem("userBloodGroup", editedBloodGroup || "—");
    setIsEditing(false);
    if (onUpdate) {
      onUpdate();
    }
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-teal-500 font-mono text-xl font-semibold text-white">
            {avatarInitials}
          </div>
          <div>
            <h2 className="font-display text-xl font-semibold text-ink-800">{name}</h2>
            <div className="mt-0.5 text-sm text-ink-500">
              {isEditing ? (
                <div className="flex items-center gap-1.5 mt-1">
                  <input
                    type="text"
                    value={editedAge}
                    onChange={(e) => setEditedAge(e.target.value)}
                    placeholder="Age"
                    className="w-14 rounded border border-mist-300 px-1 py-0.5 text-xs text-ink-800 outline-none bg-white focus:border-teal-400"
                  />
                  <span>yrs</span>
                </div>
              ) : (
                `${age} yrs`
              )}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-mist-100 text-ink-600 transition-colors hover:bg-mist-200 hover:text-ink-800"
          aria-label={isEditing ? "Save Changes" : "Edit Profile"}
        >
          {isEditing ? <HiOutlineCheck className="h-4.5 w-4.5 text-teal-600" /> : <HiOutlinePencilSquare className="h-4.5 w-4.5" />}
        </button>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="rounded-xl bg-mist-50 p-3.5">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">
            Blood Group
          </p>
          {isEditing ? (
            <input
              type="text"
              value={editedBloodGroup}
              onChange={(e) => setEditedBloodGroup(e.target.value)}
              placeholder="e.g. O+"
              className="mt-1 w-full rounded border border-mist-300 px-2 py-1 text-sm font-semibold text-ink-800 outline-none focus:border-teal-400 bg-white"
            />
          ) : (
            <p className="mt-1 font-mono text-lg font-semibold text-ink-800">{bloodGroup}</p>
          )}
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
