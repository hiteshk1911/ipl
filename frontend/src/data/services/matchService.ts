/**
 * Match API service.
 */

import { apiClient } from "../api/client";
import type { MatchInfoResponse } from "../types";

export const matchService = {
  async getMatchInfo(matchId: number): Promise<MatchInfoResponse> {
    return apiClient.get<MatchInfoResponse>(`/matches/${matchId}`);
  },
};
