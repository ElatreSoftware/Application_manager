export interface CheckUrlResult {
  ok: boolean;
  status?: number;
  statusText?: string;
  error?: string;
}

export async function checkApplicationUrl(url: string): Promise<CheckUrlResult> {
  try {
    const res = await fetch("/api/check-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        ok: false,
        error: data?.error ?? `Request failed (${res.status})`,
      };
    }

    return {
      ok: data.ok ?? false,
      status: data.status,
      statusText: data.statusText,
      error: data.error,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Network error";
    return { ok: false, error: message };
  }
}
