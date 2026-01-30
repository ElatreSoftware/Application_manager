export interface CheckUrlResult {
  ok: boolean;
  status?: number;
  statusText?: string;
  error?: string;
}

const CHECK_TIMEOUT_MS = 10_000;

/**
 * Check if a URL is reachable. Runs in the browser (works on GitHub Pages;
 * no server API required). CORS may block some cross-origin URLs.
 */
export async function checkApplicationUrl(url: string): Promise<CheckUrlResult> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), CHECK_TIMEOUT_MS);

    const response = await fetch(url, {
      method: "GET",
      mode: "cors",
      signal: controller.signal,
      redirect: "follow",
      headers: { "User-Agent": "ApplicationManager-HealthCheck/1.0" },
    }).finally(() => clearTimeout(timeout));

    const ok = response.ok;
    const status = response.status;
    const statusText = response.statusText;

    return {
      ok,
      status,
      statusText,
      ...(ok ? {} : { error: `HTTP ${status} ${statusText}` }),
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Network error";
    const isAbort = err instanceof Error && err.name === "AbortError";
    return {
      ok: false,
      error: isAbort ? "Request timed out" : message,
    };
  }
}
