export default function PatternInsights() {
  return (
    <div className="relative rounded-2xl overflow-hidden">

      {/* subtle background */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 to-zinc-950" />

      <div className="relative border border-zinc-800 rounded-2xl p-6">

        <h3 className="text-sm font-semibold mb-4 text-zinc-200">
          Pattern Insights
        </h3>

        <ul className="space-y-2 text-zinc-300 text-sm">
          <li>• Completion drops on Sundays</li>
          <li>• Morning tasks have 82% success rate</li>
          <li>• Reflection days increase next-day completion</li>
        </ul>

      </div>
    </div>
  );
}
