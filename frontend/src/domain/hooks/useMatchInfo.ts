import { useEffect, useState, useCallback } from "react";
import { matchService } from "../../data/services";
import type { MatchInfoResponse } from "../../data/types";
import { ApiError } from "../../data/types/common";

export interface UseMatchInfoResult {
  data: MatchInfoResponse | null;
  isLoading: boolean;
  error: string | null;
  errorCode: string | null;
  refetch: () => void;
}

export function useMatchInfo(matchId: number | null | undefined, enabled: boolean): UseMatchInfoResult {
  const [data, setData] = useState<MatchInfoResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);

  const fetchMatch = useCallback(async () => {
    if (!enabled || matchId == null || Number.isNaN(Number(matchId))) {
      setData(null);
      setError(null);
      setErrorCode(null);
      return;
    }
    const id = Number(matchId);
    setIsLoading(true);
    setError(null);
    setErrorCode(null);
    try {
      const res = await matchService.getMatchInfo(id);
      setData(res);
    } catch (e) {
      if (e instanceof ApiError) {
        setError(e.message);
        setErrorCode(e.code);
      } else {
        setError(e instanceof Error ? e.message : "Failed to load match");
        setErrorCode(null);
      }
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [matchId, enabled]);

  useEffect(() => {
    fetchMatch();
  }, [fetchMatch]);

  return { data, isLoading, error, errorCode, refetch: fetchMatch };
}
