export default function CoachPanel({ insight }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
      <h3 className="text-sm font-semibold text-slate-800 mb-4">
        Consistency Coach
      </h3>

      <p className="text-sm text-slate-600">
        {insight || "No insight available yet."}
      </p>
    </div>
  );
}
