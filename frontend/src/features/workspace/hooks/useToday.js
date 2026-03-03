// hooks/useTodayPage.js

import { useEffect, useState } from "react";
import { getTodayPageAPI } from "../api/Workspace.api";

export default function useTodayPage(bookId) {
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!bookId) return;

    async function fetchPage() {
      try {
        const { data } = await getTodayPageAPI(bookId);
        setPage(data);
      } catch (err) {
        console.error("Today page error", err);
      } finally {
        setLoading(false);
      }
    }

    fetchPage();
  }, [bookId]);

  return { page, loading };
}