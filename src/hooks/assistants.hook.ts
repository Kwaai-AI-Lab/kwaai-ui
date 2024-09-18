import { useState, useEffect, useCallback } from "react";
import { Bot } from "../data/types";
import AssistantsService from "../services/assistants.service";

interface UseAssistantsResult {
  assistants: Bot[];
  loading: boolean;
  error: string | null;
  refetchAssistants: () => void;
}

const useAssistants = (type: string): UseAssistantsResult => {
  const [assistants, setAssistants] = useState<Bot[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAssistants = useCallback(async () => {
    setLoading(true);
    try {
      const result = await AssistantsService.getAssistants(type);
      setAssistants(result);
    } catch (err) {
      setError("Error fetching assistants");
    } finally {
      setLoading(false);
    }
  }, [type]);

  useEffect(() => {
    fetchAssistants();
  }, [fetchAssistants]);

  return { assistants, loading, error, refetchAssistants: fetchAssistants };
};

export default useAssistants;
