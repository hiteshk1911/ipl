/**
 * Batter API service.
 */

import { apiClient } from "../api/client";
import type {
  BatterProfileResponse,
  BatterSeasonProfileResponse,
  BatterRecentFormResponse,
} from "../types";

function encodeName(name: string): string {
  return encodeURIComponent(name.trim());
}

export const batterService = {
  async getProfile(batterName: string): Promise<BatterProfileResponse> {
    return apiClient.get<BatterProfileResponse>(`/batters/${encodeName(batterName)}/profile`);
  },

  async getProfileBySeason(batterName: string, season?: string | null): Promise<BatterSeasonProfileResponse> {
    const path = `/batters/${encodeName(batterName)}/profile/seasons`;
    return apiClient.get<BatterSeasonProfileResponse>(path, {
      params: season ? { season } : undefined,
    });
  },

  async getRecentForm(
    batterName: string,
    matches = 5,
    season?: string | null
  ): Promise<BatterRecentFormResponse> {
    const path = `/batters/${encodeName(batterName)}/recent-form`;
    return apiClient.get<BatterRecentFormResponse>(path, {
      params: { matches, season },
    });
  },
};
