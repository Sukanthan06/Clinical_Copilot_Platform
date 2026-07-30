import { Link } from "react-router-dom";
import {
  HiOutlineCloudArrowUp,
  HiOutlineClock,
  HiOutlineSparkles,
  HiOutlineBeaker,
  HiArrowRight,
  HiOutlineBolt,
} from "react-icons/hi2";

const iconMap = {
  upload: HiOutlineCloudArrowUp,
  timeline: HiOutlineClock,
  chat: HiOutlineSparkles,
  trials: HiOutlineBeaker,
};

function QuickActions({ actions = [] }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur-md p-6 shadow-soft border border-mist-300/80 transition-all duration-300 hover:shadow-card">
      <div className="mb-5 flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/10 text-teal-600 border border-teal-500/20 shadow-sm">
          <HiOutlineBolt className="h-4 w-4 text-teal-600 animate-pulse" />
        </div>
        <div>
          <h3 className="font-display text-base font-bold text-ink-900">Quick Actions</h3>
          <p className="text-xs text-ink-400">Frequently used shortcuts</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => {
          const Icon = iconMap[action.icon] ?? HiOutlineSparkles;
          return (
            <Link
              key={action.id || index}
              to={action.to}
              className="group relative flex flex-col justify-between rounded-xl border border-mist-300/80 bg-gradient-to-br from-mist-50 to-white p-4 transition-all duration-300 hover:-translate-y-1 hover:border-teal-500/40 hover:bg-gradient-to-br hover:from-teal-50/70 hover:to-white hover:shadow-md active:scale-95"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-500/10 text-teal-600 group-hover:bg-teal-500 group-hover:text-white transition-all duration-300 shadow-sm">
                <Icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs sm:text-sm font-bold text-ink-800 group-hover:text-teal-900 transition-colors">
                  {action.label}
                </span>
                <HiArrowRight className="h-4 w-4 text-ink-300 transition-all duration-300 group-hover:translate-x-1 group-hover:text-teal-600" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default QuickActions;
