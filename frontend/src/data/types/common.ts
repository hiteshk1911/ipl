/**
 * Common API types (mirror backend).
 */

export interface ApiErrorBody {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export class ApiError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status: number,
    public readonly details?: Record<string, unknown>
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export interface HealthResponse {
  status: string;
  database: string;
  version: string;
}

export interface PhaseStats {
  runs: number;
  balls: number;
  strike_rate: number;
  outs: number;
  average?: number | null;
}

export interface PhaseBreakdown {
  powerplay?: PhaseStats | null;
  middle?: PhaseStats | null;
  death?: PhaseStats | null;
}
