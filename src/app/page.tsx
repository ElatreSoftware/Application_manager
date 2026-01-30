"use client";

import { useState } from "react";
import { ApplicationList } from "@/components/ApplicationList";
import type { Application } from "@/types/application";

const DEFAULT_APPLICATIONS: Application[] = [
  {
    id: "1",
    name: "Example API",
    description: "Test URL check (https)",
    url: "https://example.com",
    status: "active",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Weather News Today",
    description: "Real-time forecasts & current conditions",
    url: "https://weathernewstoday.com/",
    status: "active",
    createdAt: new Date().toISOString(),
  },
];

export default function Page() {
  const [applications] = useState<Application[]>(DEFAULT_APPLICATIONS);

  return (
    <main className="min-h-screen p-6 pb-24 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-[var(--foreground)] mb-6">
        Applications
      </h1>
      <ApplicationList applications={applications} />
    </main>
  );
}
