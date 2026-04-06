"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { FOCUS_AREAS } from "@/lib/focus-areas";

interface FocusAreaEditorProps {
  displayName: string;
  focusArea: string;
  compact?: boolean;
}

export function FocusAreaEditor({
  displayName,
  focusArea,
  compact = false,
}: FocusAreaEditorProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFocusArea, setSelectedFocusArea] = useState(focusArea);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSave() {
    setIsSaving(true);
    setError("");

    const response = await fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        displayName,
        focusArea: selectedFocusArea,
      }),
    });

    const payload = (await response.json().catch(() => null)) as
      | { error?: string }
      | null;

    if (!response.ok) {
      setError(payload?.error || "Unable to update focus area.");
      setIsSaving(false);
      return;
    }

    setIsEditing(false);
    setIsSaving(false);
    startTransition(() => {
      router.refresh();
    });
  }

  if (!isEditing) {
    return (
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className={`${compact ? "text-xl" : "text-base"} font-semibold text-[var(--foreground)]`}>
            {focusArea}
          </p>
        </div>
        <button
          className="btn-secondary w-fit text-sm"
          type="button"
          onClick={() => {
            setSelectedFocusArea(focusArea);
            setIsEditing(true);
          }}
        >
          Edit
        </button>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      <select
        className="field"
        value={selectedFocusArea}
        onChange={(event) => setSelectedFocusArea(event.target.value)}
      >
        {FOCUS_AREAS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <div className="flex flex-wrap gap-3">
        <button
          className="btn-primary text-sm disabled:cursor-not-allowed disabled:opacity-70"
          type="button"
          onClick={() => void handleSave()}
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save"}
        </button>
        <button
          className="btn-secondary text-sm"
          type="button"
          onClick={() => {
            setSelectedFocusArea(focusArea);
            setIsEditing(false);
            setError("");
          }}
          disabled={isSaving}
        >
          Cancel
        </button>
      </div>
      {error ? <p className="text-sm text-[var(--accent-strong)]">{error}</p> : null}
    </div>
  );
}
