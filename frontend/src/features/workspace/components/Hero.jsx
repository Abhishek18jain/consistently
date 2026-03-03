export default function HeroStrip({status}) {
    const {
    mode,
    completionToday,
    streak,
    risk,
    hoursLeftToday
  } = status;
  const message = {
    no_pages: "You haven’t written today.",
    active: "You're building momentum."
  };

  const riskColor = {
    safe: "text-emerald-400",
    warning: "text-yellow-400",
    danger: "text-red-400"
  };
  return (
    <div className="relative rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-800 p-10 shadow-2xl overflow-hidden">

      {/* Glow background */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 blur-3xl rounded-full" />

      <div className="flex items-start justify-between">

        {/* LEFT TEXT */}
        <div>
          <h2 className="text-4xl font-bold mb-2">
            Good Evening, Abhi
          </h2>

          <p className="text-zinc-400">
               {message[mode]}
          </p>
           {/* 🔥 URGENCY LINE */}
        {risk === "danger" && (
          <p className="text-red-400 mt-3 font-medium">
            ⚠️ {hoursLeftToday} hours left to save your streak
          </p>
        )}
        </div>

        {/* FLOATING STREAK CARD */}
        <div className="bg-zinc-900/80 backdrop-blur border border-zinc-700 rounded-2xl p-5 w-64 shadow-xl">

          <p className="font-semibold text-lg mb-2">
           🔥 {streak} Day Streak
          </p>

          <div className="text-sm text-zinc-400 space-y-1">
               <p>● {completionToday}% Complete</p>
            
          <p className={riskColor[risk]}>
            ✓ Risk: {risk}
          </p>
          </div>

        </div>

      </div>
    </div>
  );
}