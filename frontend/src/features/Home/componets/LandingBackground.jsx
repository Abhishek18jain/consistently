export default function LandingBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base */}
      <div className="absolute inset-0 bg-zinc-950" />

      {/* Radial glow */}
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-emerald-500/10 blur-[160px] rounded-full" />

      {/* Bottom glow */}
      <div className="absolute bottom-[-30%] right-0 w-[700px] h-[700px] bg-yellow-500/10 blur-[140px] rounded-full" />

    
    </div>
  );
}
