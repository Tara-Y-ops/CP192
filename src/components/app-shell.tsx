"use client";

import Link from "next/link";
import { type ReactNode, useState, useRef, useEffect } from "react";

interface AppShellProps {
  title: string;
  children: ReactNode;
  sessionLabel?: string;
}

export function AppShell({
  title,
  children,
  sessionLabel,
}: AppShellProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <main className="flex flex-1 flex-col">
      {/* Header - Compact */}
      <header className="border-b border-[var(--line)] bg-[var(--card)]/80 backdrop-blur-sm">
        <div className="page-shell flex h-14 items-center justify-between gap-4 py-0">
          {/* Left: Logo */}
          <Link
            href="/"
            className="text-base font-semibold tracking-tight text-[var(--foreground)]"
          >
            Momentum
          </Link>

          {/* Center: Navigation (Desktop) */}
          <nav className="hidden md:flex items-center gap-0.5">
            <Link className="nav-link-compact" href="/dashboard">
              Dashboard
            </Link>
            <Link className="nav-link-compact" href="/cycle/new">
              New cycle
            </Link>
            <Link className="nav-link-compact" href="/history">
              History
            </Link>
          </nav>

          {/* Right: User */}
          {sessionLabel ? (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                className="user-avatar-compact"
                title="Menu"
              >
                {sessionLabel.charAt(0).toUpperCase()}
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-32 rounded-lg border border-[var(--line)] bg-[var(--card)] shadow-lg py-1 z-50">
                  <form action="/api/auth/logout" method="post">
                    <button
                      type="submit"
                      className="w-full px-4 py-2 text-left text-sm text-[var(--foreground)] hover:bg-[var(--accent)]/50 transition-colors"
                    >
                      Log out
                    </button>
                  </form>
                </div>
              )}
            </div>
          ) : (
            <div className="w-8" />
          )}
        </div>

        {/* Mobile Navigation */}
        <nav className="page-shell flex md:hidden items-center justify-between gap-2 pb-3 pt-0">
          <Link className="nav-link-mobile-compact" href="/dashboard">
            Dashboard
          </Link>
          <Link className="nav-link-mobile-compact" href="/cycle/new">
            New cycle
          </Link>
          <Link className="nav-link-mobile-compact" href="/history">
            History
          </Link>
        </nav>
      </header>

      {/* Page Content */}
      <div className="page-shell page-content flex w-full flex-col gap-8">
        {/* Page Title */}
        <div className="fade-up">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            {title}
          </h1>
        </div>

        {children}
      </div>
    </main>
  );
}
