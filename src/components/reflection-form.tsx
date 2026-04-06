"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { type EffortLevel, type EnergyLevel, type ThemeOption } from "@/lib/types";

const THEMES: Array<{ value: ThemeOption; label: string }> = [
  { value: "interest", label: "Interest" },
  { value: "career", label: "Career" },
  { value: "relationships", label: "Relationships" },
  { value: "habits", label: "Habits" },
  { value: "values", label: "Values" },
];

const EMOTIONS = ["anxious", "tired", "frustrated", "guilty", "stuck", "low", "calm"];
const ENERGY_LEVELS: Array<{ value: EnergyLevel; label: string }> = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];
const BLOCKERS = [
  "homework",
  "applications",
  "replying to someone",
  "starting a project",
  "making a decision",
  "maintaining a habit",
];
const RESISTANCE_REASONS = [
  "too tired",
  "afraid of doing badly",
  "do not know where to start",
  "task feels too big",
  "no motivation",
  "worried about the outcome",
];
const DESIRED_OUTCOMES = [
  "calm down",
  "restart",
  "make progress",
  "test interest",
  "regain some control",
];

const EFFORT_LEVELS: EffortLevel[] = [
  "2 minutes",
  "5 minutes",
  "10 minutes",
  "only prepare",
  "only make a draft",
  "only break it down",
];

export function ReflectionForm() {
  const router = useRouter();
  const [theme, setTheme] = useState<ThemeOption>("interest");
  const [emotion, setEmotion] = useState("stuck");
  const [energyLevel, setEnergyLevel] = useState<EnergyLevel>("low");
  const [blocker, setBlocker] = useState("starting a project");
  const [resistanceReason, setResistanceReason] = useState("do not know where to start");
  const [effortLevel, setEffortLevel] = useState<EffortLevel>("5 minutes");
  const [desiredOutcome, setDesiredOutcome] = useState("restart");
  const [reflectionText, setReflectionText] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    const response = await fetch("/api/cycles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        theme,
        emotion,
        energyLevel,
        blocker,
        resistanceReason,
        effortLevel,
        desiredOutcome,
        reflectionText,
      }),
    });

    const payload = (await response.json().catch(() => null)) as
      | { id?: string; error?: string }
      | null;

    if (!response.ok || !payload?.id) {
      setError(payload?.error || "Unable to create a cycle.");
      setIsLoading(false);
      return;
    }

    router.push(`/cycle/${payload.id}/action`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      <div className="rounded-[16px] border border-[var(--line)] bg-[var(--ink-soft)] px-4 py-3 text-sm leading-7 text-[var(--muted)]">
        Use short answers. The goal here is to identify your current state and what kind of
        next step would feel possible now.
      </div>
      <div className="grid gap-2">
        <label className="text-sm font-semibold">Theme</label>
        <select
          className="field"
          value={theme}
          onChange={(event) => setTheme(event.target.value as ThemeOption)}
        >
          {THEMES.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>
      <div className="grid gap-2 lg:grid-cols-3">
        <div className="grid gap-2">
          <label className="text-sm font-semibold">How do I feel right now?</label>
          <select className="field" value={emotion} onChange={(event) => setEmotion(event.target.value)}>
            {EMOTIONS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-semibold">What is my energy level right now?</label>
          <select
            className="field"
            value={energyLevel}
            onChange={(event) => setEnergyLevel(event.target.value as EnergyLevel)}
          >
            {ENERGY_LEVELS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-semibold">What feels most blocked?</label>
          <select className="field" value={blocker} onChange={(event) => setBlocker(event.target.value)}>
            {BLOCKERS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid gap-2 md:grid-cols-2">
        <div className="grid gap-2">
          <label className="text-sm font-semibold">Why do I not want to begin?</label>
          <select
            className="field"
            value={resistanceReason}
            onChange={(event) => setResistanceReason(event.target.value)}
          >
            {RESISTANCE_REASONS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-semibold">What amount feels possible?</label>
          <select
            className="field"
            value={effortLevel}
            onChange={(event) => setEffortLevel(event.target.value as EffortLevel)}
          >
            {EFFORT_LEVELS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid gap-2">
          <label className="text-sm font-semibold">What should the next step help with?</label>
          <select
            className="field"
            value={desiredOutcome}
            onChange={(event) => setDesiredOutcome(event.target.value)}
          >
            {DESIRED_OUTCOMES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
      </div>
      <div className="grid gap-2">
        <label className="text-sm font-semibold">
          What am I avoiding, or what context matters here?
        </label>
        <textarea
          className="field min-h-36"
          placeholder="Example: I keep thinking about starting my research proposal, but every time I open the doc I feel guilty for being behind. I mostly need a step small enough that I will actually begin."
          value={reflectionText}
          onChange={(event) => setReflectionText(event.target.value)}
          required
        />
      </div>
      <button className="btn-primary disabled:cursor-not-allowed disabled:opacity-70" disabled={isLoading}>
        {isLoading ? "Creating cycle..." : "Generate next-step options"}
      </button>
      {error ? <p className="text-sm text-[var(--accent-strong)]">{error}</p> : null}
    </form>
  );
}
