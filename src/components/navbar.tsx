import Link from "next/link";

export function Navbar() {
  return (
    <nav className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-bold">
          <span className="text-[var(--color-primary)]">Gig</span>Log
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/concerts"
            className="text-sm text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition"
          >
            Concerts
          </Link>
          <Link
            href="/artists"
            className="text-sm text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition"
          >
            Artists
          </Link>
          <Link
            href="/venues"
            className="text-sm text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition"
          >
            Venues
          </Link>
          <Link
            href="/login"
            className="rounded-lg bg-[var(--color-primary)] px-4 py-1.5 text-sm font-semibold text-black hover:bg-[var(--color-primary-dark)] transition"
          >
            Log in
          </Link>
        </div>
      </div>
    </nav>
  );
}
