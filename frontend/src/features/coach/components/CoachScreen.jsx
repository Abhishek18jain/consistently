import { useState, useRef, useEffect } from "react";
import api from "../../../services/axios";

const ALL_OPTIONS = [
  { label: "Risk Today", key: "RISK_TODAY" },
  { label: "What To Adjust", key: "WHAT_TO_ADJUST" },
  { label: "Week Days", key: "WEEK_DAYS" },
  { label: "Why Streak Broke", key: "WHY_STREAK_BROKE" },
  { label: "Weekly Summary", key: "SUMMARY" },
];

export default function GuidedCoachScreen() {
  const [messages, setMessages] = useState([
    {
      type: "coach",
      text: "What do you want help with today?",
    },
  ]);

  const [remaining, setRemaining] = useState(ALL_OPTIONS);
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, remaining]);

  async function handleQuestion(opt) {
    // remove selected from remaining
    setRemaining((prev) => prev.filter((o) => o.key !== opt.key));

    // user bubble
    setMessages((prev) => [...prev, { type: "user", text: opt.label }]);

    setLoading(true);

    try {
      const res = await api.get(`/coach/${opt.key}`);

     const text =
  res.data.message ||
  `${res.data.title || ""}\n${res.data.insight || ""}\n${res.data.suggestion || ""}`;

setMessages(prev => [
  ...prev,
  { type: "coach", text }
]);

    } catch {
      setMessages((prev) => [   
        ...prev,
        { type: "coach", text: "Something went wrong." },
      ]);
    }

    setLoading(false);
  }

  return (
    <div className="h-screen bg-zinc-950 text-white flex flex-col">

      {/* HEADER */}
      <div className="p-4 border-b border-zinc-800">
        <h2 className="font-semibold">Consistency Coach</h2>
      </div>

      {/* CHAT */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <Bubble key={i} m={m} />
        ))}

        {loading && (
          <div className="text-zinc-400 text-sm">Coach is thinking...</div>
        )}

        {/* REMAINING QUESTIONS */}
        {remaining.length > 0 && !loading && (
          <div className="bg-zinc-900 rounded-xl p-4 space-y-2">
            <p className="text-sm text-zinc-400">Available questions:</p>

            <div className="flex flex-wrap gap-2">
              {remaining.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => handleQuestion(opt)}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-full text-sm"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ALL DONE */}
        {remaining.length === 0 && (
          <div className="text-center text-emerald-400">
            You're all caught up for today 🎯
          </div>
        )}

        <div ref={chatEndRef} />
      </div>
    </div>
  );
}

function Bubble({ m }) {
  const user = m.type === "user";

  return (
    <div className={`flex ${user ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-md px-4 py-3 rounded-xl whitespace-pre-line
        ${
          user
            ? "bg-emerald-600"
            : "bg-zinc-800 border border-zinc-700"
        }`}
      >
        {m.text}
      </div>
    </div>
  );
}
