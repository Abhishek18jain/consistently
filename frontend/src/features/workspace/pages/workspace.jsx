import TopNav from "../components/TopNav";
import HeroStrip from "../components/Hero";
import MainActions from "../components/PrimaryActionCard";
import QuickStats from "../components/QuickStats";
import useWorkspaceStatus from "../hooks/useWorkspace";

export default function WorkspacePage() {
    const { status, loading } = useWorkspaceStatus();

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        Loading workspace...
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-[#0b0f14] text-zinc-200">
      <TopNav />

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-10">
        <HeroStrip status={status} />
        <MainActions status={status} />
        <QuickStats status={status} />
      </main>
    </div>
  );
}