import { NextResponse } from "next/server";
import type { Application } from "@/types/application";
import { getApplications, addApplication } from "@/lib/store";

export async function GET() {
  const applications = getApplications();
  return NextResponse.json({ applications });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, url, status } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    const app: Omit<Application, "id" | "createdAt"> = {
      name: name.trim(),
      description: typeof description === "string" ? description.trim() : "",
      url: typeof url === "string" && url.trim() ? url.trim() : undefined,
      status: status === "inactive" ? "inactive" : "active",
    };

    const created = addApplication(app);
    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
