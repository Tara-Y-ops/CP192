"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FOCUS_AREAS } from "@/lib/focus-areas";

interface OnboardingFormProps {
  displayName: string;
  initialFocusArea?: string;
}

export function OnboardingForm({
  displayName,
  initialFocusArea = FOCUS_AREAS[0],
}: OnboardingFormProps) {
  const router = useRouter();
  const [name, setName] = useState(displayName);
  const [focusArea, setFocusArea] = useState(initialFocusArea);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    const response = await fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ displayName: name, focusArea }),
    });

    const payload = (await response.json().catch(() => null)) as
      | { error?: string }
      | null;

    if (!response.ok) {
      setError(payload?.error || "Unable to save onboarding.");
      setIsLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      <div className="grid gap-2">
        <label className="text-sm font-semibold" htmlFor="name">
          What should Momentum call you?
        </label>
        <input
          id="name"
          className="field"
          value={name}
          onChange={(event) => setName(event.target.value)}
          maxLength={60}
          required
        />
      </div>
      <div className="grid gap-2">
        <label className="text-sm font-semibold" htmlFor="focusArea">
          What feels most relevant right now?
        </label>
        <select
          id="focusArea"
          className="field"
          value={focusArea}
          onChange={(event) => setFocusArea(event.target.value)}
        >
          {FOCUS_AREAS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      <div className="rounded-[24px] border border-[var(--line)] bg-white/60 p-4 text-sm leading-7 text-[var(--muted)]">
        Momentum is not asking for a big plan. It helps you name what feels blocked, pick
        one low-risk action, and review what changed after doing it.
      </div>
      <button className="btn-primary disabled:cursor-not-allowed disabled:opacity-70" disabled={isLoading}>
        {isLoading ? "Saving..." : "Enter dashboard"}
      </button>
      {error ? <p className="text-sm text-[var(--accent-strong)]">{error}</p> : null}
    </form>
  );
}
