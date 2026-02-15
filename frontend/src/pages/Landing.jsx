import { Link } from "react-router-dom";
import Navbar from "../components/layouts/Navbar";
import { motion } from "framer-motion";

export default function Landing() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-semibold text-slate-900 leading-tight"
        >
          Understand why you break consistency.
        </motion.h1>

        <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto">
          ConsistIQ tracks your daily execution patterns,
          analyzes behavioral trends, and alerts you before
          your streak collapses.
        </p>

        <div className="mt-8">
          <Link
            to="/register"
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-indigo-700"
          >
            Start Tracking Consistency
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

          <FeatureCard
            title="Behavior Tracking"
            desc="Track daily execution with structured journal templates."
          />

          <FeatureCard
            title="Consistency Heatmap"
            desc="Visualize long-term execution patterns."
          />

          <FeatureCard
            title="Streak Intelligence"
            desc="Monitor streak growth and risk signals."
          />

          <FeatureCard
            title="Consistency Coach"
            desc="Receive actionable insights based on your behavior."
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white border-t border-slate-200 py-16">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-2xl font-semibold text-slate-900">
            Stop guessing. Start analyzing.
          </h2>
          <p className="mt-4 text-slate-600">
            Build disciplined execution through behavioral clarity.
          </p>

          <div className="mt-6">
            <Link
              to="/register"
              className="bg-indigo-600 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-indigo-700"
            >
              Create Your Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

/* Feature Card */
function FeatureCard({ title, desc }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
      <h3 className="text-sm font-semibold text-slate-800">
        {title}
      </h3>
      <p className="text-sm text-slate-600 mt-2">
        {desc}
      </p>
    </div>
  );
}
