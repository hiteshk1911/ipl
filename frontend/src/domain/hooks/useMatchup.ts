import { useEffect, useState, useCallback } from "react";
import { matchupService } from "../../data/services";
import type { BatterBowlerMatchupResponse } from "../../data/types";
import { ApiError } from "../../data/types/common";

export interface UseMatchupResult {
  data: BatterBowlerMatchupResponse | null;
  isLoading: boolean;
  error: string | null;
  errorCode: string | null;
  refetch: () => void;
}

export function useMatchup(
  batterName: string,
  bowlerName: string,
  enabled: boolean,
  season?: string | null
): UseMatchupResult {
  const [data, setData] = useState<BatterBowlerMatchupResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);

  const fetchMatchup = useCallback(async () => {
    const batter = batterName?.trim();
    const bowler = bowlerName?.trim();
    if (!enabled || !batter || !bowler) {
      setData(null);
      setError(null);
      setErrorCode(null);
      return;
    }
    setIsLoading(true);
    setError(null);
    setErrorCode(null);
    try {
      const res = await matchupService.getMatchup(batter, bowler, { season: season ?? undefined });
      setData(res);
    } catch (e) {
      if (e instanceof ApiError) {
        setError(e.message);
        setErrorCode(e.code);
      } else {
        setError(e instanceof Error ? e.message : "Failed to load matchup");
        setErrorCode(null);
      }
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [batterName, bowlerName, enabled, season]);

  useEffect(() => {
    fetchMatchup();
  }, [fetchMatchup]);

  return { data, isLoading, error, errorCode, refetch: fetchMatchup };
}
