export default function PatternInsights() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm
                    hover:shadow-md transition-shadow duration-300">

      <h3 className="text-sm font-semibold mb-4 text-gray-900 uppercase tracking-wider">
        Pattern Insights
      </h3>

      <ul className="space-y-3 text-gray-600 text-sm">
        <li className="flex items-start gap-2">
          <span className="text-blue-500 mt-0.5">●</span>
          Completion drops on Sundays
        </li>
        <li className="flex items-start gap-2">
          <span className="text-emerald-500 mt-0.5">●</span>
          Morning tasks have 82% success rate
        </li>
        <li className="flex items-start gap-2">
          <span className="text-purple-500 mt-0.5">●</span>
          Reflection days increase next-day completion
        </li>
      </ul>
    </div>
  );
}
