import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import usePageData from "../hooks/usePageData";
import { templateApi, journalApi } from "../api/journal.api";
import { pageApi } from "../api/pageApi";

import SavingIndicator from "../components/editor/SaveIndicator";
import TemplateRenderer from "../components/editor/layouts/TemplateRenderer";

export default function JournalEditorPage() {
  const { journalId, date } = useParams();
  const navigate = useNavigate();

  const {
    page,
    blocks,
    setBlocks,
    isSaving,
    save,
    goNext,
    goPrevious,
    completion,
    streak,
  } = usePageData({ journalId, date, navigate });

  const [template, setTemplate] = useState(null);
  const [showNewPageModal, setShowNewPageModal] = useState(false);
  const [availableTemplates, setAvailableTemplates] = useState([]);
  const [creatingPage, setCreatingPage] = useState(false);
  const [journalType, setJournalType] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDeletePage = async () => {
    if (!page?._id) return;
    try {
      await pageApi.deletePage(page._id);
      navigate(`/journals/${journalId}/open`);
    } catch (err) {
      console.error("Delete page failed:", err);
    }
  };

  // Load current page's template
  useEffect(() => {
    async function loadTemplate() {
      if (!page?.createdFromTemplateId) return;
      try {
        const res = await templateApi.getTemplateById(page.createdFromTemplateId);
        setTemplate(res.data);
      } catch (err) {
        console.error("Template load failed:", err);
      }
    }
    loadTemplate();
  }, [page]);

  // Load journal info + templates when "Add New Page" is clicked
  const openNewPageModal = async () => {
    setShowNewPageModal(true);
    if (availableTemplates.length === 0) {
      try {
        const journalRes = await journalApi.getJournalById(journalId);
        const type = journalRes.data.journalType;
        setJournalType(type);
        const templateRes = await templateApi.getTemplatesByType(type);
        setAvailableTemplates(templateRes.data);
      } catch (err) {
        console.error("Failed to load templates:", err);
      }
    }
  };

  // Create next page with a template
  const createNewPage = async (templateId) => {
    setCreatingPage(true);
    try {
      const res = await pageApi.createFromTemplate(journalId, templateId);
      const newPage = res.data;
      setShowNewPageModal(false);
      navigate(`/journals/${journalId}/date/${newPage.date}`);
    } catch (err) {
      console.error("Create page failed:", err);
    }
    setCreatingPage(false);
  };

  // Use same template as current page
  const useSameTemplate = async () => {
    if (!page?.createdFromTemplateId) return;
    await createNewPage(page.createdFromTemplateId);
  };

  if (!page)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-sm text-gray-500 font-medium">Loading editor…</p>
        </div>
      </div>
    );

  const showCompletion = completion && !completion.excluded;

  return (
    <div className="min-h-screen bg-gray-100 pb-24">

      {/* ── HEADER BAR ── */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200/60">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">

          {/* ← Previous */}
          <button
            onClick={goPrevious}
            className="w-9 h-9 rounded-full flex items-center justify-center
                       text-gray-400 hover:bg-gray-100 active:scale-90
                       transition-all duration-200"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          {/* Date + Completion Badge */}
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-900">
              {formatDate(date)}
            </p>
            {showCompletion && (
              <div className="flex items-center justify-center gap-1.5 mt-0.5">
                <div className="w-14 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${completion.completion >= 70
                      ? "bg-emerald-500"
                      : completion.completion >= 50
                        ? "bg-amber-500"
                        : "bg-red-400"
                      }`}
                    style={{ width: `${completion.completion}%` }}
                  />
                </div>
                <span className={`text-[10px] font-bold tabular-nums ${completion.completion >= 70
                  ? "text-emerald-600"
                  : completion.completion >= 50
                    ? "text-amber-600"
                    : "text-red-500"
                  }`}>
                  {completion.completion}%
                </span>
              </div>
            )}
          </div>

          {/* Right side: Add page + Next + Menu */}
          <div className="flex items-center gap-1 relative">
            <button
              onClick={openNewPageModal}
              title="Add new page"
              className="w-9 h-9 rounded-full flex items-center justify-center
                         text-blue-500 hover:bg-blue-50 active:scale-90
                         transition-all duration-200 text-xl font-medium"
            >
              +
            </button>
            <button
              onClick={goNext}
              className="w-9 h-9 rounded-full flex items-center justify-center
                         text-gray-400 hover:bg-gray-100 active:scale-90
                         transition-all duration-200"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>

            {/* ⋮ Menu */}
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 active:scale-90 transition-all"
            >
              ⋮
            </button>
            {showMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 top-11 z-50 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden w-48">
                  <button
                    onClick={() => { setShowMenu(false); navigate("/journals"); }}
                    className="w-full text-left px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <span>📚</span> Back to Journals
                  </button>
                  <div className="border-t border-gray-100" />
                  <button
                    onClick={() => { setShowMenu(false); setConfirmDelete(true); }}
                    className="w-full text-left px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-50 flex items-center gap-2"
                  >
                    <span>🗑️</span> Delete This Page
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── DELETE CONFIRMATION ── */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setConfirmDelete(false)}>
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="text-4xl mb-3">🗑️</div>
            <h3 className="text-lg font-extrabold text-gray-900 mb-1">Delete this page?</h3>
            <p className="text-sm text-gray-500 mb-6">This action cannot be undone. The page and its data will be permanently removed.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(false)}
                className="flex-1 py-3 rounded-2xl bg-gray-100 text-gray-600 font-bold text-sm hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeletePage}
                className="flex-1 py-3 rounded-2xl bg-red-500 text-white font-bold text-sm hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── STREAK BANNER ── */}
      {streak && streak.status === "success" && streak.currentStreak > 0 && (
        <div className="max-w-2xl mx-auto px-4 mt-3">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5
                          flex items-center justify-between">
            <span className="text-sm font-medium text-emerald-600">
              🔥 {streak.currentStreak} Day Streak
            </span>
            {streak.bestStreak && streak.currentStreak === streak.bestStreak && (
              <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                🏆 Personal Best!
              </span>
            )}
          </div>
        </div>
      )}


      {/* ── CONTENT ── */}
      <div className="max-w-2xl mx-auto px-4 py-4">
        <TemplateRenderer
          template={template}
          page={page}
          blocks={blocks}
          setBlocks={setBlocks}
        />
      </div>

      {/* ── SAVE BUTTON ── */}
      <SavingIndicator isSaving={isSaving} onSave={save} />

      {/* ── ADD NEW PAGE MODAL ── */}
      {showNewPageModal && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-4"
          onClick={() => setShowNewPageModal(false)}
        >
          <div
            className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 pb-2">
              <h2 className="text-lg font-extrabold text-gray-900 mb-1">Add New Page</h2>
              <p className="text-sm text-gray-500">Choose a template for the new page</p>
            </div>

            {/* Quick option: Same as current */}
            {page?.createdFromTemplateId && (
              <div className="px-6 py-3">
                <button
                  onClick={useSameTemplate}
                  disabled={creatingPage}
                  className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-blue-50 border-2 border-blue-200 hover:bg-blue-100 transition-colors text-left"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center font-bold text-lg">
                    📄
                  </div>
                  <div>
                    <p className="text-sm font-bold text-blue-700">Same as this page</p>
                    <p className="text-xs text-blue-500">{template?.name || "Current template"}</p>
                  </div>
                </button>
              </div>
            )}

            <div className="px-6 pb-4">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 mt-2">
                All Templates
              </p>
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {availableTemplates.length === 0 ? (
                  <div className="flex items-center justify-center py-6">
                    <div className="w-5 h-5 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
                  </div>
                ) : (
                  availableTemplates.map((tmpl) => (
                    <button
                      key={tmpl._id}
                      onClick={() => createNewPage(tmpl._id)}
                      disabled={creatingPage}
                      className="w-full flex items-center gap-3 p-3 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors text-left group"
                    >
                      <div className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-xl shadow-sm group-hover:border-blue-200 transition-colors">
                        📋
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-800 truncate">{tmpl.name}</p>
                        <p className="text-xs text-gray-400 truncate">{tmpl.description}</p>
                      </div>
                      <span className="text-gray-300 group-hover:text-blue-400 transition-colors">›</span>
                    </button>
                  ))
                )}
              </div>
            </div>

            <div className="px-6 pb-6">
              <button
                onClick={() => setShowNewPageModal(false)}
                className="w-full py-3 rounded-2xl bg-gray-100 text-gray-600 font-bold text-sm hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function formatDate(dateStr) {
  try {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}
