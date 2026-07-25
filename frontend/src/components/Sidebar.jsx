import { NavLink } from "react-router-dom";
import {
  HiOutlineSquares2X2,
  HiOutlineCloudArrowUp,
  HiOutlineUserCircle,
  HiOutlineClock,
  HiOutlineSparkles,
  HiOutlineBeaker,
  HiOutlineDocumentArrowUp,
} from "react-icons/hi2";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: HiOutlineSquares2X2 },
  { to: "/upload", label: "Upload Reports", icon: HiOutlineCloudArrowUp },
  { to: "/profile", label: "Patient Profile", icon: HiOutlineUserCircle },
  { to: "/timeline", label: "Timeline", icon: HiOutlineClock },
  { to: "/chat", label: "AI Assistant", icon: HiOutlineSparkles },
  { to: "/trials", label: "Clinical Trials", icon: HiOutlineBeaker },
  { to: "/referral", label: "Referral", icon: HiOutlineDocumentArrowUp },
];

function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-30 hidden h-screen w-64 flex-col bg-ink-800 text-mist-100 md:flex">
      <div className="flex items-center gap-2.5 px-6 py-6">
        <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-teal-500/20">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M2 12h4l2-7 4 14 2-7h8"
              stroke="#37B49D"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="vitals-line"
            />
          </svg>
        </div>
        <div>
          <p className="font-display text-base font-semibold leading-none text-white">
            Clinical Copilot
          </p>
          <p className="mt-1 text-[11px] font-medium uppercase tracking-wider text-ink-300">
            AI Health Platform
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-2">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-teal-500/15 text-teal-300"
                  : "text-ink-200 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  className={`h-5 w-5 shrink-0 transition-colors ${
                    isActive ? "text-teal-400" : "text-ink-300 group-hover:text-white"
                  }`}
                />
                <span>{label}</span>
                {isActive && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-teal-400" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mx-3 mb-6 rounded-xl bg-white/5 p-4">
        <p className="text-xs font-semibold text-white">Need help?</p>
        <p className="mt-1 text-[11px] leading-relaxed text-ink-300">
          Ask the AI Assistant about your reports, medications, or trial eligibility.
        </p>
      </div>
    </aside>
  );
}

export default Sidebar;
