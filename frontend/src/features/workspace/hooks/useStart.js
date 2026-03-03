// hooks/useStartJournal.js

import { useState } from "react";
import { startJournalAPI } from "../api/Workspace.api";

export default function useStartJournal() {
  const [loading, setLoading] = useState(false);

  const startJournal = async (bookId) => {
    setLoading(true);
    try {
      const { data } = await startJournalAPI(bookId);
      return data;
    } finally {
      setLoading(false);
    }
  };

  return { startJournal, loading };
}