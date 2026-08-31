/**
 * Centralized API layer. The browser talks ONLY to the FastAPI backend.
 * Base URL comes from VITE_API_BASE_URL (never credentials/secrets).
 */
export const API_BASE_URL: string = (
  (import.meta.env['VITE_API_BASE_URL'] as string | undefined) ?? "http://localhost:8000"
).replace(/\/$/, "");

export class ApiError extends Error {
  status: number;
  constructor(message: string, status = 0) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type Options = {
  method?: string;
  body?: unknown;
  signal?: AbortSignal;
  timeoutMs?: number;
};

export async function apiRequest<T>(path: string, opts: Options = {}): Promise<T> {
  const { method = "GET", body, signal, timeoutMs = 20000 } = opts;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  signal?.addEventListener("abort", () => controller.abort());

  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method,
      ...(body ? { headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) } : {}),
      signal: controller.signal,
    });

    const text = await res.text();
    let parsed: unknown = text;
    try {
      parsed = text ? JSON.parse(text) : null;
    } catch {
      /* non-JSON response kept as text */
    }

    if (!res.ok) {
      const detail =
        parsed && typeof parsed === "object" && "detail" in (parsed as Record<string, unknown>)
          ? String((parsed as Record<string, unknown>)['detail'])
          : `Request failed (${res.status})`;
      throw new ApiError(detail, res.status);
    }
    return parsed as T;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new ApiError("The intelligence server did not respond in time.", 0);
    }
    throw new ApiError("ThermoGuard cannot reach the intelligence server.", 0);
  } finally {
    clearTimeout(timer);
  }
}

/** Some FastAPI handlers wrap collections in { data: [...] } — normalize both shapes. */
export function toArray<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[];
  if (payload && typeof payload === "object") {
    for (const key of ["data", "items", "results", "facilities", "anomalies"]) {
      const v = (payload as Record<string, unknown>)[key];
      if (Array.isArray(v)) return v as T[];
    }
  }
  return [];
}
