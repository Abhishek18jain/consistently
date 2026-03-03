import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";

export default function ConsistencyProfilePanel({ data }) {
  return (
    <div className="relative">
      {/* Ambient glow */}
      <div className="absolute -inset-10 bg-emerald-500/10 blur-3xl rounded-3xl" />

      <div className="relative bg-zinc-900/80 backdrop-blur border border-zinc-800 rounded-2xl p-10 shadow-2xl grid lg:grid-cols-3 gap-10">

        {/* PROFILE SUMMARY */}
        <div>
          <p className="text-xs text-zinc-500 mb-2">PROFILE TYPE</p>
          <h3 className="text-2xl font-bold mb-4 text-emerald-400">
            Weekend Drifter
          </h3>

          <div className="space-y-4 text-zinc-300">
            <p>
              Discipline Score: <b>62</b>
            </p>

            <p>
              Risk Level:{" "}
              <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded">
                WARNING
              </span>
            </p>

            <p className="text-sm text-zinc-400 mt-6">
              You maintain structure on weekdays but execution drops sharply on
              weekends, causing streak instability.
            </p>
          </div>
        </div>

        {/* STRENGTH / WEAKNESS */}
        <div className="space-y-6">

          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
            <p className="text-xs text-zinc-500 mb-1">STRONG WINDOW</p>
            <h4 className="text-xl font-semibold text-emerald-400">
              Morning
            </h4>
            <p className="text-xs text-zinc-400">
              Highest completion between 7AM–11AM
            </p>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
            <p className="text-xs text-zinc-500 mb-1">WEAK DAY</p>
            <h4 className="text-xl font-semibold text-red-400">
              Sunday
            </h4>
            <p className="text-xs text-zinc-400">
              Consistent drop in execution rate
            </p>
          </div>

        </div>

        {/* TREND GRAPH */}
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}
