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
        relative bg-white border border-gray-200
        rounded-2xl p-6 cursor-pointer
        transition-all duration-300
        hover:border-blue-200 hover:-translate-y-1
        hover:shadow-lg active:scale-[0.98]
      "
    >
      {/* ⋮ menu */}
      <div className="absolute top-4 right-4 text-gray-300 hover:text-gray-500
                      transition-colors cursor-pointer">
        ⋮
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-900 mb-5">
        {journal.title}
      </h3>

      {/* Info */}
      <div className="space-y-1 text-sm">
        <p className="text-gray-500">
          Pages: <span className="text-gray-900 font-medium">{journal.totalPages}</span>
        </p>
        <p className="text-gray-400">
          Last: {journal.lastPageDate || "Never"}
        </p>
      </div>

      {/* Open Button */}
      <button
        className="
          absolute bottom-4 right-4
          bg-gray-900 hover:bg-gray-800 text-white
          text-sm px-4 py-1.5 rounded-lg
          font-medium transition-all duration-200
          active:scale-95
        "
      >
        Open
      </button>
    </div>
  );
}