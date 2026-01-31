/**
 * Batter API types (mirror backend).
 */

import type { PhaseBreakdown } from "./common";

export interface DismissalStats {
  caught: number;
  bowled: number;
  lbw: number;
  stumped: number;
}

export interface BatterCareerStats {
  matches: number;
  runs: number;
  balls: number;
  outs: number;
  average?: number | null;
  strike_rate: number;
  highest_score?: number | null;
}

export interface BatterProfileResponse {
  batter: string;
  career: BatterCareerStats;
  phase_performance: PhaseBreakdown;
  dismissals: DismissalStats;
}

export interface RecentMatch {
  match_id: number;
  season: string;
  venue: string;
  runs: number;
  balls: number;
  dismissed: boolean;
  strike_rate: number;
}

export interface RecentFormSummary {
  matches: number;
  runs: number;
  balls: number;
  outs: number;
  average?: number | null;
  strike_rate: number;
}

export interface BatterRecentFormResponse {
  batter: string;
  recent_matches: RecentMatch[];
  summary: RecentFormSummary;
}

export interface SeasonProfile {
  season: string;
  matches: number;
  runs: number;
  balls: number;
  outs: number;
  average?: number | null;
  strike_rate: number;
  phase_performance: PhaseBreakdown;
  dismissals: DismissalStats;
}

export interface BatterSeasonProfileResponse {
  batter: string;
  seasons: SeasonProfile[];
  total_seasons: number;
}
