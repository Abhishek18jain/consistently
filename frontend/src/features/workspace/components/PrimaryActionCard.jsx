import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function ActionCards({ status }) {
  const {
    mode,
    completionToday,
    journalsCount,
    risk,
    latestBookId,
  } = status;

  const navigate = useNavigate();

  const handleContinueToday = () => {
    if (latestBookId) {
      navigate(`/journals/${latestBookId}/open`);
    } else {
      navigate("/journals");
    }
  };

  const progressBg = completionToday >= 70
    ? "bg-emerald-500"
    : completionToday >= 40
      ? "bg-amber-500"
      : "bg-red-400";

  return (
    <div className="space-y-5">
      <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>

      <div className="grid lg:grid-cols-[2fr_1fr_1fr] gap-4">

        {/* CONTINUE TODAY */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-semibold text-gray-900">Continue Today</h4>
            {completionToday > 0 && (
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${completionToday >= 70 ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                }`}>
                {completionToday}%
              </span>
            )}
          </div>

          {/* Progress Bar */}
          <div className="h-2 bg-gray-100 rounded-full mb-3 mt-3 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${progressBg}`}
              style={{ width: `${completionToday}%` }}
            />
          </div>

          <p className="text-sm text-gray-500 mb-5">
            {completionToday === 0
              ? mode === "no_pages"
                ? "No entries yet today"
                : "Keep going — you got this"
              : `${completionToday}% tasks completed today`}
          </p>

          <button
            onClick={handleContinueToday}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-xl font-semibold transition-all duration-200 active:scale-[0.98]"
          >
            {mode === "no_pages" ? "Write First Page" : "Continue Today's Page"}
          </button>
        </div>

        {/* OPEN JOURNAL */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
          <h4 className="font-semibold text-gray-900 mb-2">My Journals</h4>
          <p className="text-sm text-gray-500 mb-4">
            {journalsCount} Journal{journalsCount !== 1 && "s"}
          </p>
          <Link
            to="/journals"
            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
          >
            View All →
          </Link>
        </div>

        {/* COACH */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
          <h4 className="font-semibold text-gray-900 mb-2">Talk to Coach</h4>
          <span
            className={`inline-block text-xs px-2.5 py-1 rounded-full mb-3 font-medium ${risk === "safe"
              ? "bg-emerald-50 text-emerald-600"
              : risk === "warning"
                ? "bg-amber-50 text-amber-600"
                : "bg-red-50 text-red-600"
              }`}
          >
            {risk === "safe" ? "✓ On Track" : risk === "warning" ? "⚠️ Warning" : "🔴 At Risk"}
          </span>
          <p className="text-sm text-gray-500 mb-4">Get personalized insights.</p>
          <Link
            to="/coach"
            className="inline-flex px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium transition-all duration-200 active:scale-95"
          >
            Open Coach
          </Link>
        </div>
      </div>
    </div>
  );
}