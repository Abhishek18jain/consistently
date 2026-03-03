// hooks/useCreateJournal.js

import { useState } from "react";
import { createJournalAPI } from "../api/Workspace.api.js";

export default function useCreateJournal() {
  const [loading, setLoading] = useState(false);

  const createJournal = async (payload) => {
    setLoading(true);
    try {
      const { data } = await createJournalAPI(payload);
      return data;
    } finally {
      setLoading(false);
    }
  };

  return { createJournal, loading };
}