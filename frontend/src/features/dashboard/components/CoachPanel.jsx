export default function CoachPanel({ insight }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200
                    hover:shadow-md transition-shadow duration-300">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">
        Consistency Coach
      </h3>

      <p className="text-sm text-gray-500">
        {insight || "No insight available yet."}
      </p>
    </div>
  );
}
