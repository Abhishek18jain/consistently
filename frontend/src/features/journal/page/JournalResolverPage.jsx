import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { journalApi } from "../api/journal.api";

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
          navigate(
            `/journal/${journalId}/templates`,
            { replace: true }
          );
          return;
        }

        /* 🟩 Has pages → Open latest page (by date) */
        if (journal.currentPageDate) {
          navigate(
            `/journal/${journalId}/date/${journal.currentPageDate}`,
            { replace: true }
          );
          return;
        }

        /* ⚠️ Fallback → Templates */
        navigate(
          `/journal/${journalId}/templates`,
          { replace: true }
        );

      } catch (err) {
        console.error("Resolver failed:", err);
      }
    }

    resolve();
  }, [journalId, navigate]);

  return (
    <div className="p-6 text-center text-gray-500">
      Opening journal...
    </div>
  );
}