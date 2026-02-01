/**
 * Match API types (mirror backend).
 */

export interface MatchInfoResponse {
  match_id: number;
  season: string;
  venue: string;
  teams?: Record<string, string> | null;
  date?: string | null;
  toss?: Record<string, string> | null;
}
