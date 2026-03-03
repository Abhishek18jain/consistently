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
    goNext,
    goPrevious
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
        const res =
          await templateApi.getTemplateById(
            page.createdFromTemplateId
          );

        setTemplate(res.data);

      } catch (err) {
        console.error("Template load failed:", err);
      }
    }

    loadTemplate();
  }, [page]);

  if (!page) return <div>Loading editor...</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">

      {/* 🏆 HEADER */}
      <div className="flex justify-between mb-6">

        <button onClick={goPrevious}>
          ← Previous
        </button>

        <div className="font-semibold">
          {date}
        </div>

        <button onClick={goNext}>
          Next →
        </button>
      </div>

      {/* ⭐ TEMPLATE RENDERER */}
      <TemplateRenderer
        template={template}
        page={page}
        blocks={blocks}
        setBlocks={setBlocks}
      />

      {/* SAVE STATUS */}
      <SavingIndicator isSaving={isSaving} />
    </div>
  );
}
