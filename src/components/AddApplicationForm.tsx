"use client";

import { useState } from "react";
import type { Application } from "@/types/application";

interface AddApplicationFormProps {
  onAdd: (app: Omit<Application, "id" | "createdAt">) => void;
}

export function AddApplicationForm({ onAdd }: AddApplicationFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<"active" | "inactive">("active");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd({
      name: name.trim(),
      description: description.trim(),
      url: url.trim() || undefined,
      status,
    });
    setName("");
    setDescription("");
    setUrl("");
    setStatus("active");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-5 rounded-lg bg-[var(--card)] border border-[var(--border)] space-y-4"
    >
      <h2 id="form-title" className="text-lg font-semibold text-[var(--card-foreground)]">
        Add application
      </h2>
      <div>
        <label htmlFor="name" className="block text-sm text-[var(--muted)] mb-1">
          Name *
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="My App"
          required
          className="w-full px-3 py-2 rounded bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm text-[var(--muted)] mb-1">
          Description
        </label>
        <input
          id="description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Short description"
          className="w-full px-3 py-2 rounded bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
        />
      </div>
      <div>
        <label htmlFor="url" className="block text-sm text-[var(--muted)] mb-1">
          URL
        </label>
        <input
          id="url"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://..."
          className="w-full px-3 py-2 rounded bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
        />
      </div>
      <div>
        <label htmlFor="status" className="block text-sm text-[var(--muted)] mb-1">
          Status
        </label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value as "active" | "inactive")}
          className="w-full px-3 py-2 rounded bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      <button
        type="submit"
        className="w-full py-2.5 rounded font-medium bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90 transition-opacity"
      >
        Add application
      </button>
    </form>
  );
}
