import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { getProfile } from "@/lib/demo-store";
import { getOptionalSession } from "@/lib/session";

export default async function AuthPage() {
  const session = await getOptionalSession();

  if (session) {
    const profile = await getProfile(session.userId);
    redirect(profile?.focusArea ? "/dashboard" : "/onboarding");
  }

  return (
    <main className="flex flex-1">
      <div className="page-shell flex w-full items-center justify-center">
        <div className="glass-card fade-up grid max-w-4xl gap-8 rounded-[34px] p-6 md:grid-cols-[0.95fr_1.05fr] md:p-10">
          <section className="rounded-[28px] border border-[var(--line)] bg-[var(--ink-soft)] p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
              Step 1
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight">
              Sign in to continue.
            </h1>
            <p className="mt-5 text-sm leading-7 text-[var(--muted)]">
              This is a local demo login. Use any email address to create a session and move to onboarding.
            </p>
          </section>
          <section className="space-y-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
                Session
              </p>
              <h2 className="mt-2 text-3xl font-semibold">Enter name and email</h2>
            </div>
            <AuthForm />
          </section>
        </div>
      </div>
    </main>
  );
}
