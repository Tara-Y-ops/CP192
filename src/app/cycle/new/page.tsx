import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { FocusAreaEditor } from "@/components/focus-area-editor";
import { ReflectionForm } from "@/components/reflection-form";
import { getActiveCycleBundle, getProfile } from "@/lib/demo-store";
import { requireSession } from "@/lib/session";

export default async function NewCyclePage() {
  const session = await requireSession();
  const profile = await getProfile(session.userId);

  if (!profile?.focusArea) {
    redirect("/onboarding");
  }

  const activeCycle = await getActiveCycleBundle(session.userId);

  if (activeCycle) {
    redirect("/dashboard");
  }

  return (
    <AppShell
      title="Start a new reflection"
      eyebrow="Reflection"
      sessionLabel={session.displayName}
    >
      <section className="mx-auto grid w-full max-w-4xl gap-4">
        <article className="glass-card rounded-[30px] px-6 py-5 md:px-8">
          <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
                Current focus
              </p>
              <div className="mt-2">
                <FocusAreaEditor
                  displayName={profile.displayName}
                  focusArea={profile.focusArea}
                />
              </div>
            </div>
          </div>
        </article>
        <article className="glass-card rounded-[30px] p-6 md:p-8">
          <ReflectionForm />
        </article>
      </section>
    </AppShell>
  );
}
