module.exports = [
"[project]/src/lib/checkUrl.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "checkApplicationUrl",
    ()=>checkApplicationUrl
]);
const CHECK_TIMEOUT_MS = 10_000;
/**
 * CORS proxy so we can check cross-origin URLs from the browser.
 * Direct fetch() fails for most sites because they don't send CORS headers.
 */ const CORS_PROXY = "https://corsproxy.io/?";
async function checkApplicationUrl(url) {
    const controller = new AbortController();
    const timeout = setTimeout(()=>controller.abort(), CHECK_TIMEOUT_MS);
    const fetchOptions = {
        method: "GET",
        signal: controller.signal,
        redirect: "follow",
        headers: {
            "User-Agent": "ApplicationManager-HealthCheck/1.0"
        }
    };
    try {
        // Use CORS proxy so the browser can read the response (target sites
        // usually don't send Access-Control-Allow-Origin for our origin).
        const proxyUrl = CORS_PROXY + encodeURIComponent(url);
        const response = await fetch(proxyUrl, fetchOptions).finally(()=>clearTimeout(timeout));
        const ok = response.ok;
        const status = response.status;
        const statusText = response.statusText;
        return {
            ok,
            status,
            statusText,
            ...ok ? {} : {
                error: `HTTP ${status} ${statusText}`
            }
        };
    } catch (err) {
        clearTimeout(timeout);
        const message = err instanceof Error ? err.message : "Network error";
        const isAbort = err instanceof Error && err.name === "AbortError";
        return {
            ok: false,
            error: isAbort ? "Request timed out" : message
        };
    }
}
}),
"[project]/src/components/ApplicationList.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ApplicationList",
    ()=>ApplicationList
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$checkUrl$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/checkUrl.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
function isAbsoluteHttpUrl(url) {
    try {
        const u = new URL(url);
        return u.protocol === "http:" || u.protocol === "https:";
    } catch  {
        return false;
    }
}
function ApplicationList({ applications }) {
    const [checkingId, setCheckingId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    // URL check results by app id – used to show Working / Error status
    const [urlStatusByAppId, setUrlStatusByAppId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({});
    const [lastCheckedDetail, setLastCheckedDetail] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const runCheck = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (app)=>{
        if (!app.url || !isAbsoluteHttpUrl(app.url)) return;
        setCheckingId(app.id);
        try {
            const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$checkUrl$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["checkApplicationUrl"])(app.url);
            setUrlStatusByAppId((prev)=>({
                    ...prev,
                    [app.id]: result
                }));
            setLastCheckedDetail({
                id: app.id,
                result
            });
        } finally{
            setCheckingId(null);
        }
    }, []);
    // Check all apps with absolute URLs on load and when list changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const toCheck = applications.filter((app)=>app.url && isAbsoluteHttpUrl(app.url));
        toCheck.forEach((app)=>runCheck(app));
    }, [
        applications,
        runCheck
    ]);
    async function handleCheckUrl(app) {
        await runCheck(app);
    }
    function getStatusDisplay(app) {
        if (!app.url || !isAbsoluteHttpUrl(app.url)) {
            return {
                label: app.status,
                variant: app.status === "active" ? "success" : "warning"
            };
        }
        if (checkingId === app.id) {
            return {
                label: "Checking…",
                variant: "muted"
            };
        }
        const result = urlStatusByAppId[app.id];
        if (result) {
            return result.ok ? {
                label: "Working",
                variant: "success"
            } : {
                label: "Error",
                variant: "error"
            };
        }
        return {
            label: "Not checked",
            variant: "muted"
        };
    }
    if (applications.length === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "text-[var(--muted)] py-8 rounded-lg border border-[var(--border)] border-dashed text-center",
            children: "No applications."
        }, void 0, false, {
            fileName: "[project]/src/components/ApplicationList.tsx",
            lineNumber: 82,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
        className: "space-y-3",
        children: applications.map((app)=>{
            const isChecking = checkingId === app.id;
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                className: "flex flex-col gap-3 p-4 rounded-lg bg-[var(--card)] border border-[var(--border)]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between gap-4 min-w-0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "min-w-0 flex-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "font-medium text-[var(--card-foreground)] truncate",
                                        children: app.name
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ApplicationList.tsx",
                                        lineNumber: 99,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-[var(--muted)] truncate mt-0.5",
                                        children: app.description
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ApplicationList.tsx",
                                        lineNumber: 102,
                                        columnNumber: 17
                                    }, this),
                                    app.url && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                        href: app.url,
                                        target: "_blank",
                                        rel: "noopener noreferrer",
                                        className: "text-sm text-[var(--primary)] hover:underline mt-1 inline-block truncate max-w-full",
                                        children: app.url
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ApplicationList.tsx",
                                        lineNumber: 106,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/ApplicationList.tsx",
                                lineNumber: 98,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2 shrink-0",
                                children: [
                                    app.url && isAbsoluteHttpUrl(app.url) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>handleCheckUrl(app),
                                        disabled: isChecking,
                                        className: "text-xs px-2.5 py-1.5 rounded border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] hover:bg-[var(--accent)] disabled:opacity-50 disabled:pointer-events-none",
                                        children: isChecking ? "Checking…" : "Check URL"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ApplicationList.tsx",
                                        lineNumber: 118,
                                        columnNumber: 19
                                    }, this),
                                    (()=>{
                                        const status = getStatusDisplay(app);
                                        const variantStyles = {
                                            success: "bg-emerald-500/20 text-emerald-400",
                                            error: "bg-red-500/20 text-red-400",
                                            warning: "bg-amber-500/20 text-amber-400",
                                            muted: "bg-[var(--muted)]/50 text-[var(--muted)]"
                                        };
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: `text-xs px-2 py-0.5 rounded ${variantStyles[status.variant]}`,
                                            title: urlStatusByAppId[app.id]?.error ? urlStatusByAppId[app.id].error : undefined,
                                            children: status.label
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ApplicationList.tsx",
                                            lineNumber: 136,
                                            columnNumber: 21
                                        }, this);
                                    })()
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/ApplicationList.tsx",
                                lineNumber: 116,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ApplicationList.tsx",
                        lineNumber: 97,
                        columnNumber: 13
                    }, this),
                    lastCheckedDetail?.id === app.id && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `text-xs px-3 py-2 rounded border ${lastCheckedDetail.result.ok ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400" : "bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400"}`,
                        role: "status",
                        children: lastCheckedDetail.result.ok ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: [
                                "URL is reachable (HTTP ",
                                lastCheckedDetail.result.status,
                                ")"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/ApplicationList.tsx",
                            lineNumber: 159,
                            columnNumber: 19
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: [
                                "Error: ",
                                lastCheckedDetail.result.error ?? "Unknown error"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/ApplicationList.tsx",
                            lineNumber: 163,
                            columnNumber: 19
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/ApplicationList.tsx",
                        lineNumber: 151,
                        columnNumber: 15
                    }, this)
                ]
            }, app.id, true, {
                fileName: "[project]/src/components/ApplicationList.tsx",
                lineNumber: 93,
                columnNumber: 11
            }, this);
        })
    }, void 0, false, {
        fileName: "[project]/src/components/ApplicationList.tsx",
        lineNumber: 89,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/app/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Page
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ApplicationList$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ApplicationList.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
const DEFAULT_APPLICATIONS = [
    {
        id: "1",
        name: "Example API",
        description: "Test URL check (https)",
        url: "https://example.com",
        status: "active",
        createdAt: new Date().toISOString()
    },
    {
        id: "2",
        name: "Weather News Today",
        description: "Real-time forecasts & current conditions",
        url: "https://weathernewstoday.com/",
        status: "active",
        createdAt: new Date().toISOString()
    }
];
function Page() {
    const [applications] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(DEFAULT_APPLICATIONS);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "min-h-screen p-6 pb-24 max-w-2xl mx-auto",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                className: "text-2xl font-bold text-[var(--foreground)] mb-6",
                children: "Applications"
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 31,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ApplicationList$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ApplicationList"], {
                applications: applications
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 34,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/page.tsx",
        lineNumber: 30,
        columnNumber: 5
    }, this);
}
}),
"[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].ReactJsxDevRuntime; //# sourceMappingURL=react-jsx-dev-runtime.js.map
}),
];

//# sourceMappingURL=_73c93800._.js.map