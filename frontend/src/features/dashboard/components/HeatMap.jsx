export default function Heatmap({ heatmap }) {
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">
        Monthly Activity
      </h3>

      {/* Weekday labels */}
      <div className="flex gap-2 text-xs text-zinc-500 mb-2">
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sat</span>
        <span>Sun</span>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {heatmap.map((day, i) => {
          let bg = "bg-zinc-800";

          if (day.intensity === 1) bg = "bg-emerald-900";
          if (day.intensity === 2) bg = "bg-emerald-700";
          if (day.intensity === 3) bg = "bg-emerald-500";

          return (
            <div
              key={i}
              className={`w-5 h-5 rounded ${bg} hover:scale-110 transition`}
              title={`${day.date} - ${day.completion || 0}%`}
            />
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 mt-4 text-xs text-zinc-400">
        <span>Less</span>
        <div className="w-4 h-4 bg-zinc-800 rounded" />
        <div className="w-4 h-4 bg-emerald-900 rounded" />
        <div className="w-4 h-4 bg-emerald-700 rounded" />
        <div className="w-4 h-4 bg-emerald-500 rounded" />
        <span>More</span>
      </div>
    </div>
  );
}
