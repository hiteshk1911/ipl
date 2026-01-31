import { useEffect, useState } from "react";
import { playerService } from "../../data/services";
import type { PlayerResponse } from "../../data/types";
import { useDebouncedValue } from "./useDebouncedValue";

export interface UsePlayerSearchResult {
  players: PlayerResponse[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function usePlayerSearch(query: string, enabled = true): UsePlayerSearchResult {
  const [players, setPlayers] = useState<PlayerResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedQuery = useDebouncedValue(query.trim(), 300);

  const fetchPlayers = async () => {
    if (!enabled || debouncedQuery.length < 2) {
      setPlayers([]);
      setError(null);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const res = await playerService.searchPlayers(debouncedQuery, 10);
      setPlayers(res.players);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Search failed";
      setError(message);
      setPlayers([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, [debouncedQuery, enabled]);

  return { players, isLoading, error, refetch: fetchPlayers };
}
