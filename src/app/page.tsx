import Link from "next/link";
import { getOptionalSession } from "@/lib/session";

export default async function Home() {
  const session = await getOptionalSession();

  return (
    <main className="flex flex-1 items-center justify-center">
      <div className="page-shell flex w-full flex-col gap-6">
        <section className="glass-card fade-up rounded-[30px] px-6 py-7 md:px-8 md:py-8">
          <div className="grid gap-6 md:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-5">
              <p className="status-pill status-pending w-fit">MVP1</p>
              <div className="space-y-3">
                <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
                  Focus on the next small step.
                </h1>
                <p className="max-w-2xl text-base leading-8 text-[var(--muted)]">
                  This demo keeps the loop simple: reflect, choose one action, then review.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link className="btn-primary" href={session ? "/dashboard" : "/auth"}>
                  {session ? "Go to dashboard" : "Start"}
                </Link>
                <Link className="btn-secondary" href={session ? "/cycle/new" : "/auth"}>
                  New cycle
                </Link>
              </div>
            </div>
            <div className="rounded-[24px] border border-[var(--line)] bg-[var(--ink-soft)] p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
                Flow
              </p>
              <ol className="mt-4 grid gap-3 text-sm leading-7 text-[var(--foreground)]">
                <li className="rounded-2xl border border-[var(--line)] bg-[#fdfaf4] px-4 py-3">1. Fill in the reflection form</li>
                <li className="rounded-2xl border border-[var(--line)] bg-[#fdfaf4] px-4 py-3">2. Choose an AI suggestion or write your own action</li>
                <li className="rounded-2xl border border-[var(--line)] bg-[#fdfaf4] px-4 py-3">3. Mark it complete and write a short review</li>
              </ol>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
