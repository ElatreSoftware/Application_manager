import type { Application } from "@/types/application";

const applications: Application[] = [];

function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function getApplications(): Application[] {
  return [...applications];
}

export function addApplication(
  input: Omit<Application, "id" | "createdAt">
): Application {
  const app: Application = {
    ...input,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  applications.push(app);
  return app;
}

export function deleteApplication(id: string): boolean {
  const index = applications.findIndex((a) => a.id === id);
  if (index === -1) return false;
  applications.splice(index, 1);
  return true;
}
