import { NavLink } from "react-router-dom";
import {
  HiOutlineSquares2X2,
  HiOutlineCloudArrowUp,
  HiOutlineDocumentText,
  HiOutlineUserCircle,
  HiOutlineClock,
  HiOutlineSparkles,
  HiOutlineBeaker,
  HiOutlineDocumentArrowUp,
  HiQuestionMarkCircle,
} from "react-icons/hi2";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: HiOutlineSquares2X2 },
  { to: "/upload", label: "Upload Reports", icon: HiOutlineCloudArrowUp },
  { to: "/extracted-content", label: "Extracted Content", icon: HiOutlineDocumentText },
  { to: "/profile", label: "Patient Profile", icon: HiOutlineUserCircle },
  { to: "/timeline", label: "Timeline", icon: HiOutlineClock },
  { to: "/chat", label: "AI Assistant", icon: HiOutlineSparkles, badge: "AI" },
  { to: "/trials", label: "Clinical Trials", icon: HiOutlineBeaker },
  { to: "/referral", label: "Referral", icon: HiOutlineDocumentArrowUp },
];

function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-30 hidden h-screen w-64 flex-col bg-gradient-to-b from-ink-900 via-ink-800 to-ink-950 text-mist-100 border-r border-ink-700/50 shadow-2xl md:flex">
      {/* Top Header Logo */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-white/5">
        <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-400/25 to-teal-600/10 border border-teal-500/30 shadow-glow">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M2 12h4l2-7 4 14 2-7h8"
              stroke="#37B49D"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="vitals-line"
            />
          </svg>
          <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-teal-400 animate-ping" />
        </div>
        <div>
          <p className="font-display text-base font-bold tracking-tight text-white">
            Clinical Copilot
          </p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-pulse" />
            <p className="text-[10px] font-semibold uppercase tracking-wider text-teal-300/80">
              AI Health Platform
            </p>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 space-y-1.5 px-3 py-4 overflow-y-auto">
        {navItems.map(({ to, label, icon: Icon, badge }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-all duration-200 ease-out ${
                isActive
                  ? "bg-gradient-to-r from-teal-500/20 to-teal-500/5 text-teal-300 border border-teal-500/30 shadow-lg shadow-teal-950/40 translate-x-0.5"
                  : "text-ink-200 hover:bg-white/5 hover:text-white hover:translate-x-1"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  className={`h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                    isActive ? "text-teal-400" : "text-ink-300 group-hover:text-white"
                  }`}
                />
                <span className="truncate">{label}</span>

                {badge && (
                  <span className="ml-auto rounded-full bg-teal-500/20 px-2 py-0.5 text-[10px] font-bold text-teal-300 border border-teal-400/30 animate-pulse">
                    {badge}
                  </span>
                )}

                {isActive && (
                  <span className="ml-auto flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-400" />
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Help Banner Box */}
      <div className="p-3 mb-3">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/10 to-white/5 p-4 border border-white/10 backdrop-blur-md shadow-xl">
          <div className="absolute -right-4 -bottom-4 h-16 w-16 rounded-full bg-teal-500/10 blur-xl pointer-events-none" />
          <div className="flex items-center gap-2 text-xs font-semibold text-white">
            <HiQuestionMarkCircle className="h-4 w-4 text-teal-400 animate-bounce" />
            <span>Need Guidance?</span>
          </div>
          <p className="mt-1.5 text-[11px] leading-relaxed text-ink-200">
            Ask AI Assistant for instant medication insights & medical report summaries.
          </p>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
