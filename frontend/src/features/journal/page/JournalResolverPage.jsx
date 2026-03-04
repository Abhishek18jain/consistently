import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { journalApi } from "../api/journal.api";
import { pageApi } from "../api/pageApi";

/**
 * JournalResolverPage
 * - No pages → go to template selection
 * - Has pages → go to the LATEST page (by date from DB)
 */
export default function JournalResolverPage() {
  const { journalId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function resolve() {
      try {
        const res = await journalApi.getJournalById(journalId);
        const journal = res.data;

        /* 🟥 No pages → Template selection */
        if (!journal.totalPages || journal.totalPages === 0) {
          navigate(`/journal/${journalId}/templates`, { replace: true });
          return;
        }

        /* 🟩 Has pages → Open latest by fetching from API */
        try {
          const latestRes = await pageApi.getLatestPage(journalId);
          const latestDate = latestRes.data?.date;
          if (latestDate) {
            navigate(`/journals/${journalId}/date/${latestDate}`, { replace: true });
            return;
          }
        } catch {
          // fallback to currentPageDate from journal object
        }

        /* Fallback: Use currentPageDate stored in journal */
        if (journal.currentPageDate) {
          navigate(`/journals/${journalId}/date/${journal.currentPageDate}`, { replace: true });
          return;
        }

        /* Final fallback → Templates */
        navigate(`/journal/${journalId}/templates`, { replace: true });
      } catch (err) {
        console.error("Resolver failed:", err);
        navigate(`/journal/${journalId}/templates`, { replace: true });
      }
    }

    resolve();
  }, [journalId, navigate]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-3 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-sm text-gray-500 font-medium">Opening journal...</p>
      </div>
    </div>
  );
}