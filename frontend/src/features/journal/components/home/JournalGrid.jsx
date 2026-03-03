import JournalCard from "./JournalCard";

export default function JournalGrid({ journals }) {
  /* ===== EMPTY STATE ===== */
  if (!journals.length) {
    return (
      <div className="mt-10 text-center py-16 border border-zinc-800 rounded-2xl bg-zinc-900/40">
        <p className="text-zinc-400 text-lg">
          No journals yet
        </p>

        <p className="text-zinc-600 text-sm mt-2">
          Create one from the presets above
        </p>
      </div>
    );
  }

  return (
    <section className="mt-12">

      {/* ===== SECTION HEADER ===== */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">
          Your Journals
        </h2>

        <span className="text-sm text-zinc-500">
          {journals.length} total
        </span>
      </div>

      {/* ===== GRID ===== */}
      <div
        className="
        grid
        gap-6
        sm:grid-cols-1
        md:grid-cols-2
        xl:grid-cols-3
        "
      >
        {journals.map((journal) => (
          <JournalCard key={journal._id} journal={journal} />
        ))}
      </div>
    </section>
  );
}