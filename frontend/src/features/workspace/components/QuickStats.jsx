export default function QuickStats({ status }) {
  const {
    streak,
    bestStreak,
    avgCompletion,
    totalActiveDays
  } = status;

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Quick Stats
      </h3>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat title="Current Streak" value={`${streak} Days`} icon="🔥" />
        <Stat title="Best Streak" value={`${bestStreak} Days`} icon="🏆" />
        <Stat title="Avg Completion" value={`${avgCompletion}%`} icon="📊" />
        <Stat title="Total Active Days" value={`${totalActiveDays} Days`} icon="📅" />
      </div>
    </div>
  );
}

function Stat({ title, value, icon }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm
                    hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
            {title}
          </p>
          <p className="text-xl font-bold text-gray-900 mt-1">
            {value}
          </p>
        </div>
        <div className="text-2xl opacity-80">
          {icon}
        </div>
      </div>
    </div>
  );
}