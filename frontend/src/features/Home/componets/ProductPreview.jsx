import DasboardImage from "../../../assests/images/ChatGPT Image Feb 17, 2026, 02_09_45 PM.png"
export default function ProductPreviewPanel() {
  return (
    <div className="relative">

      {/* Background glow */}
      <div className="absolute -inset-12 bg-emerald-500/10 blur-3xl rounded-full" />

      {/* Window */}
      <div className="relative bg-zinc-900/70 backdrop-blur border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden">

        {/* Fake window header */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800 bg-zinc-900">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <span className="ml-4 text-xs text-zinc-400">
            Consistency Coach — Dashboard
          </span>
        </div>

        {/* Dashboard image */}
        <img
          src={DasboardImage}   // <-- your uploaded dashboard
          alt="Consistency Coach Dashboard"
          className="w-full"
        />
      </div>
    </div>
  );
}
