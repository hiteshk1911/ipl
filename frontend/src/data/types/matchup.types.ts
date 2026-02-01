/**
 * Matchup API types (mirror backend).
 */

import type { PhaseStats } from "./common";

export interface MatchupStats {
  runs: number;
  balls: number;
  dismissals: number;
  strike_rate: number;
  average?: number | null;
  confidence_score?: number | null;
}

export interface RecentEncounter {
  match_id: number;
  season: string;
  runs: number;
  balls: number;
  dismissed: boolean;
}

export interface BatterBowlerMatchupResponse {
  batter: string;
  bowler: string;
  overall: MatchupStats;
  phase_breakdown?: Record<string, PhaseStats> | null;
  recent_encounters: RecentEncounter[];
}
