import useOpenJournal from "../../hooks/useJournalOpen";
import useJournalStore from "../../store/journal.store";

export default function JournalCard({ journal }) {
  const { openJournal } = useOpenJournal();
  const setJournal = useJournalStore((s) => s.setJournal);

  const handleOpen = async () => {
    setJournal(journal);
    await openJournal(journal._id);
  };

  return (
    <div
      onClick={handleOpen}
      className="
      relative
      bg-gradient-to-b from-zinc-900/80 to-zinc-900
      border border-zinc-800/80
      rounded-2xl
      p-6
      cursor-pointer
      transition-all duration-300
      hover:border-zinc-700
      hover:-translate-y-1
      hover:shadow-2xl
      backdrop-blur
      "
    >
      {/* ⋮ menu */}
      <div className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300">
        ⋮
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold text-white mb-6">
        {journal.title}
      </h3>

      {/* Info */}
      <div className="space-y-1 text-sm">
        <p className="text-zinc-400">
          Pages: <span className="text-zinc-200">{journal.totalPages}</span>
        </p>

        <p className="text-zinc-500">
          Last: {journal.lastPageDate || "Never"}
        </p>
      </div>

      {/* Open Button */}
      <button
        className="
        absolute bottom-4 right-4
        bg-zinc-800 hover:bg-zinc-700
        border border-zinc-700
        text-sm
        px-4 py-1.5
        rounded-lg
        transition
        "
      >
        Open
      </button>
    </div>
  );
}