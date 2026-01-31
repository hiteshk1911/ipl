/**
 * Central API client: base URL, headers, timeout, error handling.
 */

import { config, env } from "../../core/config/env";
import { buildQueryString } from "../../core/utils/query";
import { ApiError } from "../types/common";

const baseUrl = config.apiBaseUrl();
const timeoutMs = env.API_TIMEOUT_MS;

async function fetchWithTimeout(url: string, init: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...init, signal: controller.signal });
    clearTimeout(id);
    return res;
  } catch (e) {
    clearTimeout(id);
    if (e instanceof Error) {
      if (e.name === "AbortError") throw new ApiError("TIMEOUT", "Request timed out", 408);
      throw new ApiError("NETWORK_ERROR", e.message || "Network request failed", 0);
    }
    throw e;
  }
}

async function parseErrorResponse(response: Response): Promise<ApiError> {
  let code = "UNKNOWN";
  let message = response.statusText || "Something went wrong";
  let details: Record<string, unknown> | undefined;
  try {
    const body = await response.json();
    if (body?.error) {
      code = body.error.code ?? code;
      message = body.error.message ?? message;
      details = body.error.details;
    }
  } catch {
    // ignore JSON parse failure
  }
  return new ApiError(code, message, response.status, details);
}

export interface GetOptions {
  params?: Record<string, string | number | boolean | undefined | null>;
}

export const apiClient = {
  async get<T>(path: string, options: GetOptions = {}): Promise<T> {
    const pathSegment = path.replace(/^\//, "");
    const url = path.startsWith("http") ? path : (baseUrl.endsWith("/") ? `${baseUrl}${pathSegment}` : `${baseUrl}/${pathSegment}`);
    const query = options.params ? buildQueryString(options.params) : "";
    const fullUrl = `${url}${query}`;
    const response = await fetchWithTimeout(fullUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw await parseErrorResponse(response);
    }
    return response.json() as Promise<T>;
  },
};
