import {
  HiOutlineDocumentText,
  HiOutlineHeart,
  HiOutlineBeaker,
  HiOutlineDocumentArrowUp,
  HiArrowTrendingUp,
  HiMinus,
} from "react-icons/hi2";

const iconMap = {
  reports: HiOutlineDocumentText,
  conditions: HiOutlineHeart,
  trials: HiOutlineBeaker,
  referrals: HiOutlineDocumentArrowUp,
};

function StatCard({ label, value, delta, trend, icon }) {
  const Icon = iconMap[icon] ?? HiOutlineDocumentText;

  return (
    <div className="card card-hover animate-fadeUp p-5">
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50">
          <Icon className="h-5 w-5 text-teal-600" />
        </div>
        {trend === "up" && (
          <span className="flex items-center gap-1 rounded-full bg-teal-50 px-2 py-0.5 text-xs font-semibold text-teal-600">
            <HiArrowTrendingUp className="h-3.5 w-3.5" />
          </span>
        )}
        {trend === "flat" && (
          <span className="flex items-center gap-1 rounded-full bg-mist-200 px-2 py-0.5 text-xs font-semibold text-ink-400">
            <HiMinus className="h-3.5 w-3.5" />
          </span>
        )}
      </div>

      <p className="mt-4 font-mono text-3xl font-semibold text-ink-800">{value}</p>
      <p className="mt-1 text-sm font-medium text-ink-500">{label}</p>
      <p className="mt-3 text-xs text-ink-400">{delta}</p>
    </div>
  );
}

export default StatCard;
