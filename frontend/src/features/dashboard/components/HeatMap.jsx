export default function Heatmap({ heatmap }) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Monthly Activity
      </h3>

      {/* Weekday labels */}
      <div className="flex gap-2 text-xs text-gray-400 font-medium mb-2">
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sat</span>
        <span>Sun</span>
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {heatmap.map((day, i) => {
          let bg = "bg-gray-100";

          if (day.intensity === 1) bg = "bg-emerald-200";
          if (day.intensity === 2) bg = "bg-emerald-400";
          if (day.intensity === 3) bg = "bg-emerald-500";

          return (
            <div
              key={i}
              className={`w-5 h-5 rounded-md ${bg} hover:scale-125 transition-all duration-200 cursor-pointer`}
              title={`${day.date} - ${day.completion || 0}%`}
            />
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 mt-4 text-xs text-gray-400">
        <span>Less</span>
        <div className="w-4 h-4 bg-gray-100 rounded" />
        <div className="w-4 h-4 bg-emerald-200 rounded" />
        <div className="w-4 h-4 bg-emerald-400 rounded" />
        <div className="w-4 h-4 bg-emerald-500 rounded" />
        <span>More</span>
      </div>
    </div>
  );
}
