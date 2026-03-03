export default function TemplateSelector({
  templates,
  onSelect,
}) {
  return (
    <div className="grid grid-cols-2 gap-4 p-6">
      {templates.map((t) => (
        <button
          key={t._id}
          onClick={() => onSelect(t._id)}
          className="p-6 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-white text-left transition"
        >
          <h3 className="font-semibold">{t.name}</h3>
          <p className="text-sm text-zinc-400">
            {t.description}
          </p>
        </button>
      ))}
    </div>
  );
}