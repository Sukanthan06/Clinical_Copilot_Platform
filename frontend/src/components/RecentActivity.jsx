import {
  HiOutlineCloudArrowUp,
  HiOutlineBeaker,
  HiOutlineDocumentArrowUp,
  HiOutlineUserCircle,
  HiOutlineClock,
} from "react-icons/hi2";

const iconMap = {
  upload: HiOutlineCloudArrowUp,
  trial: HiOutlineBeaker,
  referral: HiOutlineDocumentArrowUp,
  profile: HiOutlineUserCircle,
};

function RecentActivity({ items = [] }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur-md p-6 shadow-soft border border-mist-300/80 transition-all duration-300 hover:shadow-card">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/10 text-teal-600 border border-teal-500/20 shadow-sm">
            <HiOutlineClock className="h-4 w-4 text-teal-600 animate-spin" style={{ animationDuration: "12s" }} />
          </div>
          <div>
            <h3 className="font-display text-base font-bold text-ink-900">Recent Activity</h3>
            <p className="text-xs text-ink-400">Real-time health timeline</p>
          </div>
        </div>

        <span className="relative inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-bold text-teal-700 border border-teal-200">
          <span className="h-2 w-2 rounded-full bg-teal-500 animate-ping" />
          Live Stream
        </span>
      </div>

      <ul className="relative space-y-5">
        {items.map((item, idx) => {
          const Icon = iconMap[item.type] ?? HiOutlineCloudArrowUp;
          const isLast = idx === items.length - 1;
          return (
            <li key={item.id || idx} className="group relative flex gap-4 pl-1">
              {!isLast && (
                <span className="absolute left-[18px] top-9 h-[calc(100%+8px)] w-0.5 bg-gradient-to-b from-teal-400/50 to-mist-300 group-hover:from-teal-500 transition-colors" />
              )}
              <div className="z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-mist-100 to-mist-200 border border-mist-300 text-ink-600 shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-teal-500 group-hover:to-teal-600 group-hover:text-white group-hover:border-teal-400 group-hover:shadow-glow">
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1 rounded-xl p-2 transition-colors group-hover:bg-teal-50/50">
                <p className="text-sm font-bold text-ink-800 group-hover:text-teal-900 transition-colors">
                  {item.title}
                </p>
                <p className="mt-0.5 text-xs font-medium text-ink-500">{item.description}</p>
                <p className="mt-1 text-[11px] font-semibold text-teal-600/90">{item.time}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default RecentActivity;
