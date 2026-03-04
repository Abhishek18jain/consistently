import { useNavigate } from "react-router-dom";
import { openJournalAPI } from "../api/journal.api";

export default function useOpenJournal() {
  const navigate = useNavigate();

  const openJournal = async (journalId) => {
    try {
      const res = await openJournalAPI(journalId);

      const { status, lastPageDate } = res.data;

      console.log("open journal response:", res.data);

      if (status === "SETUP_REQUIRED") {
        navigate(`/templates/${journalId}`);
        return true;
      }

      if (status === "NO_PAGE") {
        navigate(`/journals/${journalId}/new`);
        return true;
      }

      if (status === "HAS_PAGE") {
        navigate(`/journals/${journalId}/date/${lastPageDate}`);
        return true;
      }

    } catch (err) {
      console.error("Open journal failed", err);
      return false;
    }
  };

  return { openJournal };
}