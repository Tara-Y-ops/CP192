import Link from "next/link";
import { type ReactNode } from "react";

interface AppShellProps {
  title: string;
  eyebrow?: string;
  children: ReactNode;
  sessionLabel?: string;
  actions?: ReactNode;
}

export function AppShell({
  title,
  eyebrow,
  children,
  sessionLabel,
  actions,
}: AppShellProps) {
  return (
    <main className="flex flex-1">
      <div className="page-shell flex w-full flex-col gap-8">
        <header className="glass-card fade-up rounded-[30px] px-5 py-4 md:px-7">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <Link
                href="/"
                className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]"
              >
                Momentum
              </Link>
              <div>
                {eyebrow ? (
                  <p className="text-sm font-medium uppercase tracking-[0.12em] text-[var(--muted)]">
                    {eyebrow}
                  </p>
                ) : null}
                <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h1>
              </div>
            </div>
            <div className="flex flex-col gap-3 md:items-end">
              <nav className="flex flex-wrap gap-2 text-sm font-medium text-[var(--muted)]">
                <Link className="btn-secondary text-sm" href="/dashboard">
                  Dashboard
                </Link>
                <Link className="btn-secondary text-sm" href="/cycle/new">
                  New cycle
                </Link>
                <Link className="btn-secondary text-sm" href="/history">
                  History
                </Link>
              </nav>
              <div className="flex flex-wrap items-center gap-3">
                {sessionLabel ? (
                  <span className="rounded-full border border-[var(--line)] bg-[var(--ink-soft)] px-4 py-2 text-sm text-[var(--muted)]">
                    {sessionLabel}
                  </span>
                ) : null}
                {actions}
              </div>
            </div>
          </div>
        </header>
        {children}
      </div>
    </main>
  );
}
