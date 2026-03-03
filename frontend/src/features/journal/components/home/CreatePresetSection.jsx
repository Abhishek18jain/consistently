// features/journal/components/home/CreatePresetSection.jsx

const presets = [
  { type: "blank", label: "Blank" },
  { type: "todo", label: "Todo" },
  { type: "planner", label: "Planner" },
  { type: "travel", label: "Travel" },
];

export default function CreatePresetSection({ onPresetClick }) {
  return (
    <div>
      <h2 className="text-xl font-medium mb-4">Create New</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {presets.map((p) => (
          <button
            key={p.type}
            onClick={() => onPresetClick(p.type)}
            className="bg-zinc-800 hover:bg-zinc-700 rounded-xl p-6 text-left transition"
          >
            <p className="text-lg font-medium">{p.label}</p>
          </button>
        ))}
      </div>
    </div>
  );
}