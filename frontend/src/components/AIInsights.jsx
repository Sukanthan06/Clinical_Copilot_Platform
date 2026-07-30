import { HiOutlineSparkles, HiOutlineExclamationTriangle, HiOutlineCheckCircle, HiArrowRight } from "react-icons/hi2";
import { Link } from "react-router-dom";

const severityStyles = {
  positive: {
    ring: "border-teal-300/60 shadow-teal-500/5",
    bg: "bg-gradient-to-r from-teal-50/80 to-emerald-50/50",
    text: "text-teal-900",
    icon: HiOutlineCheckCircle,
    iconColor: "text-teal-600",
    badge: "bg-teal-100 text-teal-700",
  },
  warning: {
    ring: "border-amber-300/60 shadow-amber-500/5",
    bg: "bg-gradient-to-r from-amber-50/80 to-yellow-50/50",
    text: "text-amber-900",
    icon: HiOutlineExclamationTriangle,
    iconColor: "text-amber-500",
    badge: "bg-amber-100 text-amber-800",
  },
  critical: {
    ring: "border-rose-300/60 shadow-rose-500/5",
    bg: "bg-gradient-to-r from-rose-50/80 to-red-50/50",
    text: "text-rose-900",
    icon: HiOutlineExclamationTriangle,
    iconColor: "text-rose-500",
    badge: "bg-rose-100 text-rose-800",
  },
};

function AIInsights({ items = [] }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur-md p-6 shadow-soft border border-mist-300/80 transition-all duration-300 hover:shadow-card">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/10 text-teal-600 border border-teal-500/20 shadow-sm">
            <HiOutlineSparkles className="h-4 w-4 animate-pulse text-teal-500" />
          </div>
          <div>
            <h3 className="font-display text-base font-bold text-ink-900">AI Health Insights</h3>
            <p className="text-xs text-ink-400">Automated clinical analysis</p>
          </div>
        </div>

        <Link
          to="/chat"
          className="inline-flex items-center gap-1 text-xs font-semibold text-teal-600 hover:text-teal-700 hover:underline transition-all"
        >
          Ask AI
          <HiArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="space-y-3">
        {items.map((insight, index) => {
          const style = severityStyles[insight.severity] ?? severityStyles.positive;
          const Icon = style.icon;
          return (
            <div
              key={insight.id || index}
              className={`group relative rounded-xl ${style.bg} border ${style.ring} p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-md`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm border border-black/5">
                  <Icon className={`h-4 w-4 ${style.iconColor}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className={`text-sm font-bold ${style.text}`}>{insight.title}</p>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${style.badge}`}>
                      {insight.severity}
                    </span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-ink-600 font-medium">
                    {insight.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AIInsights;
