import { create } from "zustand";

const useJournalStore = create((set) => ({
  /* ===== CURRENT JOURNAL SESSION ===== */

  journal: null,      // full journal object
  pageId: null,       // current page
  date: null,         // current page date
  templateId: null,   // selected template

  /* ===== JOURNAL ACTIONS ===== */

  /* 🔥 Set journal after creation or opening */
  setJournal: (journal) =>
    set({
      journal,
      templateId: journal?.templateId || null,
    }),

  /* 🔥 Set journal type when user clicks card */
  setJournalType: (type) =>
    set((state) => ({
      journal: {
        ...state.journal,
        type,
      },
    })),

  /* 🔥 Set current page */
  setPage: (pageId, date) =>
    set({
      pageId,
      date,
    }),

  /* 🔥 Set template for this journal */
  setTemplate: (templateId) =>
    set({
      templateId,
    }),

  /* 🔥 Clear everything when leaving journal */
  clearSession: () =>
    set({
      journal: null,
      pageId: null,
      date: null,
      templateId: null,
    }),
}));

export default useJournalStore;