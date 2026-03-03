// hooks/useJournals.js

import { useEffect, useState } from "react";
import { getJournalsAPI } from "../api/Workspace.api";

export default function useJournals() {
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJournals() {
      try {
        const { data } = await getJournalsAPI();
        setJournals(data);
      } catch (err) {
        console.error("Journal fetch error", err);
      } finally {
        setLoading(false);
      }
    }

    fetchJournals();
  }, []);

  return { journals, loading };
}