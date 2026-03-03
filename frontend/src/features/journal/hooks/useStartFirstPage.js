// features/journal/hooks/useStartFirstPage.js

import { useState } from "react";
import { startPageAPI } from "../api/page.api";

export default function useStartFirstPage() {
  const [loading, setLoading] = useState(false);
  

  const startFirstPage = async ({
    bookId,
    templateId,
    date,
  }) => {
    try {
      setLoading(true);

      const res = await startPageAPI({
        bookId,
        templateId,
        date,
      });

      return res.data;
    } catch (err) {
      console.error("Start first page failed", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { startFirstPage, loading };
}