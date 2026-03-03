import { Link } from "react-router-dom";
export default function CoachInsight() {
  return (
    <div className="relative rounded-2xl overflow-hidden">

      <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 to-zinc-950" />

      <div className="relative border border-zinc-800 rounded-2xl p-6 flex flex-col justify-between">

        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">🧠</span>
          <h3 className="text-sm font-semibold text-zinc-200">
            Coach Insight
          </h3>
        </div>

        {/* Message */}
        <p className="text-sm text-zinc-300 mb-6">
          You’ve had 2 declining days. Want help analyzing why?
        </p>

        {/* Button */}
        <Link to = "/coach" className="px-4 py-2 rounded-lg border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-sm">
          Analyze with Coach
        </Link>

      </div>
    </div>
  );
}
