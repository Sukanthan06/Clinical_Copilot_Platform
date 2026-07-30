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

const gradientMap = {
  reports: "from-teal-500/20 to-teal-500/5 text-teal-600 border-teal-500/30",
  conditions: "from-rose-500/20 to-rose-500/5 text-rose-600 border-rose-500/30",
  trials: "from-amber-500/20 to-amber-500/5 text-amber-600 border-amber-500/30",
  referrals: "from-blue-500/20 to-blue-500/5 text-blue-600 border-blue-500/30",
};

function StatCard({ label, value, delta, trend, icon }) {
  const Icon = iconMap[icon] ?? HiOutlineDocumentText;
  const gradient = gradientMap[icon] ?? gradientMap.reports;

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur-md p-6 shadow-soft border border-mist-300/80 transition-all duration-300 hover:shadow-lift hover:-translate-y-1.5 hover:border-teal-500/40">
      {/* Top ambient hover glow background */}
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-teal-400/10 blur-2xl transition-all duration-500 group-hover:scale-150 group-hover:bg-teal-400/20 pointer-events-none" />

      <div className="flex items-start justify-between">
        <div className={`relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} border shadow-sm transition-transform duration-300 group-hover:scale-110`}>
          <Icon className="h-6 w-6" />
          <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-teal-500 opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity" />
        </div>

        {trend === "up" && (
          <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-1 text-xs font-bold text-teal-600 border border-teal-200/60 shadow-sm group-hover:bg-teal-100 transition-colors">
            <HiArrowTrendingUp className="h-3.5 w-3.5" />
            <span>Active</span>
          </span>
        )}
        {trend === "flat" && (
          <span className="inline-flex items-center gap-1 rounded-full bg-mist-200/90 px-2.5 py-1 text-xs font-semibold text-ink-500 border border-mist-300">
            <HiMinus className="h-3.5 w-3.5" />
            <span>Stable</span>
          </span>
        )}
      </div>

      <div className="mt-5 flex items-baseline justify-between">
        <p className="font-mono text-3xl font-extrabold tracking-tight text-ink-900 group-hover:text-teal-700 transition-colors">
          {value}
        </p>
      </div>

      <p className="mt-1 text-sm font-semibold text-ink-700">{label}</p>
      <p className="mt-2 text-xs font-medium text-ink-400 flex items-center gap-1">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-teal-500" />
        {delta}
      </p>

      {/* Bottom animated active line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-teal-400/0 to-transparent group-hover:via-teal-400/60 transition-all duration-500" />
    </div>
  );
}

export default StatCard;
