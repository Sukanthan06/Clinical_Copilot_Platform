import {
  HiOutlineCloudArrowUp,
  HiOutlineBeaker,
  HiOutlineDocumentArrowUp,
  HiOutlineUserCircle,
} from "react-icons/hi2";

const iconMap = {
  upload: HiOutlineCloudArrowUp,
  trial: HiOutlineBeaker,
  referral: HiOutlineDocumentArrowUp,
  profile: HiOutlineUserCircle,
};

function RecentActivity({ items = [] }) {
  return (
    <div className="card p-6">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="font-display text-base font-semibold text-ink-800">Recent Activity</h3>
        <span className="label-eyebrow">Live</span>
      </div>

      <ul className="space-y-5">
        {items.map((item, idx) => {
          const Icon = iconMap[item.type] ?? HiOutlineCloudArrowUp;
          return (
            <li key={item.id} className="relative flex gap-3.5 pl-1">
              {idx !== items.length - 1 && (
                <span className="absolute left-[19px] top-9 h-[calc(100%-6px)] w-px bg-mist-300" />
              )}
              <div className="z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-mist-100 ring-4 ring-white">
                <Icon className="h-4 w-4 text-ink-500" />
              </div>
              <div className="min-w-0 flex-1 pb-1">
                <p className="text-sm font-medium text-ink-800">{item.title}</p>
                <p className="mt-0.5 text-xs text-ink-500">{item.description}</p>
                <p className="mt-1 text-[11px] font-medium text-ink-400">{item.time}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default RecentActivity;
