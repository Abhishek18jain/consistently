export default function MetricsCard({ title, value, icon, highlight }) {
  const colors = {
    emerald: "from-emerald-50 to-emerald-100/50 text-emerald-600",
    yellow: "from-amber-50 to-amber-100/50 text-amber-600",
    blue: "from-blue-50 to-blue-100/50 text-blue-600",
    red: "from-rose-50 to-rose-100/50 text-rose-600",
  };

  const color = colors[highlight] || colors.blue;

  return (
    <div className={`bg-gradient-to-br ${color} rounded-xl px-5 py-4
                     border border-gray-200/60 shadow-sm
                     hover:shadow-md transition-all duration-300
                     hover:-translate-y-0.5`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-bold mt-1 text-gray-900">{value}</h3>
        </div>
        {icon && <span className="text-2xl opacity-80">{icon}</span>}
      </div>
    </div>
  );
}
