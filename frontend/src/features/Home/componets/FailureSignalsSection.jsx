import { AlertTriangle, TrendingDown, Brain } from "lucide-react";

function SignalCard({ icon: Icon, title, children, color }) {
  return (
    <div className="relative bg-zinc-900/80 backdrop-blur border border-zinc-800 rounded-2xl p-6 overflow-hidden">
      
      {/* Glow */}
      <div className={`absolute -inset-1 ${color} blur-2xl opacity-20`} />

      <div className="relative">
        <div className="flex items-center gap-3 mb-4">
          <Icon className="w-5 h-5 text-yellow-400" />
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>

        <p className="text-zinc-400 text-sm">{children}</p>

        {/* Signal bar */}
        <div className="mt-6 h-2 bg-zinc-800 rounded">
          <div className="h-full bg-yellow-400 rounded w-3/4" />
        </div>
      </div>
    </div>
  );
}

export default function FailureSignalsSection() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-28">
      <h2 className="text-5xl font-bold mb-4">
        Why Consistency Breaks
      </h2>

      <p className="text-zinc-400 mb-16 max-w-2xl">
        Behavioral failure signals detected across execution patterns.
      </p>

      <div className="grid md:grid-cols-3 gap-8">
        <SignalCard
          icon={AlertTriangle}
          title="Motivation Drop"
          color="bg-red-500/30"
        >
          Reliance on short-term motivation leads to sudden execution decline.
        </SignalCard>

        <SignalCard
          icon={TrendingDown}
          title="No Feedback Loop"
          color="bg-yellow-500/30"
        >
          Without objective measurement, improvement becomes guesswork.
        </SignalCard>

        <SignalCard
          icon={Brain}
          title="Untracked Patterns"
          color="bg-emerald-500/30"
        >
          Behavioral patterns remain invisible without analytics.
        </SignalCard>
      </div>
    </section>
  );
}
