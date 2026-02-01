/**
 * Single source for environment and config.
 * Read EXPO_PUBLIC_* only here.
 */

import { Platform } from "react-native";

const getEnv = (key: string, fallback: string): string => {
  const value = process.env[key];
  return value !== undefined && value !== "" ? value : fallback;
};

function resolveApiBaseUrl(): string {
  let u = getEnv("EXPO_PUBLIC_API_URL", "http://localhost:8000").replace(/\/$/, "");
  if (Platform.OS === "android" && (u.includes("localhost") || u.includes("127.0.0.1"))) {
    u = u.replace(/localhost|127\.0\.0\.1/g, "10.0.2.2");
  }
  return u;
}

export const env = {
  API_BASE_URL: resolveApiBaseUrl(),
  API_TIMEOUT_MS: parseInt(getEnv("EXPO_PUBLIC_API_TIMEOUT", "15000"), 10) || 15000,
  ENV: (getEnv("EXPO_PUBLIC_ENV", "development") as "development" | "staging" | "production") || "development",
} as const;

export const config = {
  apiBasePath: "/api/v1",
  apiBaseUrl: () => `${env.API_BASE_URL}${config.apiBasePath}`,
  isDev: env.ENV === "development",
} as const;
