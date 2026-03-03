import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
  XAxis,
  YAxis
} from "recharts";

export default function WeeklyChart({ data }) {
  return (
    <div className="border-l border-zinc-800 pl-8">

      <h3 className="text-lg font-medium mb-2">
        Weekly Completion
      </h3>

      <p className="text-xs text-zinc-500 mb-4">
        Execution trend shows decline after Friday
      </p>

      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
          <XAxis dataKey="day" stroke="#a1a1aa" />
          <YAxis stroke="#a1a1aa" />
          <Tooltip />

          <Line
            type="monotone"
            dataKey="value"
            stroke="#22c55e"
            strokeWidth={3}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
