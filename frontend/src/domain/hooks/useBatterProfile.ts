import { useEffect, useState, useCallback } from "react";
import { batterService } from "../../data/services";
import type {
  BatterProfileResponse,
  BatterSeasonProfileResponse,
  BatterRecentFormResponse,
} from "../../data/types";
import { ApiError } from "../../data/types/common";

export interface UseBatterProfileResult {
  profile: BatterProfileResponse | null;
  isLoading: boolean;
  error: string | null;
  errorCode: string | null;
  refetch: () => void;
}

export function useBatterProfile(batterName: string, enabled: boolean): UseBatterProfileResult {
  const [profile, setProfile] = useState<BatterProfileResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    const name = batterName?.trim();
    if (!enabled || !name) {
      setProfile(null);
      setError(null);
      setErrorCode(null);
      return;
    }
    setIsLoading(true);
    setError(null);
    setErrorCode(null);
    try {
      const res = await batterService.getProfile(name);
      setProfile(res);
    } catch (e) {
      if (e instanceof ApiError) {
        setError(e.message);
        setErrorCode(e.code);
      } else {
        setError(e instanceof Error ? e.message : "Failed to load profile");
        setErrorCode(null);
      }
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  }, [batterName, enabled]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { profile, isLoading, error, errorCode, refetch: fetchProfile };
}

export interface UseBatterSeasonsResult {
  data: BatterSeasonProfileResponse | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useBatterSeasons(
  batterName: string,
  season: string | null | undefined,
  enabled: boolean
): UseBatterSeasonsResult {
  const [data, setData] = useState<BatterSeasonProfileResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSeasons = useCallback(async () => {
    const name = batterName?.trim();
    if (!enabled || !name) {
      setData(null);
      setError(null);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const res = await batterService.getProfileBySeason(name, season ?? undefined);
      setData(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load seasons");
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [batterName, season, enabled]);

  useEffect(() => {
    fetchSeasons();
  }, [fetchSeasons]);

  return { data, isLoading, error, refetch: fetchSeasons };
}

export interface UseBatterRecentFormResult {
  data: BatterRecentFormResponse | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useBatterRecentForm(
  batterName: string,
  matches: number,
  season: string | null | undefined,
  enabled: boolean
): UseBatterRecentFormResult {
  const [data, setData] = useState<BatterRecentFormResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchForm = useCallback(async () => {
    const name = batterName?.trim();
    if (!enabled || !name) {
      setData(null);
      setError(null);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const res = await batterService.getRecentForm(name, matches, season ?? undefined);
      setData(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load recent form");
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [batterName, matches, season, enabled]);

  useEffect(() => {
    fetchForm();
  }, [fetchForm]);

  return { data, isLoading, error, refetch: fetchForm };
}
