/**
 * Seasons API service.
 */

import { apiClient } from "../api/client";

export interface SeasonsResponse {
  seasons: string[];
}

export const seasonsService = {
  async getAvailableSeasons(): Promise<SeasonsResponse> {
    return apiClient.get<SeasonsResponse>("/seasons");
  },
};
