import { HiOutlineBell, HiOutlineCog6Tooth, HiOutlineMagnifyingGlass, HiSparkles } from "react-icons/hi2";

function Navbar() {
  const userName = localStorage.getItem("userName") || "Patient";
  const initials = userName
    .split(" ")
    .map(n => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase() || "PT";

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-mist-300/80 bg-white/80 px-4 sm:px-6 backdrop-blur-md transition-all duration-300 shadow-sm md:px-8">
      {/* Title & Live Status Indicator */}
      <div className="flex items-center gap-3">
        <h1 className="font-display text-lg font-bold text-ink-800 tracking-tight flex items-center gap-2">
          Clinical Copilot
          <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-semibold text-teal-700 border border-teal-200/60 shadow-sm">
            <HiSparkles className="h-3.5 w-3.5 text-teal-500 animate-spin" style={{ animationDuration: "6s" }} />
            Active Sync
          </span>
        </h1>
      </div>

      {/* Action Controls & Profile Avatar */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Search quick button */}
        <div className="relative hidden md:block">
          <HiOutlineMagnifyingGlass className="absolute left-3 top-2.5 h-4 w-4 text-ink-400" />
          <input
            type="text"
            placeholder="Search records, trials..."
            className="h-9 w-48 lg:w-64 rounded-full bg-mist-100/90 pl-9 pr-4 text-xs text-ink-800 placeholder-ink-400 border border-mist-300/80 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all duration-200"
          />
        </div>

        {/* Notifications Button */}
        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-full text-ink-500 hover:text-ink-800 hover:bg-mist-200/80 active:scale-95 transition-all duration-200"
        >
          <HiOutlineBell className="h-5 w-5" />
          <span className="absolute right-2 top-2 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-critical-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-critical-500" />
          </span>
        </button>

        {/* Settings Button */}
        <button
          type="button"
          aria-label="Settings"
          className="flex h-9 w-9 items-center justify-center rounded-full text-ink-500 hover:text-ink-800 hover:bg-mist-200/80 hover:rotate-45 active:scale-95 transition-all duration-300"
        >
          <HiOutlineCog6Tooth className="h-5 w-5" />
        </button>

        <div className="hidden h-6 w-px bg-mist-300 sm:block mx-1" />

        {/* Profile User Badge */}
        <div className="flex items-center gap-2.5 pl-1 cursor-pointer group">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-teal-700 text-sm font-bold text-white shadow-soft transition-transform duration-300 group-hover:scale-105 group-hover:shadow-glow">
            {initials}
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-400 border-2 border-white" />
          </div>
          <div className="hidden leading-tight sm:block">
            <p className="text-sm font-bold text-ink-800 group-hover:text-teal-700 transition-colors">
              {userName}
            </p>
            <p className="text-[11px] font-medium text-ink-400">Patient Account</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
