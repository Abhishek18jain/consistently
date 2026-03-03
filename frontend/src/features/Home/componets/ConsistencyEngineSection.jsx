// ConsistencyEngineSection.jsx
import { CheckCircle2, Activity, ShieldAlert, Brain } from "lucide-react";

function StepModule({ step, title, icon: Icon, color, children }) {
  return (
    <div className="relative bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex-1 min-w-[240px]">
      {/* Glow */}
      <div
        className={`absolute -inset-px rounded-xl opacity-0 hover:opacity-100 transition ${color} blur`}
      />

      <div className="relative">
        <div className="flex items-center gap-3 mb-4">
          <Icon className="w-5 h-5 text-emerald-400" />
          <span className="text-xs text-emerald-400 tracking-wider">
            STEP {step}
          </span>
        </div>

        <h3 className="text-lg font-semibold mb-3">{title}</h3>

        <div className="text-sm text-zinc-400 space-y-2">{children}</div>
      </div>
    </div>
  );
}

export default function ConsistencyEngineSection() {
  return (
    <section className="bg-zinc-950 py-28">
      <div className="max-w-7xl mx-auto px-6">
        {/* Title */}
        <h2 className="text-4xl font-bold mb-4">
          Inside the Consistency Engine
        </h2>
        <p className="text-zinc-400 mb-16 max-w-2xl">
          Your daily actions flow through a structured pipeline that converts
          raw execution into behavioral insights.
        </p>

        {/* Pipeline */}
        <div className="relative">
          {/* Connector Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />

          <div className="flex flex-col lg:flex-row gap-6">
            {/* STEP 1 */}
            <StepModule
              step="1"
              title="Structure Input"
              icon={CheckCircle2}
              color="bg-emerald-500/20"
            >
              <p>Tasks Defined: <b>10</b></p>
              <p>Categories: Health, Work, Study</p>
              <p>Priority Levels Set</p>
            </StepModule>

            {/* STEP 2 */}
            <StepModule
              step="2"
              title="Execution Tracking"
              icon={Activity}
              color="bg-blue-500/20"
            >
              <p>Completed: <b>7 / 10</b></p>
              <p>Execution Score: <b className="text-emerald-400">70%</b></p>
              <p>Real-time updates</p>
            </StepModule>

            {/* STEP 3 */}
            <StepModule
              step="3"
              title="Threshold Engine"
              icon={ShieldAlert}
              color="bg-yellow-500/20"
            >
              <p>Threshold Rule: ≥ 70%</p>
              <p>Streak: Maintained</p>
              <p>Recovery Mode Enabled</p>
            </StepModule>

            {/* STEP 4 */}
            <StepModule
              step="4"
              title="Behavioral Analysis"
              icon={Brain}
              color="bg-red-500/20"
            >
              <p>Pattern: Weekend Drop</p>
              <p>Risk Level: Warning</p>
              <p>Consistency Score: 64</p>
            </StepModule>
          </div>
        </div>
      </div>
    </section>
  );
}
