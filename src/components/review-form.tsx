"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { type EmotionalShift } from "@/lib/types";

const SHIFTS: EmotionalShift[] = [
  "worse",
  "about the same",
  "a little better",
  "much better",
];

interface ReviewFormProps {
  cycleId: string;
}

export function ReviewForm({ cycleId }: ReviewFormProps) {
  const router = useRouter();
  const [whatHappened, setWhatHappened] = useState("");
  const [emotionalShift, setEmotionalShift] = useState<EmotionalShift>("a little better");
  const [engagementScore, setEngagementScore] = useState(3);
  const [continueWillingness, setContinueWillingness] = useState(3);
  const [feelMoreStable, setFeelMoreStable] = useState(true);
  const [surprisedBy, setSurprisedBy] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    const response = await fetch(`/api/cycles/${cycleId}/review`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        whatHappened,
        emotionalShift,
        engagementScore,
        continueWillingness,
        feelMoreStable,
        surprisedBy,
      }),
    });

    const payload = (await response.json().catch(() => null)) as
      | { error?: string }
      | null;

    if (!response.ok) {
      setError(payload?.error || "Unable to save your review.");
      setIsLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form className="grid gap-5" onSubmit={handleSubmit}>
      <div className="grid gap-2">
        <label className="text-sm font-semibold" htmlFor="what-happened">
          What happened when you tried the action?
        </label>
        <textarea
          id="what-happened"
          className="field min-h-36"
          value={whatHappened}
          onChange={(event) => setWhatHappened(event.target.value)}
          placeholder="What did you actually do? What felt easier or harder than expected?"
          required
        />
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <div className="grid gap-2">
          <label className="text-sm font-semibold" htmlFor="shift">
            Emotional shift
          </label>
          <select
            id="shift"
            className="field"
            value={emotionalShift}
            onChange={(event) => setEmotionalShift(event.target.value as EmotionalShift)}
          >
            {SHIFTS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-semibold" htmlFor="stable">
            Do you feel more stable now?
          </label>
          <select
            id="stable"
            className="field"
            value={feelMoreStable ? "yes" : "no"}
            onChange={(event) => setFeelMoreStable(event.target.value === "yes")}
          >
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <div className="grid gap-2">
          <label className="text-sm font-semibold" htmlFor="engagement">
            Engagement score (1-5)
          </label>
          <input
            id="engagement"
            className="field"
            type="number"
            min={1}
            max={5}
            value={engagementScore}
            onChange={(event) => setEngagementScore(Number(event.target.value))}
          />
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-semibold" htmlFor="continue">
            Willingness to continue (1-5)
          </label>
          <input
            id="continue"
            className="field"
            type="number"
            min={1}
            max={5}
            value={continueWillingness}
            onChange={(event) => setContinueWillingness(Number(event.target.value))}
          />
        </div>
      </div>
      <div className="grid gap-2">
        <label className="text-sm font-semibold" htmlFor="surprised">
          What surprised you?
        </label>
        <textarea
          id="surprised"
          className="field min-h-28"
          value={surprisedBy}
          onChange={(event) => setSurprisedBy(event.target.value)}
          placeholder="What was different from what you expected?"
          required
        />
      </div>
      <button className="btn-primary disabled:cursor-not-allowed disabled:opacity-70" disabled={isLoading}>
        {isLoading ? "Saving review..." : "Finish cycle"}
      </button>
      {error ? <p className="text-sm text-[var(--accent-strong)]">{error}</p> : null}
    </form>
  );
}
