import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getDashboardAnalyticsAPI } from "../dashboardApi";
import Heatmap from "../components/HeatMap";

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
}

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const analytics = await getDashboardAnalyticsAPI();
        setData(analytics);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin" />
          <p className="text-sm font-semibold text-gray-500">Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center py-32">
        <p className="text-red-500 font-medium">Failed to load dashboard</p>
      </div>
    );
  }

  if (data?.isFirstTimeUser) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="max-w-lg w-full bg-white border border-gray-200 rounded-3xl p-10 text-center space-y-6 shadow-sm">
          <div className="text-5xl mb-2">🚀</div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome to Consistently</h1>
          <p className="text-gray-500 text-base">
            Create your first journal to start building real consistency habits.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate("/journals")}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3.5 rounded-2xl font-bold transition-all active:scale-[0.98]"
            >
              Create Your First Journal
            </button>
            <button
              onClick={() => navigate("/workspace")}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3.5 rounded-2xl font-medium transition-all"
            >
              Explore Workspace
            </button>
          </div>
        </div>
      </div>
    );
  }

  const streak = data?.streak || { current: 0, best: 0 };
  const todayCompletion = data?.todayCompletion ?? 0;
  const avgCompletion = data?.averageCompletion ?? 0;
  const consistencyScore = data?.consistencyScore ?? 0;
  const weeklyData = data?.weeklyData ?? [];
  const journalCompletions = data?.journalCompletions ?? [];

  const todayStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  // Risk level
  let risk = "safe";
  let riskLabel = "On Track";
  if (todayCompletion < 40) { risk = "danger"; riskLabel = "At Risk"; }
  else if (todayCompletion < 70) { risk = "warning"; riskLabel = "Warning"; }

  const riskStyles = {
    safe: "bg-emerald-50 text-emerald-700 border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    danger: "bg-red-50 text-red-700 border-red-200",
  };

  const progressColor =
    todayCompletion >= 70 ? "bg-emerald-500" : todayCompletion >= 40 ? "bg-amber-500" : "bg-red-400";

  return (
    <div className="space-y-6 pb-8">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{getGreeting()} 👋</h1>
          <p className="text-sm text-gray-500 font-medium mt-0.5">{todayStr}</p>
        </div>
        <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${riskStyles[risk]}`}>
          {riskLabel}
        </span>
      </div>

      {/* ── Status Hero Card ── */}
      <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
        <div className="grid md:grid-cols-[1fr_auto] gap-8 items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
              Today's Completion
            </p>
            <div className="flex items-baseline gap-3 mb-4">
              <h2 className="text-6xl font-extrabold text-gray-900">{todayCompletion}%</h2>
              {streak.current > 0 && (
                <span className="text-sm font-bold text-orange-500 bg-orange-50 px-2.5 py-1 rounded-full">
                  🔥 {streak.current} day streak
                </span>
              )}
            </div>
            <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden max-w-md mb-4">
              <div
                className={`h-full rounded-full transition-all duration-700 ${progressColor}`}
                style={{ width: `${todayCompletion}%` }}
              />
            </div>
            <div className="flex gap-3 mt-4">
              <Link
                to="/journals"
                className="bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95"
              >
                Open Journals
              </Link>
              <Link
                to="/workspace"
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
              >
                Workspace
              </Link>
            </div>
          </div>

          {/* Mini ring chart */}
          <div className="flex items-center justify-center">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#f3f4f6" strokeWidth="10" />
                <circle
                  cx="60" cy="60" r="50" fill="none"
                  stroke={todayCompletion >= 70 ? "#10b981" : todayCompletion >= 40 ? "#f59e0b" : "#ef4444"}
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${todayCompletion * 3.14} 314`}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-extrabold text-gray-900">{todayCompletion}%</span>
                <span className="text-[9px] font-bold uppercase text-gray-400 tracking-wider">Today</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Metrics Grid ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { title: "Current Streak", value: `${streak.current}`, icon: "🔥", color: "emerald" },
          { title: "Best Streak", value: `${streak.best}`, icon: "🏆", color: "amber" },
          { title: "Avg Completion", value: `${avgCompletion}%`, icon: "📊", color: "blue" },
          { title: "Consistency", value: `${consistencyScore}%`, icon: "🧠", color: "purple" },
        ].map((m) => (
          <div
            key={m.title}
            className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{m.title}</p>
                <p className="text-2xl font-extrabold text-gray-900 mt-1">{m.value}</p>
              </div>
              <span className="text-2xl opacity-80">{m.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Per-Journal Completion (Today) ── */}
      {journalCompletions.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>📖</span> Today's Journal Progress
          </h3>
          <div className="space-y-3">
            {journalCompletions.map((jc, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-gray-800">{jc.journalName}</span>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${jc.completion >= 70
                          ? "bg-emerald-50 text-emerald-700"
                          : jc.completion >= 40
                            ? "bg-amber-50 text-amber-700"
                            : "bg-red-50 text-red-700"
                        }`}
                    >
                      {jc.completion}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${jc.completion >= 70 ? "bg-emerald-500" : jc.completion >= 40 ? "bg-amber-500" : "bg-red-400"
                        }`}
                      style={{ width: `${jc.completion}%` }}
                    />
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 w-12 text-right">
                  {jc.journalType}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Weekly Trend + Heatmap ── */}
      <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900">Behavioral Analytics</h2>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Last 7 days</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Weekly bar chart */}
          <div>
            <h3 className="text-sm font-bold text-gray-700 mb-4">Weekly Completion</h3>
            <div className="flex items-end gap-2 h-40">
              {weeklyData.map((d, i) => {
                const barHeight = Math.max(d.value, 4);
                const isToday = i === weeklyData.length - 1;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[10px] font-bold text-gray-500">{d.value > 0 ? `${d.value}%` : ""}</span>
                    <div
                      className={`w-full rounded-lg transition-all duration-500 ${isToday
                          ? "bg-gray-900"
                          : d.value >= 70
                            ? "bg-emerald-400"
                            : d.value >= 40
                              ? "bg-amber-400"
                              : d.value > 0
                                ? "bg-red-300"
                                : "bg-gray-100"
                        }`}
                      style={{ height: `${barHeight}%` }}
                    />
                    <span
                      className={`text-[10px] font-bold ${isToday ? "text-gray-900" : "text-gray-400"
                        }`}
                    >
                      {d.day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Heatmap */}
          <Heatmap heatmap={data?.heatmap ?? []} />
        </div>
      </div>

      {/* ── Quick Links ── */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <Link
          to="/journals"
          className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300 group"
        >
          <span className="text-2xl mb-2 block">📚</span>
          <h4 className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
            My Journals
          </h4>
          <p className="text-xs text-gray-400 mt-1">
            {data?.journals?.length || 0} active
          </p>
        </Link>

        <Link
          to="/workspace"
          className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all duration-300 group"
        >
          <span className="text-2xl mb-2 block">🧩</span>
          <h4 className="text-sm font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
            Workspace
          </h4>
          <p className="text-xs text-gray-400 mt-1">Overview & actions</p>
        </Link>

        <Link
          to="/coach"
          className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-purple-200 transition-all duration-300 group"
        >
          <span className="text-2xl mb-2 block">🧠</span>
          <h4 className="text-sm font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
            AI Coach
          </h4>
          <p className="text-xs text-gray-400 mt-1">Personalized insights</p>
        </Link>
      </div>
    </div>
  );
}
