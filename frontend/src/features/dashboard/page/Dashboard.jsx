import { useEffect, useState } from "react";
import { getDashboardAnalyticsAPI } from "../dashboardApi";

import StatusCard from "../components/StatusCard";
import MetricsCard from "../components/MetricsCard";
import Heatmap from "../components/HeatMap";
import PatternInsights from "../components/InsightPannel";
import CoachInsight from "../components/CoachPreviewCard";
// import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";
import WeeklyChart from "../components/WeeklyChart";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const today = new Date().toDateString();
  const isFirstTime = data?.journals?.length === 0;

  useEffect(() => {
    async function load() {
      try {
        const analytics = await getDashboardAnalyticsAPI();
        setData(analytics);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const weeklyData = [
    { day: "Mon", value: 40 },
    { day: "Tue", value: 55 },
    { day: "Wed", value: 70 },
    { day: "Thu", value: 65 },
    { day: "Fri", value: 80 },
    { day: "Sat", value: 50 },
    { day: "Sun", value: 30 }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-500">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-sm font-medium">Loading analytics…</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center py-20 text-red-500">
        Failed to load dashboard data
      </div>
    );
  }
  if (data?.isFirstTimeUser) {
    return (
      <div className="flex items-center justify-center py-20 p-6">
        <div className="max-w-xl w-full bg-white border border-gray-200 rounded-2xl p-10 text-center space-y-6 shadow-sm">

          <h1 className="text-3xl font-semibold text-gray-900">
            Welcome 👋
          </h1>

          <p className="text-gray-500">
            Let’s create your first journal workspace to start tracking your consistency.
          </p>

          <div className="space-y-4">

            <button className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-lg font-medium">
              Create Your First Journal
            </button>

            <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg">
              Explore Workspace
            </button>

          </div>

        </div>
      </div>
    );
  }
  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Good Evening</h1>
        <p className="text-gray-500 text-sm">{today}</p>
      </div>

      {/* STATUS */}
      <StatusCard data={data} />

      {/* METRICS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricsCard
          title="Current Streak"
          value={data?.streak?.current ?? 0}
          icon="🔥"
          highlight="emerald"
        />

        <MetricsCard
          title="Best Streak"
          value={data?.streak?.best ?? 0}
          icon="🏆"
          highlight="yellow"
        />

        <MetricsCard
          title="Avg Completion"
          value={`${data?.averageCompletion ?? 0}%`}
          icon="📊"
          highlight="blue"
        />
        <MetricsCard
          title="Consistency"
          value={`${data?.averageCompletion ?? 0}%`}
          icon="🧠"
          highlight="red"
        />

      </div>

      {/* ANALYTICS */}
      <div className="relative rounded-2xl overflow-hidden">

        <div className="relative bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">

          {/* Section header */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-semibold">
              Behavioral Analytics
            </h2>

            <p className="text-sm text-gray-500">
              Last 30 Days
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-10">

            <Heatmap heatmap={data?.heatmap ?? []} />

            <WeeklyChart data={weeklyData} />

          </div>

        </div>
      </div>


      {/* INSIGHTS */}
      <div className="grid lg:grid-cols-2 gap-6">
        <PatternInsights />
        <CoachInsight />
      </div>
    </div>
  );
}
