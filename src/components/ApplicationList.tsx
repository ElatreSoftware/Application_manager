"use client";

import { useState, useEffect, useCallback } from "react";
import type { Application } from "@/types/application";
import { checkApplicationUrl, type CheckUrlResult } from "@/lib/checkUrl";

interface ApplicationListProps {
  applications: Application[];
}

function isAbsoluteHttpUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export function ApplicationList({ applications }: ApplicationListProps) {
  const [checkingId, setCheckingId] = useState<string | null>(null);
  // URL check results by app id – used to show Working / Error status
  const [urlStatusByAppId, setUrlStatusByAppId] = useState<
    Record<string, CheckUrlResult>
  >({});
  const [lastCheckedDetail, setLastCheckedDetail] = useState<{
    id: string;
    result: CheckUrlResult;
  } | null>(null);

  const runCheck = useCallback(
    async (app: Application) => {
      if (!app.url || !isAbsoluteHttpUrl(app.url)) return;
      setCheckingId(app.id);
      try {
        const result = await checkApplicationUrl(app.url);
        setUrlStatusByAppId((prev) => ({ ...prev, [app.id]: result }));
        setLastCheckedDetail({ id: app.id, result });
      } finally {
        setCheckingId(null);
      }
    },
    []
  );

  // Check all apps with absolute URLs on load and when list changes
  useEffect(() => {
    const toCheck = applications.filter(
      (app) => app.url && isAbsoluteHttpUrl(app.url)
    );
    toCheck.forEach((app) => runCheck(app));
  }, [applications, runCheck]);

  async function handleCheckUrl(app: Application) {
    await runCheck(app);
  }

  function getStatusDisplay(app: Application): {
    label: string;
    variant: "success" | "error" | "warning" | "muted";
  } {
    if (!app.url || !isAbsoluteHttpUrl(app.url)) {
      return {
        label: app.status,
        variant: app.status === "active" ? "success" : "warning",
      };
    }
    if (checkingId === app.id) {
      return { label: "Checking…", variant: "muted" };
    }
    const result = urlStatusByAppId[app.id];
    if (result) {
      return result.ok
        ? { label: "Working", variant: "success" }
        : { label: "Error", variant: "error" };
    }
    return { label: "Not checked", variant: "muted" };
  }

  if (applications.length === 0) {
    return (
      <p className="text-[var(--muted)] py-8 rounded-lg border border-[var(--border)] border-dashed text-center">
        No applications.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {applications.map((app) => {
        const isChecking = checkingId === app.id;
        return (
          <li
            key={app.id}
            className="flex flex-col gap-3 p-4 rounded-lg bg-[var(--card)] border border-[var(--border)]"
          >
            <div className="flex items-center justify-between gap-4 min-w-0">
              <div className="min-w-0 flex-1">
                <h3 className="font-medium text-[var(--card-foreground)] truncate">
                  {app.name}
                </h3>
                <p className="text-sm text-[var(--muted)] truncate mt-0.5">
                  {app.description}
                </p>
                {app.url && (
                  <a
                    href={app.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[var(--primary)] hover:underline mt-1 inline-block truncate max-w-full"
                  >
                    {app.url}
                  </a>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {app.url && isAbsoluteHttpUrl(app.url) && (
                  <button
                    type="button"
                    onClick={() => handleCheckUrl(app)}
                    disabled={isChecking}
                    className="text-xs px-2.5 py-1.5 rounded border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] hover:bg-[var(--accent)] disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {isChecking ? "Checking…" : "Check URL"}
                  </button>
                )}
                {(() => {
                  const status = getStatusDisplay(app);
                  const variantStyles = {
                    success: "bg-emerald-500/20 text-emerald-400",
                    error: "bg-red-500/20 text-red-400",
                    warning: "bg-amber-500/20 text-amber-400",
                    muted: "bg-[var(--muted)]/50 text-[var(--muted)]",
                  };
                  return (
                    <span
                      className={`text-xs px-2 py-0.5 rounded ${variantStyles[status.variant]}`}
                      title={
                        urlStatusByAppId[app.id]?.error
                          ? urlStatusByAppId[app.id].error
                          : undefined
                      }
                    >
                      {status.label}
                    </span>
                  );
                })()}
              </div>
            </div>
            {lastCheckedDetail?.id === app.id && (
              <div
                className={`text-xs px-3 py-2 rounded border ${lastCheckedDetail.result.ok
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                    : "bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400"
                  }`}
                role="status"
              >
                {lastCheckedDetail.result.ok ? (
                  <span>
                    URL is reachable (HTTP {lastCheckedDetail.result.status})
                  </span>
                ) : (
                  <span>
                    Error: {lastCheckedDetail.result.error ?? "Unknown error"}
                  </span>
                )}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
