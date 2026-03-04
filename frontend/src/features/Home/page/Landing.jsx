// LandingPage.jsx
import Navbar from "../componets/Navbar";
import { Link } from "react-router-dom";
// import SectionCard from "../componets/sectionCars";
import ConsistencyEngineSection from "../componets/ConsistencyEngineSection";
import LandingBackground from "../componets/LandingBackground";
import BehavioralPanel from "../componets/BehavioralPannel";
import ExecutionCard from "../componets/ExecutationCard";
import ConsistencyProfilePanel from "../componets/ConsistencyProfile";
import ProductPreviewPanel from "../componets/ProductPreview";
import FailureSignalsSection from "../componets/FailureSignalsSection";
export default function LandingPage() {
  const chartData = [
    { day: "Mon", value: 90 },
    { day: "Tue", value: 85 },
    { day: "Wed", value: 70 },
    { day: "Thu", value: 60 },
    { day: "Fri", value: 55 },
    { day: "Sat", value: 40 },
    { day: "Sun", value: 35 }
  ];

  return (
    <div className="relative bg-zinc-950 text-zinc-100 overflow-hidden">
      <LandingBackground />
      <Navbar />
      {/* HERO */}
      <section className="relative max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-20 items-center">

        {/* Gradient spotlight */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.15),transparent_40%)]" />

        {/* LEFT */}
        <div className="relative">
          <h1 className="text-6xl font-bold leading-tight mb-6 tracking-tight">
            Your Discipline,
            <br />
            Quantified.
          </h1>

          <p className="text-zinc-400 mb-8 text-lg max-w-xl">
            AI-powered behavioral analytics that detect execution decline —
            before your streak collapses.
          </p>

          {/* Feature bullets */}
          <ul className="space-y-3 mb-10 text-zinc-300">
            <li>✔ Detect discipline decline patterns</li>
            <li>✔ Track streak stability in real time</li>
            <li>✔ Behavioral insights, not motivation quotes</li>
          </ul>

          <div className="flex gap-4 mb-6">

            <Link to="/register" className="bg-emerald-600 hover:bg-emerald-500 px-8 py-4 rounded-xl font-medium shadow-lg shadow-emerald-900/30">
              Start Free
            </Link>

            <Link to="#problem" className="border border-zinc-700 hover:border-zinc-500 px-8 py-4 rounded-xl" >See How It Works</Link>

          </div>

          <p className="text-xs text-zinc-500">
            Trusted by 12,000+ students & professionals
          </p>
        </div>

        {/* RIGHT — System UI */}
        <div className="relative">
          <BehavioralPanel data={chartData} />

          {/* Floating mini card bottom */}
          <div className="absolute -bottom-10 -left-10 bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-xl">
            <p className="text-xs text-zinc-400">Today’s Execution</p>
            <h4 className="text-2xl font-bold text-emerald-400">78%</h4>
          </div>
        </div>
      </section>


      {/* PROBLEM */}
      <section id="problem" className="max-w-7xl mx-auto px-6">
        <FailureSignalsSection></FailureSignalsSection>
      </section>

      {/* EXECUTION ENGINE */}
      <section
        id="engine"
        className="max-w-7xl mx-auto px-10 grid lg:grid-cols-2 gap-10 items-center"
      >
        <div>
          <h2 className="text-5xl font-bold mb-6">
            We Score Your Execution Daily
          </h2>

          <p className="text-zinc-400 mb-10 max-w-lg">
            Every day receives a performance score based on task completion
            percentage using a strict threshold rule.
          </p>

          <ExecutionCard />
        </div>

        <div className="relative">
          <div className="absolute -inset-10 bg-emerald-500/10 blur-3xl rounded-full" />
          <ProductPreviewPanel></ProductPreviewPanel>
        </div>
      </section>

      {/* CONSISTENCY PROFILE */}
      <section id="profile" className="max-w-7xl mx-auto px-6 py-10">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4">
            Your Consistency Profile
          </h2>

          <p className="text-zinc-400 max-w-2xl mx-auto">
            AI-generated behavioral analysis of how you execute over time —
            identifying strengths, risks, and hidden patterns.
          </p>
        </div>

        <ConsistencyProfilePanel data={chartData} />
      </section>
      {/* ENGINE PIPELINE */}
      <section id="how">
        <ConsistencyEngineSection />
      </section>

      {/* FINAL CTA */}
      <section className="border-t border-zinc-800 bg-gradient-to-r from-zinc-900 to-zinc-950">
        <div className="max-w-7xl mx-auto px-6 py-28 text-center">
          <h2 className="text-5xl font-bold mb-12">
            Stop Guessing. Start Measuring.
          </h2>

          <Link to="/register" className="bg-emerald-600 hover:bg-emerald-500 px-12 py-5 rounded-xl font-medium text-lg shadow-lg shadow-emerald-900/30"> Build Real Consistency</Link>


        </div>
      </section>
    </div>
  );
}
