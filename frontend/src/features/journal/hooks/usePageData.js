import { useEffect, useState } from "react";
import { pageApi } from "../api/pageApi";

export default function usePageData({ journalId, date, navigate }) {
  const [page, setPage] = useState(null);
  const [blocks, setBlocks] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  // LOAD PAGE
  useEffect(() => {
    async function load() {
    
      console.log("journal id and date",  journalId, date)
      const res = await pageApi.getPageByDate(journalId, date);
      const data = res.data;

      setPage(data);
      setBlocks(data.contentJSON || []);

      // 🔥 ensure at least one block
      if (!data.contentJSON?.length) {
        setBlocks([
          {
            id: crypto.randomUUID(),
            type: "text",
            data: { text: "" },
          },
        ]);
      }
    }

    load();
  }, [journalId, date]);

  // AUTOSAVE
  useEffect(() => {
    if (!page) return;

    const timeout = setTimeout(async () => {
      setIsSaving(true);
      await pageApi.updatePage(page._id, blocks);
      setIsSaving(false);
    }, 800);

    return () => clearTimeout(timeout);
  }, [blocks]);

  // NAVIGATION
  const goNext = () => {
    navigate(`/journals/${journalId}/date/${getNextDate(date)}`);
  };

  const goPrevious = () => {
    navigate(`/journals/${journalId}/date/${getPrevDate(date)}`);
  };

  return {
    page,
    blocks,
    setBlocks,
    isSaving,
    goNext,
    goPrevious,
  };
}

function getNextDate(date) {
  const d = new Date(date);
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
}

function getPrevDate(date) {
  const d = new Date(date);
  d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0];
}