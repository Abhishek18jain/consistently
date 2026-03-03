import { useNavigate } from "react-router-dom";
import { openJournalAPI } from "../api/journal.api";

export default function useOpenJournal() {
  const navigate = useNavigate();

  const openJournal = async (journalId) => {
    try {
      const res = await openJournalAPI(journalId);

      const { totalPages, lastPageDate} = res.data;

      if (!totalPages) {
        navigate(`/templates/${journalId}`);
        return true;
      } else{
        /* 📖 HAS PAGE → OPEN LATEST PAGE */
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
