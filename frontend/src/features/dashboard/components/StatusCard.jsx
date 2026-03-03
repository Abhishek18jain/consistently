export default function StatusCard({ data }) {
  const completion = data?.recentDays ?? 0;
  const streak = data?.streak?.current ?? 0;

  let risk = "Safe";
  let badge = "bg-emerald-500/20 text-emerald-400";
  let glow = "bg-emerald-500/20";

  if (completion < 70) {
    risk = "Warning";
    badge = "bg-yellow-500/20 text-yellow-400";
    glow = "bg-yellow-500/20";
  }
  if (completion < 40) {
    risk = "Critical";
    badge = "bg-red-500/20 text-red-400";
    glow = "bg-red-500/20";
  }

  return (
    <div className="relative rounded-2xl overflow-hidden">

      {/* 🔥 Ambient glow behind panel */}
      <div className={`absolute -inset-10 blur-3xl ${glow} opacity-40`} />

      {/* Panel */}
      <div className="relative rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-950 p-10 shadow-[0_0_40px_rgba(0,0,0,0.6)]">

        {/* Top edge light */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-500 to-transparent" />

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <span className={`px-3 py-1 rounded-md text-sm font-medium ${badge}`}>
            {risk}
          </span>

          <span className="text-sm text-zinc-400">
            Streak: {streak}
          </span>
        </div>

        {/* Main Metric */}
        <div className="text-center mb-8">
          <h2 className="text-7xl font-bold tracking-tight">
            {completion}%
          </h2>
          <p className="text-zinc-400">Today Completion</p>
        </div>

        {/* Button */}
        <div className="flex justify-center">
          <button className="px-6 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 shadow-inner transition">
            Review Today’s Plan
          </button>
        </div>
      </div>
    </div>
  );
}
