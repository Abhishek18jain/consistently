import { Link } from "react-router-dom";
export default function ActionCards({ status }) {
  const {
    mode,
    completionToday,
    journalsCount,
    risk
  } = status;

  const needsWriting = mode === "no_pages" || completionToday < 70;

  return (
    <div className="space-y-6">

      <h3 className="text-lg font-semibold">
        Main Action Cards
      </h3>

      {/* 🔥 3-CARD GRID */}
      <div className="grid lg:grid-cols-[2fr_1fr_1fr] gap-6">

        {/* ================= CONTINUE TODAY ================= */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-lg">

          <h4 className="font-semibold mb-4">
            Continue Today
          </h4>

          {/* Progress */}
          <div className="h-2 bg-zinc-800 rounded-full mb-3">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all"
              style={{ width: `${completionToday}%` }}
            />
          </div>

          <p className="text-sm text-zinc-400 mb-5">
            {completionToday}% Complete
          </p>

          <button className="w-full bg-emerald-600 hover:bg-emerald-500 py-3 rounded-xl font-semibold">
            {mode === "no_pages"
              ? "Write First Page"
              : "Continue Today’s Page"}
          </button>

        </div>

        {/* ================= OPEN JOURNAL ================= */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-lg">

          <h4 className="font-semibold mb-2">
            Open Journal
          </h4>

          <p className="text-sm text-zinc-400 mb-4">
            {journalsCount} Journal{journalsCount !== 1 && "s"}
          </p>

          <Link to= "/journals" className="text-emerald-400 font-medium">
            Go to Journals →
          </Link>

        </div>

        {/* ================= COACH ================= */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-lg">

          <h4 className="font-semibold mb-2">
            Talk to Coach
          </h4>

          <span
            className={`inline-block text-xs px-2 py-1 rounded mb-3
              ${risk === "safe"
                ? "bg-emerald-500/20 text-emerald-400"
                : risk === "warning"
                ? "bg-yellow-500/20 text-yellow-400"
                : "bg-red-500/20 text-red-400"}
            `}
          >
            Risk: {risk}
          </span>

          <p className="text-sm text-zinc-400 mb-4">
            Analyze your habits.
          </p>

          <button className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-lg">
            Analyze with Coach
          </button>

        </div>

      </div>

    </div>
  );
}