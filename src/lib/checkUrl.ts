export interface CheckUrlResult {
  ok: boolean;
  status?: number;
  statusText?: string;
  error?: string;
}

const CHECK_TIMEOUT_MS = 10_000;

/**
 * CORS proxy so we can check cross-origin URLs from the browser.
 * Direct fetch() fails for most sites because they don't send CORS headers.
 */
const CORS_PROXY = "https://corsproxy.io/?";

/**
 * Check if a URL is reachable. Runs in the browser (works on GitHub Pages;
 * no server API required). Uses a CORS proxy so cross-origin URLs work.
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
    // Use CORS proxy so the browser can read the response (target sites
    // usually don't send Access-Control-Allow-Origin for our origin).
    const proxyUrl = CORS_PROXY + encodeURIComponent(url);
    const response = await fetch(proxyUrl, fetchOptions).finally(() =>
      clearTimeout(timeout)
    );

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
