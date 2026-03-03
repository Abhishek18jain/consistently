export default function TopNav() {
  return (
    <header className="border-b border-zinc-800 bg-[#0b0f14]/70 backdrop-blur">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        <div className="flex items-center gap-10">
          <h1 className="font-semibold text-lg">Consistency Coach</h1>

          <nav className="flex gap-6 text-sm text-zinc-400">
            <button className="text-white">Dashboard</button>
            <button>Coach</button>
            <button>Journals</button>
            <button>Help</button>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <button className="text-zinc-400">Log out</button>

          <button className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-lg font-medium">
            Get Back to Work
          </button>
        </div>
      </div>
    </header>
  );
}