import { useEffect, useState, useCallback, useRef } from "react";
import { pageApi } from "../api/pageApi";

export default function usePageData({ journalId, date, navigate }) {
  const [page, setPage] = useState(null);
  const [blocks, setBlocks] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [completion, setCompletion] = useState(null);
  const [streak, setStreak] = useState(null);
  const blocksRef = useRef(blocks);

  // Keep ref in sync
  useEffect(() => {
    blocksRef.current = blocks;
  }, [blocks]);

  // LOAD PAGE
  useEffect(() => {
    async function load() {
      console.log("journal id and date", journalId, date);
      const res = await pageApi.getPageByDate(journalId, date);
      const data = res.data;

      setPage(data);
      setBlocks(data.contentJSON || []);

      // If page comes with completion data (from a previous save), store it
      if (data.completion) {
        setCompletion(data.completion);
      }

      // ensure at least one block
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

  // MANUAL SAVE
  const save = useCallback(async () => {
    if (!page) return;
    setIsSaving(true);
    try {
      const res = await pageApi.updatePage(page._id, blocksRef.current);
      const data = res.data;

      // Update completion + streak from save response
      if (data.completion) {
        setCompletion(data.completion);
      }
      if (data.streak) {
        setStreak(data.streak);
      }
    } catch (err) {
      console.error("Save failed:", err);
    }
    setIsSaving(false);
  }, [page]);

  // AUTOSAVE (debounced)
  useEffect(() => {
    if (!page) return;

    const timeout = setTimeout(async () => {
      setIsSaving(true);
      try {
        const res = await pageApi.updatePage(page._id, blocks);
        const data = res.data;

        if (data.completion) {
          setCompletion(data.completion);
        }
        if (data.streak) {
          setStreak(data.streak);
        }
      } catch (err) {
        console.error("Autosave failed:", err);
      }
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
    save,
    goNext,
    goPrevious,
    completion,
    streak,
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