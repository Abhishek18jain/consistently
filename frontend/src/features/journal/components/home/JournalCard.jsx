import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useOpenJournal from "../../hooks/useJournalOpen";
import useJournalStore from "../../store/journal.store";
import { journalApi } from "../../api/journal.api";

const JOURNAL_ICONS = {
  todo: "✅",
  planner: "📋",
  travel: "✈️",
  blank: "📄",
};

export default function JournalCard({ journal, onDelete }) {
  const { openJournal } = useOpenJournal();
  const setJournal = useJournalStore((s) => s.setJournal);
  const navigate = useNavigate();

  const [showMenu, setShowMenu] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleOpen = async (e) => {
    if (showMenu || confirmDelete) return;
    setJournal(journal);
    await openJournal(journal._id);
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await journalApi.archiveJournal(journal._id);
      onDelete?.(journal._id);
    } catch (err) {
      console.error("Delete failed:", err);
    }
    setDeleting(false);
    setConfirmDelete(false);
  };

  const icon = JOURNAL_ICONS[journal.journalType] || "📒";
  const lastDate = journal.lastPageDate
    ? new Date(journal.lastPageDate + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : null;

  return (
    <div
      className="relative bg-white border border-gray-200 rounded-2xl p-5 cursor-pointer
                 transition-all duration-300 hover:border-blue-200 hover:-translate-y-0.5
                 hover:shadow-lg active:scale-[0.98] select-none"
    >
      {/* ⋮ Menu Button */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); setConfirmDelete(false); }}
          className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all"
        >
          ⋮
        </button>

        {showMenu && (
          <div className="absolute right-0 top-9 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden w-44 z-20">
            <button
              onClick={(e) => { e.stopPropagation(); setJournal(journal); openJournal(journal._id); setShowMenu(false); }}
              className="w-full text-left px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              <span>📖</span> Open Journal
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/journal/${journal._id}/templates`);
                setShowMenu(false);
              }}
              className="w-full text-left px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              <span>📄</span> Change Template
            </button>
            <div className="border-t border-gray-100" />
            <button
              onClick={(e) => { e.stopPropagation(); setConfirmDelete(true); setShowMenu(false); }}
              className="w-full text-left px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-50 flex items-center gap-2"
            >
              <span>🗑️</span> Delete Journal
            </button>
          </div>
        )}
      </div>

      {/* Backdrop to close menu */}
      {showMenu && (
        <div className="fixed inset-0 z-10" onClick={(e) => { e.stopPropagation(); setShowMenu(false); }} />
      )}

      {/* Delete Confirmation */}
      {confirmDelete && (
        <div
          className="absolute inset-0 bg-white/95 rounded-2xl flex flex-col items-center justify-center gap-3 z-20 backdrop-blur-sm"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="text-sm font-bold text-gray-800">Delete this journal?</p>
          <p className="text-xs text-gray-400 text-center px-4">This will archive it. You can't undo this.</p>
          <div className="flex gap-2 mt-1">
            <button
              onClick={(e) => { e.stopPropagation(); setConfirmDelete(false); }}
              className="px-4 py-2 rounded-xl bg-gray-100 text-gray-600 text-xs font-bold hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleDelete(); }}
              disabled={deleting}
              className="px-4 py-2 rounded-xl bg-red-500 text-white text-xs font-bold hover:bg-red-600 transition-colors disabled:opacity-60"
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      )}

      {/* Card Content */}
      <div onClick={handleOpen}>
        {/* Icon + Type */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-xl shadow-sm">
            {icon}
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
            {journal.journalType}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-gray-900 mb-3 pr-8">{journal.title}</h3>

        {/* Meta */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <p className="text-xs font-medium text-gray-500">
              <span className="font-bold text-gray-700">{journal.totalPages}</span> page{journal.totalPages !== 1 ? "s" : ""}
            </p>
            {lastDate && (
              <p className="text-[10px] text-gray-400">Last: {lastDate}</p>
            )}
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); setJournal(journal); openJournal(journal._id); }}
            className="bg-gray-900 hover:bg-gray-800 text-white text-xs px-4 py-2 rounded-xl font-bold transition-all duration-200 active:scale-95"
          >
            Open →
          </button>
        </div>
      </div>
    </div>
  );
}