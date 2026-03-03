export default function ExecutionMonitoringSection() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-14 grid lg:grid-cols-2 gap-20 items-center">

      {/* LEFT */}
      <div>
        <h2 className="text-5xl font-bold mb-6">
          Execution Monitoring Engine
        </h2>

        <p className="text-zinc-400 mb-10 max-w-lg">
          Daily execution is processed through a strict threshold system to
          maintain streak stability.
        </p>

        {/* Status bullets */}
        <div className="space-y-3 text-zinc-300">
          <p>✔ Tasks Completed: 7 / 10</p>
          <p>✔ Threshold: 70%</p>
          <p>✔ Streak Status: Maintained</p>
        </div>
      </div>

      {/* RIGHT — CONSOLE */}
      <div className="relative">

        {/* Glow */}
        <div className="absolute -inset-10 bg-emerald-500/10 blur-3xl rounded-full" />

        <div className="relative bg-zinc-900/80 backdrop-blur border border-zinc-800 rounded-2xl p-8 shadow-2xl">

          <p className="text-xs text-emerald-400 mb-2 tracking-widest">
            EXECUTION SCORE
          </p>

          <h3 className="text-3xl font-bold mb-6">70%</h3>

          {/* Progress */}
          <div className="h-3 bg-zinc-800 rounded mb-6">
            <div className="h-full bg-yellow-400 rounded w-[70%]" />
          </div>

          {/* Activity grid */}
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 28 }).map((_, i) => (
              <div
                key={i}
                className={`h-4 rounded ${
                  i % 3 === 0
                    ? "bg-emerald-500"
                    : "bg-zinc-800"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
