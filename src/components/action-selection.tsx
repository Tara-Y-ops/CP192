"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { type ActionOption, type Cycle } from "@/lib/types";

interface ActionSelectionProps {
  cycle: Cycle;
  initialOptions: ActionOption[];
}

interface CustomActionState {
  title: string;
  description: string;
  estimatedMinutes: number;
  rationale: string;
}

const DEFAULT_CUSTOM_ACTION: CustomActionState = {
  title: "",
  description: "",
  estimatedMinutes: 5,
  rationale: "",
};

export function ActionSelection({ cycle, initialOptions }: ActionSelectionProps) {
  const router = useRouter();
  const [options, setOptions] = useState<ActionOption[]>(initialOptions);
  const [status, setStatus] = useState<"idle" | "loading" | "ready">(
    initialOptions.length ? "ready" : "loading",
  );
  const [error, setError] = useState("");
  const [customAction, setCustomAction] = useState<CustomActionState>(DEFAULT_CUSTOM_ACTION);
  const [isSaving, setIsSaving] = useState(false);

  const hasOptions = useMemo(() => options.length > 0, [options.length]);

  const fetchSuggestions = useCallback(async () => {
    const response = await fetch(`/api/cycles/${cycle.id}/generate-actions`, {
      method: "POST",
    });

    const payload = (await response.json().catch(() => null)) as
      | { options?: ActionOption[]; error?: string }
      | null;

    if (!response.ok || !payload?.options) {
      setError(
        payload?.error ||
          "Unable to generate suggestions right now. You can still write your own action.",
      );
      setStatus("idle");
      return;
    }

    setOptions(payload.options);
    setStatus("ready");
  }, [cycle.id]);

  useEffect(() => {
    if (initialOptions.length === 0) {
      const timer = window.setTimeout(() => {
        void fetchSuggestions();
      }, 0);

      return () => window.clearTimeout(timer);
    }
  }, [fetchSuggestions, initialOptions.length]);

  function generateSuggestions() {
    setStatus("loading");
    setError("");
    void fetchSuggestions();
  }

  async function selectExisting(actionOptionId: string) {
    setIsSaving(true);
    setError("");

    const response = await fetch(`/api/cycles/${cycle.id}/select-action`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind: "existing", actionOptionId }),
    });

    const payload = (await response.json().catch(() => null)) as
      | { error?: string }
      | null;

    if (!response.ok) {
      setError(payload?.error || "Unable to select that action.");
      setIsSaving(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  async function saveCustomAction(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setError("");

    const response = await fetch(`/api/cycles/${cycle.id}/select-action`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind: "custom", ...customAction }),
    });

    const payload = (await response.json().catch(() => null)) as
      | { error?: string }
      | null;

    if (!response.ok) {
      setError(payload?.error || "Unable to save your custom action.");
      setIsSaving(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="grid gap-6">
      <section className="glass-card rounded-[30px] p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent-strong)]">
              Reflection summary
            </p>
            <h2 className="text-2xl font-semibold">What feels possible now?</h2>
            <p className="max-w-2xl text-sm leading-7 text-[var(--muted)]">
              Emotion: <strong>{cycle.emotion}</strong>. Energy: <strong>{cycle.energyLevel}</strong>.
              Blocker: <strong>{cycle.blocker}</strong>. Resistance: <strong>{cycle.resistanceReason}</strong>.
              Desired shift: <strong>{cycle.desiredOutcome}</strong>.
            </p>
          </div>
          <button className="btn-secondary" onClick={generateSuggestions} type="button">
            {status === "loading" ? "Regenerating..." : "Regenerate suggestions"}
          </button>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">AI action options</h3>
            <span className="text-sm text-[var(--muted)]">
              {status === "loading" ? "Generating..." : `${options.length} option(s)`}
            </span>
          </div>
          {!hasOptions ? (
            <div className="glass-card rounded-[28px] p-6 text-sm leading-7 text-[var(--muted)]">
              {status === "loading"
                ? "Building tiny, low-pressure actions..."
                : "No AI suggestions yet. Use the button above or write your own action."}
            </div>
          ) : null}
          {options.map((option) => (
            <article key={option.id} className="glass-card rounded-[28px] p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent-strong)]">
                      {option.source === "ai" ? "AI option" : "Custom"}
                    </span>
                    <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-[var(--muted)]">
                      {option.estimatedMinutes} min
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold">{option.title}</h4>
                    <p className="mt-2 text-sm leading-7 text-[var(--foreground)]/85">
                      {option.description}
                    </p>
                  </div>
                  <p className="text-sm leading-7 text-[var(--muted)]">{option.rationale}</p>
                </div>
                <button
                  className="btn-primary min-w-40 disabled:cursor-not-allowed disabled:opacity-70"
                  type="button"
                  disabled={isSaving}
                  onClick={() => void selectExisting(option.id)}
                >
                  Use this step
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="glass-card rounded-[30px] p-6">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--moss)]">
              Custom action
            </p>
            <h3 className="text-xl font-semibold">Write your own next step</h3>
            <p className="text-sm leading-7 text-[var(--muted)]">
              Use this if none of the AI options fit. Keep it tiny and concrete.
            </p>
          </div>
          <form className="mt-5 grid gap-4" onSubmit={saveCustomAction}>
            <div className="grid gap-2">
              <label className="text-sm font-semibold" htmlFor="custom-title">
                Title
              </label>
              <input
                id="custom-title"
                className="field"
                value={customAction.title}
                onChange={(event) =>
                  setCustomAction((current) => ({ ...current, title: event.target.value }))
                }
                placeholder="Open the doc and write only the title"
                required
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-semibold" htmlFor="custom-description">
                Description
              </label>
              <textarea
                id="custom-description"
                className="field min-h-28"
                value={customAction.description}
                onChange={(event) =>
                  setCustomAction((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
                placeholder="Make the action specific enough that you can do it tonight."
                required
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-semibold" htmlFor="custom-minutes">
                Estimated minutes
              </label>
              <input
                id="custom-minutes"
                className="field"
                type="number"
                min={1}
                max={30}
                value={customAction.estimatedMinutes}
                onChange={(event) =>
                  setCustomAction((current) => ({
                    ...current,
                    estimatedMinutes: Number(event.target.value),
                  }))
                }
                required
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-semibold" htmlFor="custom-rationale">
                Why does this fit your current state?
              </label>
              <textarea
                id="custom-rationale"
                className="field min-h-24"
                value={customAction.rationale}
                onChange={(event) =>
                  setCustomAction((current) => ({
                    ...current,
                    rationale: event.target.value,
                  }))
                }
                placeholder="Example: this is small enough that it does not trigger avoidance."
                required
              />
            </div>
            <button className="btn-primary disabled:cursor-not-allowed disabled:opacity-70" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save custom action"}
            </button>
          </form>
        </div>
      </section>

      {error ? <p className="text-sm text-[var(--accent-strong)]">{error}</p> : null}
    </div>
  );
}
