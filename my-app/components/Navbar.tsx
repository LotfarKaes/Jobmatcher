import Link from "next/link";
import { NavAuth } from "./NavAuth";

const navLinks = [
  { href: "/#home", label: "Home" },
  { href: "/#matches", label: "Matches" },
  { href: "/#features-heading", label: "Features" },
  { href: "/#team-heading", label: "Team" },
] as const;

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-midnight-surface/80 backdrop-blur-xl">
      <nav
        className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4"
        aria-label="Primary"
      >
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-bold text-white transition hover:text-accent"
        >
          <span
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand to-brand-light text-xs font-bold text-white shadow-glow"
            aria-hidden
          >
            JM
          </span>
          Job<span className="text-accent">matcher</span>
        </Link>
        <ul className="hidden items-center gap-6 md:flex">
          {navLinks.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="text-sm font-medium text-white/70 transition-colors hover:text-accent"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <NavAuth />
        </div>
      </nav>
    </header>
  );
}