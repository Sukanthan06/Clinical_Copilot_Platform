import { HiOutlineSparkles, HiOutlineExclamationTriangle, HiOutlineCheckCircle } from "react-icons/hi2";

const severityStyles = {
  positive: {
    ring: "ring-teal-100",
    bg: "bg-teal-50",
    text: "text-teal-700",
    icon: HiOutlineCheckCircle,
    iconColor: "text-teal-600",
  },
  warning: {
    ring: "ring-amber-100",
    bg: "bg-amber-50",
    text: "text-amber-700",
    icon: HiOutlineExclamationTriangle,
    iconColor: "text-amber-500",
  },
  critical: {
    ring: "ring-red-100",
    bg: "bg-red-50",
    text: "text-critical-500",
    icon: HiOutlineExclamationTriangle,
    iconColor: "text-critical-400",
  },
};

function AIInsights({ items = [] }) {
  return (
    <div className="card p-6">
      <div className="mb-5 flex items-center gap-2">
        <HiOutlineSparkles className="h-5 w-5 text-teal-500" />
        <h3 className="font-display text-base font-semibold text-ink-800">AI Health Insights</h3>
      </div>

      <div className="space-y-3">
        {items.map((insight) => {
          const style = severityStyles[insight.severity] ?? severityStyles.positive;
          const Icon = style.icon;
          return (
            <div
              key={insight.id}
              className={`rounded-xl ${style.bg} ring-1 ${style.ring} p-4 transition-transform duration-200 hover:-translate-y-0.5`}
            >
              <div className="flex items-start gap-2.5">
                <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${style.iconColor}`} />
                <div>
                  <p className={`text-sm font-semibold ${style.text}`}>{insight.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-ink-500">{insight.description}</p>
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
