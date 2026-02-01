/**
 * Matchup API service.
 */

import { apiClient } from "../api/client";
import type { BatterBowlerMatchupResponse } from "../types";

function encodeSegment(name: string): string {
  return encodeURIComponent(name.trim());
}

export interface GetMatchupOptions {
  season?: string | null;
  venue?: string | null;
  include_phases?: boolean;
}

export const matchupService = {
  async getMatchup(batterName: string, bowlerName: string, options: GetMatchupOptions = {}): Promise<BatterBowlerMatchupResponse> {
    const batter = encodeSegment(batterName);
    const bowler = encodeSegment(bowlerName);
    const path = `/matchups/batter/${batter}/bowler/${bowler}`;
    // #region agent log
    fetch("http://127.0.0.1:7242/ingest/3a98a3bc-3fe2-4ce2-83aa-64ae1b0a300", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ location: "matchupService.ts:getMatchup", message: "getMatchup request", data: { batterName, bowlerName, path, batterEncoded: batter, bowlerEncoded: bowler }, timestamp: Date.now(), sessionId: "debug-session", hypothesisId: "H4-H2" }) }).catch(() => {});
    // #endregion
    return apiClient.get<BatterBowlerMatchupResponse>(path, {
      params: {
        season: options.season,
        venue: options.venue,
        include_phases: options.include_phases ?? true,
      },
    });
  },
};
