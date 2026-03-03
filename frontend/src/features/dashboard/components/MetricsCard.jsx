export default function MetricsCard({ title, value }) {
  return (
    <div className="relative rounded-xl overflow-hidden">

      {/* subtle ambient glow */}
      <div className="absolute -inset-6 bg-zinc-700/10 blur-2xl" />

      <div className="relative bg-gradient-to-b from-zinc-800/80 to-zinc-900 border border-zinc-800 rounded-xl px-6 py-5 shadow-inner">
        <p className="text-zinc-400 text-sm">{title}</p>
        <h3 className="text-3xl font-semibold mt-1">{value}</h3>
      </div>
    </div>
  );
}
