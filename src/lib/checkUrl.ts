export interface CheckUrlResult {
  ok: boolean;
  status?: number;
  statusText?: string;
  error?: string;
}

const CHECK_TIMEOUT_MS = 10_000;

/**
 * CORS proxies so we can check cross-origin URLs from the browser (e.g. GitHub Pages).
 * Primary (corsproxy.io) often returns 403 for github.io; fallback (allorigins) works there.
 */
const CORS_PROXY_PRIMARY = "https://corsproxy.io/?";
const CORS_PROXY_FALLBACK = "https://api.allorigins.win/raw?url=";

/** Proxy response 403/429 = proxy blocking our origin; retry with fallback. */
function shouldUseFallbackProxy(status: number): boolean {
  return status === 403 || status === 429;
}

/**
 * Check if a URL is reachable. Runs in the browser (works on GitHub Pages).
 * Uses a CORS proxy with fallback when the primary returns 403 on GitHub Pages.
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
    const proxyUrlPrimary = CORS_PROXY_PRIMARY + encodeURIComponent(url);
    let response = await fetch(proxyUrlPrimary, fetchOptions);

    // On GitHub Pages, corsproxy.io often returns 403; retry with fallback proxy.
    if (shouldUseFallbackProxy(response.status)) {
      const proxyUrlFallback =
        CORS_PROXY_FALLBACK + encodeURIComponent(url);
      response = await fetch(proxyUrlFallback, fetchOptions);
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
