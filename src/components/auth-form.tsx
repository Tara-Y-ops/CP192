"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AuthForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, displayName }),
    });

    const payload = (await response.json().catch(() => null)) as
      | { next?: string; error?: string }
      | null;

    if (!response.ok || !payload?.next) {
      setError(payload?.error || "Unable to start the demo session.");
      setIsLoading(false);
      return;
    }

    router.push(payload.next);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid gap-2">
        <label className="text-sm font-semibold text-[var(--foreground)]" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          className="field"
          type="email"
          placeholder="you@example.edu"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </div>
      <div className="grid gap-2">
        <label className="text-sm font-semibold text-[var(--foreground)]" htmlFor="displayName">
          Display name
        </label>
        <input
          id="displayName"
          className="field"
          type="text"
          placeholder="Tara"
          value={displayName}
          onChange={(event) => setDisplayName(event.target.value)}
          required
        />
      </div>
      <button className="btn-primary mt-2 disabled:cursor-not-allowed disabled:opacity-70" disabled={isLoading}>
        {isLoading ? "Starting session..." : "Continue"}
      </button>
      {error ? <p className="text-sm text-[var(--accent-strong)]">{error}</p> : null}
      <p className="text-sm leading-7 text-[var(--muted)]">
        This MVP uses a lightweight demo login. Enter any email to create a local session.
      </p>
    </form>
  );
}
