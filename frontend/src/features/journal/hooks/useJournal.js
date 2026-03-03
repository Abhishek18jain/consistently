// features/journal/hooks/useJournals.js

import { useEffect, useState } from "react";
import { journalApi } from "../api/journal.api";

export default function useJournals() {
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJournals = async () => {
    try {
      setLoading(true);
      const res = await journalApi.getJournals();
      setJournals(res.data);
    } catch (err) {
      console.error("Failed to fetch journals", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJournals();
  }, []);

  return {
    journals,
    loading,
    refresh: fetchJournals,
  };
}