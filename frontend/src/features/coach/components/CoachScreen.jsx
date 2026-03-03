import { useState, useRef, useEffect } from "react";
import api from "../../../services/axios";

const ALL_OPTIONS = [
  { label: "Am I at Risk?", key: "RISK_TODAY", emoji: "⚠️", color: "text-red-400" },
  { label: "Task Analysis", key: "TASK_INSIGHTS", emoji: "📋", color: "text-blue-400" },
  { label: "What To Adjust", key: "WHAT_TO_ADJUST", emoji: "🔧", color: "text-amber-400" },
  { label: "Weak Days", key: "WEEK_DAYS", emoji: "📊", color: "text-purple-400" },
  { label: "Why Streak Broke", key: "WHY_STREAK_BROKE", emoji: "💔", color: "text-rose-400" },
  { label: "Weekly Summary", key: "SUMMARY", emoji: "📈", color: "text-emerald-400" },
  { label: "Full Report", key: "FULL_REPORT", emoji: "📊", color: "text-cyan-400" },
];

export default function GuidedCoachScreen() {
  const [messages, setMessages] = useState([
    {
      type: "coach",
      text: "Hey! I'm your Consistency Coach. I analyze your real journal data — todos, planners, and habits — to give you personalized insights.\n\nWhat do you want to know?",
    },
  ]);

  const [remaining, setRemaining] = useState(ALL_OPTIONS);
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, remaining]);

  async function handleQuestion(opt) {
    setRemaining((prev) => prev.filter((o) => o.key !== opt.key));
    setMessages((prev) => [...prev, { type: "user", text: opt.label }]);

    setLoading(true);

    try {
      const res = await api.get(`/coach/${opt.key}`);
      const data = res.data;

      // Format response based on question type
      const formatted = formatCoachResponse(opt.key, data);

      setMessages((prev) => [
        ...prev,
        { type: "coach", text: formatted.text, richData: formatted.richData },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { type: "coach", text: "Something went wrong. Make sure you have some journal data first!" },
      ]);
    }

    setLoading(false);
  }

  return (
    <div className="h-screen bg-zinc-900 text-white flex flex-col">

      {/* HEADER */}
      <div className="p-4 border-b border-zinc-800 bg-zinc-900/80 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <span className="text-xl">🧠</span>
          </div>
          <div>
            <h2 className="font-semibold text-zinc-100">Consistency Coach</h2>
            <p className="text-xs text-zinc-500">Powered by your real journal data</p>
          </div>
        </div>
      </div>

      {/* CHAT */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <MessageBubble key={i} m={m} />
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-zinc-400 text-sm">
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
            Analyzing your data...
          </div>
        )}

        {/* REMAINING QUESTIONS */}
        {remaining.length > 0 && !loading && (
          <div className="bg-zinc-800/60 rounded-2xl p-4 border border-zinc-700/50">
            <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium mb-3">
              Ask me about
            </p>

            <div className="flex flex-wrap gap-2">
              {remaining.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => handleQuestion(opt)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-zinc-700/60
                             hover:bg-zinc-700 rounded-full text-sm font-medium
                             text-zinc-300 hover:text-zinc-100 transition-all
                             active:scale-95 border border-zinc-600/30"
                >
                  <span>{opt.emoji}</span>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ALL DONE */}
        {remaining.length === 0 && !loading && (
          <div className="text-center py-6">
            <div className="w-12 h-12 mx-auto bg-emerald-500/10 rounded-full flex items-center justify-center mb-3">
              <span className="text-2xl">🎯</span>
            </div>
            <p className="text-emerald-400 font-medium">You're all caught up for today!</p>
            <p className="text-xs text-zinc-500 mt-1">Come back tomorrow for updated insights.</p>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>
    </div>
  );
}

/**
 * Format coach response based on question type
 */
function formatCoachResponse(questionKey, data) {
  const title = data.title || "";
  const insight = data.insight || "";
  const suggestion = data.suggestion || "";
  const message = data.message || "";

  let text = "";
  let richData = null;

  switch (questionKey) {
    case "RISK_TODAY":
      text = `${title}\n\n${insight}\n${message}`;
      if (suggestion) text += `\n\n💡 ${suggestion}`;
      if (data.stats) {
        richData = {
          type: "stats",
          items: [
            { label: "Avg Completion", value: `${data.stats.avgCompletion}%` },
            { label: "Current Streak", value: `${data.stats.currentStreak} days` },
          ],
        };
      }
      break;

    case "TASK_INSIGHTS":
      text = `${title}\n\n${insight}`;
      if (suggestion) text += `\n\n💡 ${suggestion}`;
      if (data.totalTasks) {
        richData = {
          type: "stats",
          items: [
            { label: "Total Tasks", value: `${data.totalTasks}` },
            { label: "Completed", value: `${data.completedTasks}` },
            { label: "Completion Rate", value: `${data.completionRate}%` },
            { label: "Avg/Day", value: `${data.avgTasksPerDay} tasks` },
          ],
        };
      }
      break;

    case "SUMMARY":
      text = `${title}\n\n${insight}`;
      if (suggestion) text += `\n\n💡 ${suggestion}`;
      richData = {
        type: "stats",
        items: [
          { label: "Avg Completion", value: `${data.averageCompletion}%` },
          { label: "Good Days", value: `${data.goodDays}/${data.daysTracked}` },
          { label: "Current Streak", value: `🔥 ${data.currentStreak} days` },
          { label: "Trend", value: data.trend === "improving" ? "📈 Up" : data.trend === "declining" ? "📉 Down" : "➡️ Stable" },
        ],
      };
      break;

    case "WEEK_DAYS":
      text = `${title}\n\n${insight}`;
      if (suggestion) text += `\n\n💡 ${suggestion}`;
      if (data.allDays) {
        richData = {
          type: "dayChart",
          days: data.allDays,
        };
      }
      break;

    case "WHY_STREAK_BROKE":
      text = `${title}`;
      if (data.date) text += `\n📅 Date: ${data.date}`;
      text += `\n\n${data.insight || insight}`;
      if (data.taskDetails) text += `\n${data.taskDetails}`;
      text += `\n\n${data.recovery || message}`;
      if (suggestion) text += `\n\n💡 ${suggestion}`;
      break;

    case "FULL_REPORT":
      text = `${title}\n\n📊 Generated at ${new Date(data.generatedAt).toLocaleTimeString()}`;
      text += `\n\n--- Risk Assessment ---\n${data.risk?.title || "N/A"}\n${data.risk?.insight || ""}`;
      text += `\n\n--- Task Analysis ---\n${data.tasks?.insight || "N/A"}`;
      text += `\n\n--- Weekly Summary ---\n${data.summary?.insight || "N/A"}`;
      text += `\n\n--- Adjustment Advice ---\n${data.adjustments?.message || "N/A"}\n💡 ${data.adjustments?.suggestion || ""}`;
      break;

    default:
      text = `${title}\n\n${insight}\n${message}`;
      if (suggestion) text += `\n\n💡 ${suggestion}`;
  }

  return { text, richData };
}

/**
 * Enhanced message bubble with rich data
 */
function MessageBubble({ m }) {
  const user = m.type === "user";

  return (
    <div className={`flex ${user ? "justify-end" : "justify-start"}`}>
      <div className="max-w-md space-y-3">
        <div
          className={`px-4 py-3 rounded-2xl whitespace-pre-line text-sm leading-relaxed
          ${user
              ? "bg-emerald-600 text-white rounded-br-sm"
              : "bg-zinc-800 border border-zinc-700 text-zinc-200 rounded-bl-sm"
            }`}
        >
          {m.text}
        </div>

        {/* Rich Data Cards */}
        {m.richData?.type === "stats" && (
          <div className="grid grid-cols-2 gap-2">
            {m.richData.items.map((item, i) => (
              <div
                key={i}
                className="bg-zinc-800/60 rounded-xl px-3 py-2.5 border border-zinc-700/40"
              >
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider">{item.label}</p>
                <p className="text-sm font-bold text-zinc-100 mt-0.5">{item.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Day Chart (for WEEK_DAYS) */}
        {m.richData?.type === "dayChart" && (
          <div className="bg-zinc-800/60 rounded-xl p-3 border border-zinc-700/40">
            <div className="flex items-end justify-between gap-1 h-20">
              {m.richData.days.map((day, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className={`w-full rounded-t transition-all ${day.rate >= 70
                        ? "bg-emerald-500"
                        : day.rate >= 50
                          ? "bg-amber-500"
                          : "bg-red-400"
                      }`}
                    style={{
                      height: `${Math.max(day.rate, 5)}%`,
                      minHeight: "4px",
                    }}
                  />
                  <span className="text-[9px] text-zinc-500 font-medium">
                    {day.dayName.slice(0, 3)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
