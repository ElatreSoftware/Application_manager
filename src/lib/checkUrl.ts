export interface CheckUrlResult {
  ok: boolean;
  status?: number;
  statusText?: string;
  error?: string;
}

const CHECK_TIMEOUT_MS = 10_000;

/**
 * CORS proxies for cross-origin URL checks from the browser.
 * We try allorigins FIRST so GitHub Pages (github.io) works; corsproxy often 403s there.
 * Fallback to corsproxy when allorigins fails (e.g. 403/429).
 */
const PROXY_ALLORIGINS = "https://api.allorigins.win/raw?url=";
const PROXY_CORSPROXY = "https://corsproxy.io/?";

function shouldTryFallback(status: number): boolean {
  return status === 403 || status === 429 || status >= 500;
}

/**
 * Check if a URL is reachable. Works in browser on both localhost and GitHub Pages.
 * Uses allorigins first (works on github.io), then corsproxy as fallback.
 */
export async function checkApplicationUrl(url: string): Promise<CheckUrlResult> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), CHECK_TIMEOUT_MS);

  const fetchOptions = {
    method: "GET" as const,
    signal: controller.signal,
    redirect: "follow" as const,
    headers: { "User-Agent": "ApplicationManager-HealthCheck/1.0" },
  };

  try {
    // Try allorigins first – works on GitHub Pages; corsproxy often returns 403 there.
    let response = await fetch(
      PROXY_ALLORIGINS + encodeURIComponent(url),
      fetchOptions
    );

    if (shouldTryFallback(response.status)) {
      response = await fetch(
        PROXY_CORSPROXY + encodeURIComponent(url),
        fetchOptions
      );
    }

    clearTimeout(timeout);

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
    clearTimeout(timeout);
    const message = err instanceof Error ? err.message : "Network error";
    const isAbort = err instanceof Error && err.name === "AbortError";
    return {
      ok: false,
      error: isAbort ? "Request timed out" : message,
    };
  }
}
