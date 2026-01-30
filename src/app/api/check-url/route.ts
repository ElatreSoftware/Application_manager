import { NextResponse } from "next/server";

const CHECK_TIMEOUT_MS = 10_000;

function isValidHttpUrl(str: string): boolean {
  try {
    const u = new URL(str);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const url = typeof body?.url === "string" ? body.url.trim() : "";

    if (!url) {
      return NextResponse.json(
        { ok: false, error: "URL is required" },
        { status: 400 }
      );
    }

    if (!isValidHttpUrl(url)) {
      return NextResponse.json(
        { ok: false, error: "Invalid URL. Use http or https." },
        { status: 400 }
      );
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), CHECK_TIMEOUT_MS);

    const response = await fetch(url, {
      method: "GET",
      signal: controller.signal,
      redirect: "follow",
      headers: { "User-Agent": "ApplicationManager-HealthCheck/1.0" },
    }).finally(() => clearTimeout(timeout));

    const ok = response.ok;
    const status = response.status;
    const statusText = response.statusText;

    return NextResponse.json({
      ok,
      status,
      statusText,
      ...(ok ? {} : { error: `HTTP ${status} ${statusText}` }),
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Request failed";
    const isAbort = err instanceof Error && err.name === "AbortError";
    return NextResponse.json(
      {
        ok: false,
        error: isAbort ? "Request timed out" : message,
      },
      { status: 200 }
    );
  }
}
