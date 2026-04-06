import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { StatusBadge } from "@/components/status-badge";
import { getHistory, getProfile } from "@/lib/demo-store";
import { requireSession } from "@/lib/session";

export default async function HistoryPage() {
  const session = await requireSession();
  const profile = await getProfile(session.userId);
  const history = await getHistory(session.userId);

  return (
    <AppShell
      title="Cycle history"
      eyebrow="History"
      sessionLabel={session.displayName}
    >
      <section className="grid gap-4">
        {!profile?.focusArea ? (
          <article className="glass-card rounded-[30px] p-6">
            <p className="text-sm leading-7 text-[var(--muted)]">
              Finish onboarding before using history.
            </p>
          </article>
        ) : null}

        {history.length === 0 ? (
          <article className="glass-card rounded-[30px] p-6">
            <p className="text-sm leading-7 text-[var(--muted)]">
              No cycles yet. Start your first reflection to build history.
            </p>
            <Link className="btn-primary mt-4" href="/cycle/new">
              Start the first cycle
            </Link>
          </article>
        ) : null}

        {history.map((entry) => (
          <article key={entry.cycle.id} className="glass-card rounded-[30px] p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <StatusBadge status={entry.cycle.status} />
                  <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-[var(--muted)]">
                    {new Date(entry.cycle.updatedAt).toLocaleString()}
                  </span>
                </div>
                <h2 className="text-2xl font-semibold capitalize">{entry.cycle.theme}</h2>
                <p className="text-sm leading-7 text-[var(--muted)]">
                  Emotion: <strong className="text-[var(--foreground)]">{entry.cycle.emotion}</strong>.
                  Blocker: <strong className="text-[var(--foreground)]">{entry.cycle.blocker}</strong>.
                </p>
                {entry.selectedAction ? (
                  <p className="text-sm leading-7 text-[var(--muted)]">
                    <strong className="text-[var(--foreground)]">Action:</strong>{" "}
                    {entry.selectedAction.title}
                  </p>
                ) : null}
                {entry.review ? (
                  <p className="text-sm leading-7 text-[var(--muted)]">
                    <strong className="text-[var(--foreground)]">Review:</strong>{" "}
                    {entry.review.whatHappened}
                  </p>
                ) : null}
              </div>
              <div className="flex flex-wrap gap-3">
                {entry.cycle.status === "reflecting" ? (
                  <Link className="btn-secondary" href={`/cycle/${entry.cycle.id}/action`}>
                    Continue action step
                  </Link>
                ) : null}
                {entry.cycle.status === "completed" ? (
                  <Link className="btn-secondary" href={`/cycle/${entry.cycle.id}/review`}>
                    Finish review
                  </Link>
                ) : null}
              </div>
            </div>
          </article>
        ))}
      </section>
    </AppShell>
  );
}
