import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { OnboardingForm } from "@/components/onboarding-form";
import { getProfile } from "@/lib/demo-store";
import { requireSession } from "@/lib/session";

export default async function OnboardingPage() {
  const session = await requireSession();
  const profile = await getProfile(session.userId);

  if (profile?.focusArea) {
    redirect("/dashboard");
  }

  return (
    <AppShell
      title="Set your current focus"
      sessionLabel={session.displayName}
    >
      <section className="grid gap-6 md:grid-cols-[1.05fr_0.95fr]">
        <article className="glass-card rounded-[30px] p-6 md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
            Before you start
          </p>
          <div className="mt-4 grid gap-3 text-sm leading-7 text-[var(--muted)]">
            <div className="rounded-2xl border border-[var(--line)] bg-[var(--ink-soft)] px-4 py-3">
              Pick one focus area for this session.
            </div>
            <div className="rounded-2xl border border-[var(--line)] bg-[var(--ink-soft)] px-4 py-3">
              AI suggestions are optional. You can write your own action.
            </div>
            <div className="rounded-2xl border border-[var(--line)] bg-[var(--ink-soft)] px-4 py-3">
              After the action, write a short review and return to the dashboard.
            </div>
          </div>
        </article>
        <article className="glass-card rounded-[30px] p-6 md:p-8">
          <OnboardingForm
            displayName={profile?.displayName ?? session.displayName}
            initialFocusArea={profile?.focusArea}
            initialFocusNote={profile?.focusNote ?? ""}
          />
        </article>
      </section>
    </AppShell>
  );
}
