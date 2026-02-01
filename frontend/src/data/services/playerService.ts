/**
 * Player API service.
 */

import { apiClient } from "../api/client";
import type { PlayerSearchResponse, PlayerListResponse } from "../types";

export const playerService = {
  async searchPlayers(q: string, limit = 10): Promise<PlayerSearchResponse> {
    return apiClient.get<PlayerSearchResponse>("/players/search", {
      params: { q: q.trim(), limit },
    });
  },

  async listPlayers(params: { search?: string; limit?: number; offset?: number } = {}): Promise<PlayerListResponse> {
    return apiClient.get<PlayerListResponse>("/players", {
      params: {
        search: params.search,
        limit: params.limit ?? 100,
        offset: params.offset ?? 0,
      },
    });
  },
};
