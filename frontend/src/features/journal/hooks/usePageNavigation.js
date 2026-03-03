import { useState } from "react";
import { openJournalAPI } from "../api/journal.api";
import { startPageAPI } from "../api/page.api";

export default function useJournalNavigation() {
  const [status, setStatus] = useState(null);
  const [bookId, setBookId] = useState(null);
  const [pageId, setPageId] = useState(null);
  const [allowedTemplates, setAllowedTemplates] =
    useState([]);

  /* 🚀 Open journal */
  async function openJournal(bookId) {
    const res = await openJournalAPI(bookId);
    const data = res.data;

    setBookId(bookId);
    setStatus(data.status);

    if (data.status === "HAS_PAGE") {
      setPageId(data.pageId);
    }

    if (data.status === "NO_PAGE") {
      setAllowedTemplates(data.allowedTemplates);
    }
  }

  /* 🎯 Select template → start first page */
  async function selectTemplate(templateId) {
    const res = await startPageAPI({
      bookId,
      templateId,
      date: new Date(),
    });

    setPageId(res.data.pageId);
    setStatus("HAS_PAGE");
  }

  return {
    status,
    pageId,
    allowedTemplates,
    openJournal,
    selectTemplate,
  };
}