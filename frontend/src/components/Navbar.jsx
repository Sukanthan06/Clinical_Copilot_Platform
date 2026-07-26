import { HiOutlineBell, HiOutlineCog6Tooth } from "react-icons/hi2";

function Navbar() {
  const userName = localStorage.getItem("userName") || "Patient";
  const initials = userName
    .split(" ")
    .map(n => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase() || "PT";

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-mist-300/70 bg-white/80 px-6 backdrop-blur-md md:px-8">
      <div>
        <h1 className="font-display text-lg font-semibold text-ink-800">Clinical Copilot</h1>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-full text-ink-500 transition-colors hover:bg-mist-200 hover:text-ink-700"
        >
          <HiOutlineBell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-critical-400" />
        </button>

        <button
          type="button"
          aria-label="Settings"
          className="flex h-9 w-9 items-center justify-center rounded-full text-ink-500 transition-colors hover:bg-mist-200 hover:text-ink-700"
        >
          <HiOutlineCog6Tooth className="h-5 w-5" />
        </button>

        <div className="hidden h-8 w-px bg-mist-300 sm:block" />

        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-500 text-sm font-semibold text-white font-mono">
            {initials}
          </div>
          <div className="hidden leading-tight sm:block">
            <p className="text-sm font-semibold text-ink-800">{userName}</p>
            <p className="text-xs text-ink-400">Patient Account</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
