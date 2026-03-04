import { Link } from "react-router-dom";

export default function CoachInsight() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm
                    hover:shadow-md transition-shadow duration-300 flex flex-col justify-between">

      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
          <span className="text-lg">🧠</span>
        </div>
        <h3 className="text-sm font-semibold text-gray-900">
          Coach Insight
        </h3>
      </div>

      {/* Message */}
      <p className="text-sm text-gray-600 mb-6">
        You've had 2 declining days. Want help analyzing why?
      </p>

      {/* Button */}
      <Link
        to="/coach"
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl
                   bg-gray-900 text-white text-sm font-medium
                   hover:bg-gray-800 transition-all duration-200
                   active:scale-95 w-fit"
      >
        Analyze with Coach →
      </Link>
    </div>
  );
}
