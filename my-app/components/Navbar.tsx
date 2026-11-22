import Link from "next/link";
import { NavAuth } from "./NavAuth";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <nav
        className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4"
        aria-label="Primary"
      >
        <Link
          href="/"
          className="text-lg font-semibold text-brand-dark hover:text-brand"
        >
          Jobmatcher
        </Link>
        <ul className="flex flex-wrap items-center gap-4 sm:gap-6">
          <li>
            <Link
              href="/"
              className="text-sm font-medium text-slate-600 hover:text-brand transition-colors"
            >
              Home
            </Link>
          </li>
          <li>
            <NavAuth />
          </li>
        </ul>
      </nav>
    </header>
  );
}