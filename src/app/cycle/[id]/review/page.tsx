import { notFound, redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { ReviewForm } from "@/components/review-form";
import { getCycleBundleById, getProfile } from "@/lib/demo-store";
import { requireSession } from "@/lib/session";

interface ReviewPageProps {
  params: Promise<{ id: string }>;
}

export default async function ReviewPage({ params }: ReviewPageProps) {
  const session = await requireSession();
  const profile = await getProfile(session.userId);

  if (!profile?.focusArea) {
    redirect("/onboarding");
  }

  const { id } = await params;
  const bundle = await getCycleBundleById(session.userId, id);

  if (!bundle) {
    notFound();
  }

  if (bundle.cycle.status !== "completed") {
    redirect("/dashboard");
  }

  return (
    <AppShell
      title="Review what changed"
      eyebrow="Post-action review"
      sessionLabel={session.displayName}
    >
      <section className="grid gap-6 lg:grid-cols-[1fr_0.85fr]">
        <article className="glass-card rounded-[30px] p-6 md:p-8">
          <ReviewForm cycleId={bundle.cycle.id} />
        </article>
        <article className="glass-card rounded-[30px] p-6 md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--moss)]">
            Completed action
          </p>
          <h2 className="mt-3 text-2xl font-semibold">
            {bundle.selectedAction?.title ?? "Selected action"}
          </h2>
          <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
            {bundle.selectedAction?.description}
          </p>
          <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
            Try to describe what actually happened, not what should have happened. The review
            is evidence, not a performance score.
          </p>
        </article>
      </section>
    </AppShell>
  );
}
