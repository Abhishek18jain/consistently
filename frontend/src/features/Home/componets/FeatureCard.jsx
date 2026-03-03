// components/FeatureCard.jsx
export default function FeatureCard({ icon: Icon, title, children, stat }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-900/20 transition">
      <Icon className="w-6 h-6 text-emerald-500 mb-4" />
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-zinc-400 text-sm leading-relaxed">{children}</p>

      <div className="mt-4 h-2 bg-zinc-800 rounded">
        <div className="h-full bg-emerald-500 rounded" style={{ width: stat }} />
      </div>
    </div>
  );
}
