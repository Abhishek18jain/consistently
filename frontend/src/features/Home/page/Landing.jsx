import Navbar from "../componets/Navbar";
import { Link } from "react-router-dom";

const FEATURES = [
  {
    icon: "🔥",
    title: "Streak Tracking",
    desc: "Automatic streak calculation based on real task completion, not arbitrary habits.",
    color: "bg-orange-50 text-orange-600",
  },
  {
    icon: "📊",
    title: "Behavioral Analytics",
    desc: "Weekly heatmaps, completion trends, and AI-powered insights into your consistency patterns.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: "📓",
    title: "Smart Templates",
    desc: "10+ journal templates — Eisenhower Matrix, Energy Planner, Time Blocking, Budget Tracker & more.",
    color: "bg-purple-50 text-purple-600",
  },
  {
    icon: "🧠",
    title: "AI Coach",
    desc: "Get personalized coaching insights based on your actual performance data, not motivation quotes.",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: "📅",
    title: "Daily Planning",
    desc: "Structured daily planners with editable schedules, priorities, notes, and reflection sections.",
    color: "bg-amber-50 text-amber-600",
  },
  {
    icon: "🎯",
    title: "Goal Tracking",
    desc: "Break goals into milestones, track progress visually, and celebrate completions.",
    color: "bg-rose-50 text-rose-600",
  },
];

const HOW_STEPS = [
  {
    step: "01",
    title: "Create a Journal",
    desc: "Choose from todo, planner, travel, or blank. Each journal is your workspace for building habits.",
    icon: "📒",
  },
  {
    step: "02",
    title: "Choose a Template",
    desc: "Pick from 10+ beautiful templates — Focus Mode Todo, Energy Planner, Time Blocking, and more.",
    icon: "🧩",
  },
  {
    step: "03",
    title: "Complete Daily Pages",
    desc: "Work through your tasks, check off items, and the system automatically calculates your daily completion.",
    icon: "✅",
  },
  {
    step: "04",
    title: "Track Your Growth",
    desc: "View your dashboard with real stats — streaks, heatmaps, per-journal progress, and AI coaching.",
    icon: "📈",
  },
];

const TEMPLATES = [
  { name: "Eisenhower Matrix", type: "Priority", color: "bg-red-50 border-red-200 text-red-700" },
  { name: "Focus Mode Todo", type: "Todo", color: "bg-blue-50 border-blue-200 text-blue-700" },
  { name: "Energy Planner", type: "Planner", color: "bg-amber-50 border-amber-200 text-amber-700" },
  { name: "Time Blocking", type: "Schedule", color: "bg-indigo-50 border-indigo-200 text-indigo-700" },
  { name: "Daily Productive", type: "Daily", color: "bg-emerald-50 border-emerald-200 text-emerald-700" },
  { name: "Budget Tracker", type: "Finance", color: "bg-purple-50 border-purple-200 text-purple-700" },
  { name: "Packing List", type: "Travel", color: "bg-teal-50 border-teal-200 text-teal-700" },
  { name: "Habit Tracker", type: "Habits", color: "bg-rose-50 border-rose-200 text-rose-700" },
];

