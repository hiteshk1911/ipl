/**
 * Pure formatting helpers. No side effects, no API.
 */

export function formatNumber(n: number): string {
  return n.toLocaleString();
}

export function formatStrikeRate(sr: number): string {
  return sr.toFixed(1);
}

export function formatAverage(avg: number | null | undefined): string {
  if (avg == null) return "—";
  return avg.toFixed(2);
}

export function encodeUriComponent(str: string): string {
  return encodeURIComponent(str.trim());
}
