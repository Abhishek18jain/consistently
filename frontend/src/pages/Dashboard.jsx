import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardAnalytics } from "../features/analytics/analytics.slice";

import MainLayout from "../components/layouts/MainLayout";
import RiskCard from "../components/dashboard/RiskCard";
import Heatmap from "../components/dashboard/HeatMap";
import CoachPanel from "../components/dashboard/CoachPanel";

export default function Dashboard() {
  const dispatch = useDispatch();
  const { streak, heatmap, averageCompletion, loading } =
    useSelector((state) => state.analytics);

  useEffect(() => {
    dispatch(fetchDashboardAnalytics());
  }, [dispatch]);

  if (loading) {
    return (
      <MainLayout>
        <p className="text-slate-600">Loading dashboard...</p>
      </MainLayout>
    );
  }

  // Basic risk logic (frontend derived)
  const risk =
    averageCompletion < 50
      ? "critical"
      : averageCompletion < 70
      ? "warning"
      : "safe";

  return (
    <MainLayout>
      <div className="space-y-8">

        <RiskCard
          risk={risk}
          completion={averageCompletion}
          streak={streak?.current || 0}
          message="Consistency analysis based on recent behavior."
        />

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Heatmap data={heatmap} />
          </div>

          <CoachPanel insight="Detailed behavior insight coming next." />
        </div>

      </div>
    </MainLayout>
  );
}
