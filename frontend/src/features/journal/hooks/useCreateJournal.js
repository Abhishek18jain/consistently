// features/journal/hooks/useCreateJournal.js

import { journalApi } from "../api/journal.api";

export default function useCreateJournal() {
  const createJournal = async ({ title, journalType }) => {
    try {
      const res = await journalApi.createJournal({ title, journalType });

      console.log("CreateJournal response:", res);

      // Handle multiple possible backend shapes safely
      const journal =
        res?.data?.journal ||   // expected
        res?.data?.data ||      // common pattern
        res?.data;              // fallback

      if (!journal || !journal._id) {
        throw new Error("Invalid journal returned from backend");
      }

      return journal;

    } catch (err) {
      console.error("Create journal failed:", err);
      return null;
    }
  };

  return { createJournal };
}