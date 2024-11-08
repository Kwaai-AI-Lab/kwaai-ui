import { useState, useEffect, useCallback } from "react";
import { Bot } from "../data/types";
import AssistantsService from "../services/assistants.service";

interface UseSharedAssistantsResult {
  sharedAssistants: Bot[];
  loading: boolean;
  error: string | null;
  refetchSharedAssistants: () => void;
}

const useSharedAssistants = (): UseSharedAssistantsResult => {
  const [sharedAssistants, setSharedAssistants] = useState<Bot[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSharedAssistants = useCallback(async () => {
    setLoading(true);
    try {
      const result = await AssistantsService.getSharedAssistants( localStorage.getItem("userId") || "" );
      setSharedAssistants(result);
    } catch (err) {
      setError("Error fetching shared assistants");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSharedAssistants();
  }, [fetchSharedAssistants]);

  return { sharedAssistants, loading, error, refetchSharedAssistants: fetchSharedAssistants };
};

export default useSharedAssistants;
