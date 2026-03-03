import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { journalApi, templateApi } from "../api/journal.api";
import { pageApi } from "../api/pageApi";

import TemplateGrid from "../components/template/TemplateGrid";

export default function TemplateSelectionPage() {
  const { journalId } = useParams();
  const navigate = useNavigate();

  const [journal, setJournal] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTemplates() {
      try {
        const journalRes =
          await journalApi.getJournalById(journalId);

        const journalData = journalRes.data;
        setJournal(journalData);

        const templateRes =
          await templateApi.getTemplatesByType(
            journalData.journalType
          );

        setTemplates(templateRes.data);
      } catch (err) {
        console.error("Template load failed:", err);
      } finally {
        setLoading(false);
      }
    }

    loadTemplates();
  }, [journalId]);

  async function handleSelect(templateId) {
    try {
      const res =
        await pageApi.createFromTemplate(
          journalId,
          templateId
        );

      const page = res.data;

      navigate(
        `/journals/${journalId}/date/${page.date}`,
        { replace: true }
      );
    } catch (err) {
      console.error("Template selection failed:", err);
    }
  }

  /* 🧠 Loading State */
  if (loading)
    return (
      <div className="min-h-screen bg-zinc-900 text-white flex items-center justify-center">
        <div className="animate-pulse text-lg text-zinc-400">
          Loading templates...
        </div>
      </div>
    );

  if (!journal)
    return (
      <div className="min-h-screen bg-zinc-900 text-white flex items-center justify-center">
        Journal not found
      </div>
    );

  return (
    <div className="min-h-screen bg-zinc-900 text-white">

      {/* 🌌 Gradient Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-600/10 via-transparent to-transparent pointer-events-none" />

      {/* 🧠 Container */}
      <div className="relative max-w-6xl mx-auto px-6 py-16">

        {/* 🏆 Header */}
        <div className="text-center mb-14">

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Start your{" "}
            <span className="text-indigo-400">
              {journal.journalType}
            </span>{" "}
            journal
          </h1>

          <p className="text-zinc-400 mt-4 max-w-xl mx-auto">
            Choose a template to generate your first page.
            You can always change structure later.
          </p>
        </div>

        {/* 🧱 Template Grid */}
        {templates.length === 0 ? (
          <div className="text-center text-zinc-400 py-20">
            No templates available for this journal type.
          </div>
        ) : (
          <TemplateGrid
            templates={templates}
            onSelect={handleSelect}
          />
        )}

      </div>
    </div>
  );
}