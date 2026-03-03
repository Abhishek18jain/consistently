export default function RiskCard({
  risk = "safe",
  completion = 0,
  streak = 0,
  message = ""
}) {
  const styles = {
    safe: {
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/40",
      text: "text-emerald-400",
      label: "SAFE"
    },
    warning: {
      bg: "bg-amber-500/10",
      border: "border-amber-500/40",
      text: "text-amber-400",
      label: "WARNING"
    },
    critical: {
      bg: "bg-rose-500/10",
      border: "border-rose-500/40",
      text: "text-rose-400",
      label: "CRITICAL"
    }
  };

  const current = styles[risk];

  return (
    <div
      className={`rounded-xl p-6 border-l-4 shadow-sm bg-zinc-900 border border-zinc-800 ${current.border}`}
    >
      <div className="flex items-center justify-between">
        <h2 className={`text-sm font-semibold ${current.text}`}>
          {current.label} RISK
        </h2>
      </div>

      <div className="mt-4 grid md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-zinc-400">
            Daily Completion
          </p>
          <p className="text-2xl font-bold text-zinc-100">
            {completion}%
          </p>
        </div>

        <div>
          <p className="text-sm text-zinc-400">
            Current Streak
          </p>
          <p className="text-2xl font-bold text-zinc-100">
            {streak} days
          </p>
        </div>
      </div>

      {message && (
        <p className="mt-4 text-sm text-zinc-300">
          {message}
        </p>
      )}
    </div>
  );
}
