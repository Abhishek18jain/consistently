import { useEffect, useState } from "react";
import api from "../../../services/axios";

export default function useAutosave(pageId, blocks) {
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!pageId) return;

    const timeout = setTimeout(async () => {
      setIsSaving(true);

      await api.patch(`/api/pages/${pageId}`, {
        contentJSON: blocks,
      });

      setIsSaving(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, [blocks]);

  return isSaving;
}