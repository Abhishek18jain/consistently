// features/journal/components/home/CreatePresetSection.jsx

const presets = [
  { type: "blank", label: "Blank", emoji: "📝", color: "from-gray-50 to-gray-100" },
  { type: "todo", label: "Todo", emoji: "✅", color: "from-blue-50 to-blue-100/50" },
  { type: "planner", label: "Planner", emoji: "📅", color: "from-purple-50 to-purple-100/50" },
  { type: "travel", label: "Travel", emoji: "✈️", color: "from-amber-50 to-amber-100/50" },
  { type: "coder", label: "Coder", emoji: "💻", color: "from-emerald-50 to-emerald-100/50" },
];

export default function CreatePresetSection({ onPresetClick }) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Create New</h2>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {presets.map((p) => (
          <button
            key={p.type}
            onClick={() => onPresetClick(p.type)}
            className={`bg-gradient-to-br ${p.color} border border-gray-200
                        rounded-2xl p-6 text-left
                        transition-all duration-300
                        hover:shadow-md hover:-translate-y-0.5
                        active:scale-[0.98]`}
          >
            <span className="text-2xl mb-2 block">{p.emoji}</span>
            <p className="text-sm font-semibold text-gray-900">{p.label}</p>
          </button>
        ))}
      </div>
    </div>
  );
}