export default function LandingPage() {
  return (
    <div className="bg-gray-50 text-gray-900 overflow-hidden">
      <Navbar />

      {/* ════════════════ HERO ════════════════ */}
      <section className="relative max-w-7xl mx-auto px-6 py-20 lg:py-28">
        {/* Soft gradient blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100/40 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-100/30 rounded-full blur-[80px]" />

        <div className="relative grid lg:grid-cols-2 gap-16 items-center">
          {/* LEFT */}
          <div>
            <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-1.5 text-xs font-bold text-gray-600 mb-6 shadow-sm">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              Used by 12,000+ students & professionals
            </div>

            <h1 className="text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight text-gray-900 mb-6">
              Build <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800">Real Consistency</span>
              <br />
              With Data, Not Motivation.
            </h1>

            <p className="text-lg text-gray-500 font-medium mb-8 max-w-xl leading-relaxed">
              A smart journal system that tracks your execution daily, calculates streaks from real task completion, and gives you AI-powered behavioral insights.
            </p>

            <div className="flex flex-wrap gap-4 mb-8">
              <Link
                to="/register"
                className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-2xl font-bold text-base transition-all active:scale-[0.97] shadow-lg shadow-gray-900/20"
              >
                Start For Free →
              </Link>
              <a
                href="#how"
                className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-4 rounded-2xl font-bold text-base transition-all"
              >
                See How It Works
              </a>
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-400 font-medium">
              <span className="flex items-center gap-1.5">✓ Free forever</span>
              <span className="flex items-center gap-1.5">✓ No credit card</span>
              <span className="flex items-center gap-1.5">✓ 10+ templates</span>
            </div>
          </div>

          {/* RIGHT — Mock Dashboard Preview */}
          <div className="relative">
            <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl shadow-gray-200/60 p-6 space-y-4">
              {/* Mini header */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Today's Progress</p>
                  <p className="text-3xl font-extrabold text-gray-900 mt-1">78%</p>
                </div>
                <div className="bg-orange-50 text-orange-600 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5">
                  🔥 12 day streak
                </div>
              </div>

              {/* Mini bar chart */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">This Week</p>
                <div className="flex items-end gap-1.5 h-16">
                  {[85, 70, 90, 60, 78, 45, 0].map((v, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                      <div
                        className={`w-full rounded-md transition-all ${i === 4 ? "bg-gray-900" : v >= 70 ? "bg-emerald-400" : v >= 40 ? "bg-amber-400" : v > 0 ? "bg-red-300" : "bg-gray-100"
                          }`}
                        style={{ height: `${Math.max(v, 5)}%` }}
                      />
                      <span className="text-[8px] font-bold text-gray-400">
                        {["M", "T", "W", "T", "F", "S", "S"][i]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mini journal items */}
              <div className="space-y-2">
                {[
                  { name: "Daily Todo", completion: 90, color: "bg-emerald-500" },
                  { name: "Workout Plan", completion: 60, color: "bg-amber-500" },
                  { name: "Study Log", completion: 100, color: "bg-emerald-500" },
                ].map((j, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-xs font-bold text-gray-700 w-24 truncate">{j.name}</span>
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${j.color}`} style={{ width: `${j.completion}%` }} />
                    </div>
                    <span className="text-[10px] font-bold text-gray-500">{j.completion}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating card */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl border border-gray-200 shadow-xl p-4 w-44">
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Consistency</p>
              <p className="text-2xl font-extrabold text-emerald-600 mt-0.5">94%</p>
              <p className="text-[10px] text-gray-400 font-medium mt-1">↑ 12% from last week</p>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════ FEATURES ════════════════ */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-gray-400 mb-3">Everything You Need</p>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight">
            Tools That Build Real Habits
          </h2>
          <p className="text-gray-500 mt-4 max-w-2xl mx-auto text-base font-medium">
            Not another to-do list. A complete behavioral tracking system that measures your consistency and helps you improve.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl border border-gray-200 p-7 shadow-sm
                         hover:shadow-lg hover:border-gray-300 hover:-translate-y-1
                         transition-all duration-300 group"
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl mb-5 ${f.color} group-hover:scale-110 transition-transform`}>
                {f.icon}
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed font-medium">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════ HOW IT WORKS ════════════════ */}
      <section id="how" className="bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-gray-400 mb-3">Simple Process</p>
            <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight">
              How It Works
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_STEPS.map((s, i) => (
              <div key={i} className="relative">
                <div className="bg-gray-50 rounded-3xl p-7 border border-gray-200 h-full hover:bg-white hover:shadow-lg hover:border-gray-300 transition-all duration-300">
                  <span className="text-4xl font-extrabold text-gray-200 absolute top-5 right-6">{s.step}</span>
                  <div className="text-3xl mb-4">{s.icon}</div>
                  <h3 className="text-base font-bold text-gray-900 mb-2">{s.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed font-medium">{s.desc}</p>
                </div>
                {i < HOW_STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 text-gray-300 text-xl font-bold">→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ TEMPLATES ════════════════ */}
      <section id="templates" className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-gray-400 mb-3">Built-In Templates</p>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight">
            10+ Beautiful Templates
          </h2>
          <p className="text-gray-500 mt-4 max-w-xl mx-auto font-medium">
            Every template feeds your streak engine — completions are tracked automatically.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {TEMPLATES.map((t, i) => (
            <div
              key={i}
              className={`rounded-2xl border p-5 ${t.color} hover:scale-[1.03] transition-transform duration-200 cursor-default`}
            >
              <p className="text-[10px] font-bold uppercase tracking-wider opacity-60 mb-1">{t.type}</p>
              <p className="text-sm font-bold">{t.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════ STATS BAR ════════════════ */}
      <section className="bg-gray-900">
        <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: "12,000+", label: "Active Users" },
            { value: "2.5M+", label: "Tasks Completed" },
            { value: "98%", label: "User Satisfaction" },
            { value: "45 Days", label: "Avg Streak" },
          ].map((s, i) => (
            <div key={i}>
              <p className="text-3xl lg:text-4xl font-extrabold text-white">{s.value}</p>
              <p className="text-sm text-gray-400 font-medium mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════ FINAL CTA ════════════════ */}
      <section className="bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-24 text-center">
          <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
            Stop Guessing.<br />Start Measuring.
          </h2>
          <p className="text-gray-500 text-lg font-medium mb-10 max-w-xl mx-auto">
            Join thousands who are building real, data-driven consistency habits.
          </p>
          <Link
            to="/register"
            className="inline-block bg-gray-900 hover:bg-gray-800 text-white px-12 py-5 rounded-2xl font-bold text-lg transition-all active:scale-95 shadow-xl shadow-gray-900/20"
          >
            Build Real Consistency →
          </Link>
          <p className="text-xs text-gray-400 font-medium mt-6">Free forever • No credit card required</p>
        </div>
      </section>

      {/* ════════════════ FOOTER ════════════════ */}
      <footer className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-900 rounded-md flex items-center justify-center">
              <span className="text-white text-[10px] font-black">C</span>
            </div>
            <span className="font-bold text-gray-700">Consistently</span>
          </div>
          <p className="font-medium">© 2026 Consistently. All rights reserved.</p>
          <div className="flex gap-6 font-medium">
            <a href="#" className="hover:text-gray-900 transition-colors">Privacy</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Terms</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
