import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";

export default function BehavioralPanel({ data }) {
  return (
    <div className="relative">
      {/* Ambient Glow */}
      <div className="absolute -inset-10 bg-yellow-500/10 blur-3xl rounded-3xl" />

      {/* Floating Streak Card */}
      <div className="absolute -top-14 -right-10 bg-zinc-900 z-10 border border-zinc-800 rounded-xl px-4 py-3 shadow-xl">
        <p className="text-xs text-zinc-400 ">Active Streak</p>
        <h4 className="text-2xl font-bold text-emerald-400">21 days</h4>
      </div>

      {/* Panel */}
      <div className="relative bg-zinc-900/80 backdrop-blur border border-zinc-800 rounded-2xl p-6 shadow-2xl">
        <div className="flex justify-between mb-4">
          <span className="text-yellow-400 text-sm font-medium">
            BEHAVIORAL RISK LEVEL
          </span>
          <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-md">
            WARNING
          </span>
        </div>

        <ul className="space-y-2 text-sm text-zinc-300 mb-6">
          <li>⚠ Streak at risk</li>
          <li>⬇ Completion trend declining</li>
          <li>Pattern detected: Weekend drop</li>
        </ul>

        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#eab308"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="text-right mt-6">
          <p className="text-sm text-zinc-400">Consistency Score</p>
          <h3 className="text-4xl font-bold text-yellow-400">64</h3>
          <p className="text-xs text-red-400">WEAK</p>
        </div>
      </div>
    </div>
  );
}
