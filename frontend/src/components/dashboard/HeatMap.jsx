export default function Heatmap({ data = [] }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
      <h3 className="text-sm font-semibold text-slate-800 mb-4">
        Monthly Consistency
      </h3>

      <div className="grid grid-cols-7 gap-2">
        {data.map((day, index) => (
          <div
            key={index}
            className="w-6 h-6 rounded-md"
            style={{
              backgroundColor:
                day.intensity === 0
                  ? "#E2E8F0"
                  : day.intensity === 1
                  ? "#A5B4FC"
                  : day.intensity === 2
                  ? "#6366F1"
                  : day.intensity === 3
                  ? "#4F46E5"
                  : "#3730A3"
            }}
          />
        ))}
      </div>
    </div>
  );
}
