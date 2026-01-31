/**
 * Player API types (mirror backend).
 */

export interface PlayerResponse {
  name: string;
}

export interface PlayerListResponse {
  players: string[];
  total: number;
  limit: number;
  offset: number;
}

export interface PlayerSearchResponse {
  players: PlayerResponse[];
}
