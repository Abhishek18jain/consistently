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
        const journalRes = await journalApi.getJournalById(journalId);
        const journalData = journalRes.data;
        setJournal(journalData);

        const templateRes = await templateApi.getTemplatesByType(
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
      const res = await pageApi.createFromTemplate(journalId, templateId);
      const page = res.data;
      navigate(
        `/journals/${journalId}/date/${page.date}`,
        { replace: true }
      );
    } catch (err) {
      console.error("Template selection failed:", err);
    }
  }

  if (loading)
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-sm text-gray-500 font-medium">Loading templates…</p>
        </div>
      </div>
    );

  if (!journal)
    return (
      <div className="flex items-center justify-center py-20 text-gray-500">
        Journal not found
      </div>
    );

  return (
    <div>
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
          Start your{" "}
          <span className="text-blue-600">
            {journal.journalType}
          </span>{" "}
          journal
        </h1>

        <p className="text-gray-500 mt-3 max-w-xl mx-auto">
          Choose a template to generate your first page.
          You can always change structure later.
        </p>
      </div>

      {/* Template Grid */}
      {templates.length === 0 ? (
        <div className="text-center text-gray-400 py-20 bg-white rounded-2xl
                        border border-gray-200 shadow-sm">
          <span className="text-3xl mb-2 block">📄</span>
          No templates available for this journal type.
        </div>
      ) : (
        <TemplateGrid
          templates={templates}
          onSelect={handleSelect}
        />
      )}
    </div>
  );
}