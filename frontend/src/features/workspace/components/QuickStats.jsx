export default function QuickStats({ status }) {
  const {
    streak,
    bestStreak,
    avgCompletion,
    totalActiveDays
  } = status;

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">
        Quick Stats
      </h3>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

        <Stat
          title="Current Streak"
          value={`${streak} Days`}
        />

        <Stat
          title="Best Streak"
          value={`${bestStreak} Days`}
        />

        <Stat
          title="Avg Completion"
          value={`${avgCompletion}%`}
        />

        <Stat
          title="Total Active Days"
          value={`${totalActiveDays} Days`}
        />

      </div>
    </div>
  );
}

function Stat({ title, value, icon }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-lg">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-sm text-zinc-400">
            {title}
          </p>

          <p className="text-xl font-semibold mt-1">
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