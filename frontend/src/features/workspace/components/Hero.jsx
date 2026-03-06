export default function HeroStrip({ status }) {
  const {
    mode,
    completionToday,
    streak,
    risk,
    hoursLeftToday,
  } = status;

  // Dynamic greeting based on time of day
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  const message = {
    no_journals: "Create your first journal to get started!",
    no_pages: "You haven't written today — let's change that.",
    active: "You're building momentum. Keep going!",
  };

  const riskLabel = {
    safe: "✓ On Track",
    warning: "⚠️ At Risk",
    danger: "🔴 Streak in Danger",
  };

  const riskColor = {
    safe: "text-emerald-600",
    warning: "text-amber-600",
    danger: "text-red-600",
  };

  return (
    <div
      className="relative rounded-2xl bg-white border border-gray-200 p-8 md:p-10
                    shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
    >
      {/* Subtle gradient */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-50 blur-3xl rounded-full opacity-60" />

      <div className="relative flex flex-col md:flex-row items-start justify-between gap-6">
        {/* LEFT TEXT */}
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {greeting} 👋
          </h2>
          <p className="text-gray-500">{message[mode] || message.no_pages}</p>

          {risk === "danger" && hoursLeftToday > 0 && (
            <p className="text-red-500 mt-3 font-medium">
              ⚠️ {hoursLeftToday} hours left to save your streak
            </p>
          )}
        </div>

        {/* FLOATING STREAK CARD */}
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 w-full md:w-64 shadow-sm">
          <p className="font-semibold text-lg text-gray-900 mb-2">
            🔥 {streak} Day Streak
          </p>

          <div className="text-sm text-gray-500 space-y-1">
            <p>● {completionToday}% Complete Today</p>
            <p className={riskColor[risk] || "text-gray-500"}>
              {riskLabel[risk] || "Unknown"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}