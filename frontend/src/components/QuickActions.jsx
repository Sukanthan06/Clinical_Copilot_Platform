import { Link } from "react-router-dom";
import {
  HiOutlineCloudArrowUp,
  HiOutlineClock,
  HiOutlineSparkles,
  HiOutlineBeaker,
  HiArrowRight,
} from "react-icons/hi2";

const iconMap = {
  upload: HiOutlineCloudArrowUp,
  timeline: HiOutlineClock,
  chat: HiOutlineSparkles,
  trials: HiOutlineBeaker,
};

function QuickActions({ actions = [] }) {
  return (
    <div className="card p-6">
      <h3 className="mb-5 font-display text-base font-semibold text-ink-800">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => {
          const Icon = iconMap[action.icon] ?? HiOutlineSparkles;
          return (
            <Link
              key={action.id}
              to={action.to}
              className="group flex flex-col justify-between rounded-xl border border-mist-300/70 bg-mist-50 p-4 transition-all duration-200 hover:border-teal-300 hover:bg-teal-50"
            >
              <Icon className="h-5 w-5 text-teal-600" />
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm font-medium text-ink-700">{action.label}</span>
                <HiArrowRight className="h-3.5 w-3.5 text-ink-300 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-teal-600" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default QuickActions;
