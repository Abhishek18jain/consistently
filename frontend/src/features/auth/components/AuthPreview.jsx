import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";

export default function AuthPreview() {
  return (
    <div className="space-y-6">

      {/* HEATMAP */}
      <div className="bg-[#020617] p-5 rounded-xl border border-white/10">
        <h3 className="text-lg font-semibold mb-3">
          Your Consistency
        </h3>

        <CalendarHeatmap
          startDate={new Date("2025-01-01")}
          endDate={new Date("2025-03-01")}
          values={[
            { date: "2025-01-05", count: 2 },
            { date: "2025-01-10", count: 4 },
            { date: "2025-02-01", count: 1 },
            { date: "2025-02-12", count: 3 },
          ]}
        />
      </div>

      {/* STREAK CARD */}
      <div className="bg-[#020617] p-5 rounded-xl border border-white/10">
        <h3 className="text-lg font-semibold mb-2">
          Current Streak
        </h3>

        <p className="text-4xl font-bold text-emerald-400">
          12 Days 🔥
        </p>
      </div>

    </div>
  );
}
