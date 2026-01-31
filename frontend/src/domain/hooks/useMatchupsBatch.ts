import { useEffect, useState, useCallback } from "react";
import { matchupService } from "../../data/services";
import type { BatterBowlerMatchupResponse } from "../../data/types";

export interface UseMatchupsBatchResult {
  data: (BatterBowlerMatchupResponse | null)[];
  isLoading: boolean;
  errors: (string | null)[];
  refetch: () => void;
}

/**
 * Fetches matchup for batter vs each bowler in parallel.
 */
export function useMatchupsBatch(batterName: string, bowlerNames: string[], enabled: boolean): UseMatchupsBatchResult {
  const [data, setData] = useState<(BatterBowlerMatchupResponse | null)[]>([]);
  const [errors, setErrors] = useState<(string | null)[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAll = useCallback(async () => {
    const batter = batterName?.trim();
    const bowlers = bowlerNames.filter((b) => b?.trim());
    if (!enabled || !batter || bowlers.length === 0) {
      setData([]);
      setErrors([]);
      return;
    }
    setIsLoading(true);
    setErrors(bowlers.map(() => null));
    const settled = await Promise.allSettled(bowlers.map((bowler) => matchupService.getMatchup(batter, bowler)));
    const results: (BatterBowlerMatchupResponse | null)[] = settled.map((s) => (s.status === "fulfilled" ? s.value : null));
    const errs: (string | null)[] = settled.map((s) =>
      s.status === "rejected" ? (s.reason instanceof Error ? s.reason.message : "Failed to load matchup") : null
    );
    setData(results);
    setErrors(errs);
    setIsLoading(false);
  }, [batterName, bowlerNames.join(","), enabled]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return { data, isLoading, errors, refetch: fetchAll };
}
