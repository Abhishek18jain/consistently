export default function StatusCard({ data }) {
  const completion = data?.recentDays ?? 0;
  const streak = data?.streak?.current ?? 0;

  let risk = "Safe";
  let badge = "bg-emerald-50 text-emerald-600 border border-emerald-200";
  let ringColor = "ring-emerald-400";

  if (completion < 70) {
    risk = "Warning";
    badge = "bg-amber-50 text-amber-600 border border-amber-200";
    ringColor = "ring-amber-400";
  }
  if (completion < 40) {
    risk = "Critical";
    badge = "bg-red-50 text-red-600 border border-red-200";
    ringColor = "ring-red-400";
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm
                    hover:shadow-md transition-shadow duration-300">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge}`}>
          {risk}
        </span>

        <span className="text-sm text-gray-500 font-medium">
          🔥 Streak: {streak}
        </span>
      </div>

      {/* Main Metric */}
      <div className="text-center mb-8">
        <h2 className="text-6xl font-bold tracking-tight text-gray-900">
          {completion}%
        </h2>
        <p className="text-gray-500 mt-1">Today's Completion</p>
      </div>

      {/* Progress Ring */}
      <div className="flex justify-center mb-6">
        <div className={`w-16 h-16 rounded-full ring-4 ${ringColor} ring-offset-4 ring-offset-white
                        flex items-center justify-center`}>
          <span className="text-lg font-bold text-gray-900">{completion}%</span>
        </div>
      </div>

      {/* Button */}
      <div className="flex justify-center">
        <button className="px-6 py-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-white
                           text-sm font-medium shadow-sm transition-all duration-200
                           active:scale-95">
          Review Today's Plan
        </button>
      </div>
    </div>
  );
}
