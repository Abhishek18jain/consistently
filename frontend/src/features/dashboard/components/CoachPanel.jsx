export default function CoachPanel({ insight }) {
  return (
    <div className="bg-zinc-900 rounded-xl shadow-sm p-6 border border-zinc-800">
      <h3 className="text-sm font-semibold text-zinc-200 mb-4">
        Consistency Coach
      </h3>

      <p className="text-sm text-zinc-400">
        {insight || "No insight available yet."}
      </p>
    </div>
  );
}
