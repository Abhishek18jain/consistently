import HeroStrip from "../components/Hero";
import MainActions from "../components/PrimaryActionCard";
import QuickStats from "../components/QuickStats";
import useWorkspaceStatus from "../hooks/useWorkspace";

export default function WorkspacePage() {
  const { status, loading } = useWorkspaceStatus();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-500">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-sm font-medium">Loading workspace…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <HeroStrip status={status} />
      <MainActions status={status} />
      <QuickStats status={status} />
    </div>
  );
}