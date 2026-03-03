import clsx from "clsx";

export default function RiskCard({
  risk = "safe",
  completion = 0,
  streak = 0,
  message = ""
}) {
  const styles = {
    safe: {
      bg: "bg-emerald-50",
      border: "border-emerald-500",
      text: "text-emerald-600",
      label: "SAFE"
    },
    warning: {
      bg: "bg-amber-50",
      border: "border-amber-500",
      text: "text-amber-600",
      label: "WARNING"
    },
    critical: {
      bg: "bg-rose-50",
      border: "border-rose-500",
      text: "text-rose-600",
      label: "CRITICAL"
    }
  };

  const current = styles[risk];

  return (
    <div
      className={clsx(
        "rounded-xl p-6 border-l-4 shadow-sm",
        current.bg,
        current.border
      )}
    >
      <div className="flex items-center justify-between">
        <h2 className={clsx("text-sm font-semibold", current.text)}>
          {current.label} RISK
        </h2>
      </div>

      <div className="mt-4 grid md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-slate-500">
            Daily Completion
          </p>
          <p className="text-2xl font-bold text-slate-900">
            {completion}%
          </p>
        </div>

        <div>
          <p className="text-sm text-slate-500">
            Current Streak
          </p>
          <p className="text-2xl font-bold text-slate-900">
            {streak} days
          </p>
        </div>
      </div>

      {message && (
        <p className="mt-4 text-sm text-slate-700">
          {message}
        </p>
      )}
    </div>
  );
}
