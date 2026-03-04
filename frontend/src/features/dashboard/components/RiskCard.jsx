export default function RiskCard({
  risk = "safe",
  completion = 0,
  streak = 0,
  message = ""
}) {
  const styles = {
    safe: {
      bg: "bg-emerald-50",
      border: "border-l-emerald-500",
      text: "text-emerald-600",
      label: "SAFE"
    },
    warning: {
      bg: "bg-amber-50",
      border: "border-l-amber-500",
      text: "text-amber-600",
      label: "WARNING"
    },
    critical: {
      bg: "bg-rose-50",
      border: "border-l-rose-500",
      text: "text-rose-600",
      label: "CRITICAL"
    }
  };

  const current = styles[risk];

  return (
    <div
      className={`rounded-xl p-6 border-l-4 shadow-sm bg-white border border-gray-200
                  ${current.border} hover:shadow-md transition-shadow duration-300`}
    >
      <div className="flex items-center justify-between">
        <h2 className={`text-sm font-semibold ${current.text}`}>
          {current.label} RISK
        </h2>
      </div>

      <div className="mt-4 grid md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">
            Daily Completion
          </p>
          <p className="text-2xl font-bold text-gray-900">
            {completion}%
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">
            Current Streak
          </p>
          <p className="text-2xl font-bold text-gray-900">
            {streak} days
          </p>
        </div>
      </div>

      {message && (
        <p className="mt-4 text-sm text-gray-600">
          {message}
        </p>
      )}
    </div>
  );
}
