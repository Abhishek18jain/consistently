// hooks/useWorkspaceStatus.js

import { useEffect, useState } from "react";
import { getWorkspaceStatusAPI } from "../Workspace.api.js";
export default function useWorkspaceStatus() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchStatus() {
      try {
        const { data } = await getWorkspaceStatusAPI();
        setStatus(data);
      } catch (err) {
        setError("Failed to load workspace");
      } finally {
        setLoading(false);
      }
    }

    fetchStatus();
  }, []);

  return { status, loading, error };
}