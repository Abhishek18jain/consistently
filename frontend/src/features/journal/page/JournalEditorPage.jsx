import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import usePageData from "../hooks/usePageData";
import { templateApi } from "../api/journal.api";

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
  } = usePageData({
    journalId,
    date,
    navigate,
  });

  const [template, setTemplate] = useState(null);

  useEffect(() => {
    async function loadTemplate() {
      if (!page?.createdFromTemplateId) return;
      try {
        const res = await templateApi.getTemplateById(
          page.createdFromTemplateId
        );
        setTemplate(res.data);
      } catch (err) {
        console.error("Template load failed:", err);
      }
    }
    loadTemplate();
  }, [page]);

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

          {/* Next → */}
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
        </div>
      </div>

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
