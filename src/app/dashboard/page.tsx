import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { FocusAreaEditor } from "@/components/focus-area-editor";
import { StatusBadge } from "@/components/status-badge";
import { getDashboardSummary } from "@/lib/demo-store";
import { requireSession } from "@/lib/session";

export default async function DashboardPage() {
  const session = await requireSession();
  const summary = await getDashboardSummary(session.userId);
  const activeCycle = summary.activeCycle;
  const latestReviewed = summary.latestReviewedCycle;
  const nextStepTitle = !activeCycle
    ? "No active cycle"
    : activeCycle.cycle.status === "pending"
      ? "Action in progress"
      : summary.nextStep.label;
  const nextStepDescription = !activeCycle
    ? "Start a new reflection to create the next action."
    : activeCycle.cycle.status === "pending"
      ? "Finish the selected action, then use the button below once you are done."
      : summary.nextStep.description;

  return (
    <AppShell
      title="Dashboard"
      sessionLabel={session.displayName}
    >
      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <article className="glass-card rounded-[32px] p-6 md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
                Next step
              </p>
              <h2 className="text-3xl font-semibold">{nextStepTitle}</h2>
              <p className="max-w-2xl text-sm leading-7 text-[var(--muted)]">{nextStepDescription}</p>
            </div>
            {activeCycle ? <StatusBadge status={activeCycle.cycle.status} /> : null}
          </div>

          <div className="mt-6 rounded-[28px] border border-[var(--line)] bg-white/68 p-5">
            {activeCycle ? (
              <div className="grid gap-4">
                <div className="grid gap-2 text-sm leading-7 text-[var(--muted)]">
                  <p>
                    <strong className="text-[var(--foreground)]">Theme:</strong>{" "}
                    {activeCycle.cycle.theme}
                  </p>
                  <p>
                    <strong className="text-[var(--foreground)]">Emotion:</strong>{" "}
                    {activeCycle.cycle.emotion}
                  </p>
                  <p>
                    <strong className="text-[var(--foreground)]">Blocker:</strong>{" "}
                    {activeCycle.cycle.blocker}
                  </p>
                  {activeCycle.selectedAction ? (
                    <p>
                      <strong className="text-[var(--foreground)]">Selected action:</strong>{" "}
                      {activeCycle.selectedAction.title}
                    </p>
                  ) : null}
                </div>
                <div className="flex flex-wrap gap-3">
                  {activeCycle.cycle.status === "pending" ? (
                    <form action={`/api/cycles/${activeCycle.cycle.id}/complete`} method="post">
                      <button className="btn-secondary" type="submit">
                        I finished the action
                      </button>
                    </form>
                  ) : (
                    <Link className="btn-primary" href={summary.nextStep.href}>
                      {summary.nextStep.label}
                    </Link>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-3">
                <Link className="btn-primary" href="/cycle/new">
                  Start a reflection
                </Link>
                <Link className="btn-secondary" href="/history">
                  View history
                </Link>
              </div>
            )}
          </div>
        </article>

        <div className="grid gap-6">
          <article className="glass-card rounded-[30px] p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
              Focus area
            </p>
            {summary.profile ? (
              <div className="mt-3">
                <FocusAreaEditor
                  displayName={summary.profile.displayName}
                  focusArea={summary.profile.focusArea}
                  compact
                />
              </div>
            ) : (
              <h3 className="mt-3 text-2xl font-semibold">Not set yet</h3>
            )}
          </article>

          <article className="glass-card rounded-[30px] p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
              Last review
            </p>
            {latestReviewed ? (
              <div className="mt-4 space-y-3 text-sm leading-7 text-[var(--muted)]">
                <StatusBadge status={latestReviewed.cycle.status} />
                <p>
                  <strong className="text-[var(--foreground)]">Action:</strong>{" "}
                  {latestReviewed.selectedAction?.title ?? "No action selected"}
                </p>
                <p>
                  <strong className="text-[var(--foreground)]">Shift:</strong>{" "}
                  {latestReviewed.review?.emotionalShift ?? "No review yet"}
                </p>
                <p>{latestReviewed.review?.whatHappened}</p>
              </div>
            ) : (
              <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
                Complete one cycle to see the latest review here.
              </p>
            )}
          </article>
        </div>
      </section>
    </AppShell>
  );
}
