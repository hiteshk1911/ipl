import { useEffect, useState, useCallback } from "react";
import { seasonsService } from "../../data/services";

export interface UseAvailableSeasonsResult {
  seasons: string[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useAvailableSeasons(enabled: boolean = true): UseAvailableSeasonsResult {
  const [seasons, setSeasons] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSeasons = useCallback(async () => {
    if (!enabled) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await seasonsService.getAvailableSeasons();
      setSeasons(res.seasons ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load seasons");
      setSeasons([]);
    } finally {
      setIsLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    fetchSeasons();
  }, [fetchSeasons]);

  return { seasons, isLoading, error, refetch: fetchSeasons };
}
