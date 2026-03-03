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

  /* ⭐ LOAD TEMPLATE AFTER PAGE LOADS */
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
      <div className="min-h-screen flex items-center justify-center bg-zinc-900">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-zinc-700 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-sm text-zinc-400 font-medium">Loading editor…</p>
        </div>
      </div>
    );

  const showCompletion = completion && !completion.excluded;

  return (
    <div className="min-h-screen bg-zinc-900 pb-24">

      {/* ── HEADER BAR ── */}
      <div className="sticky top-0 z-40 bg-zinc-900/80 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">

          {/* ← Previous */}
          <button
            onClick={goPrevious}
            className="w-9 h-9 rounded-full flex items-center justify-center
                       text-zinc-400 hover:bg-zinc-800 active:scale-95
                       transition-all"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          {/* Date + Completion Badge */}
          <div className="text-center">
            <p className="text-sm font-semibold text-zinc-100">
              {formatDate(date)}
            </p>
            {showCompletion && (
              <div className="flex items-center justify-center gap-1.5 mt-0.5">
                <div className="w-14 h-1.5 bg-zinc-700 rounded-full overflow-hidden">
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
                    ? "text-emerald-400"
                    : completion.completion >= 50
                      ? "text-amber-400"
                      : "text-red-400"
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
                       text-zinc-400 hover:bg-zinc-800 active:scale-95
                       transition-all"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── STREAK BANNER (after saving with streak data) ── */}
      {streak && streak.status === "success" && streak.currentStreak > 0 && (
        <div className="max-w-2xl mx-auto px-4 mt-3">
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-2.5 flex items-center justify-between">
            <span className="text-sm font-medium text-emerald-400">
              🔥 {streak.currentStreak} Day Streak
            </span>
            {streak.bestStreak && streak.currentStreak === streak.bestStreak && (
              <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
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

      {/* ── SAVE BUTTON (bottom center) ── */}
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
