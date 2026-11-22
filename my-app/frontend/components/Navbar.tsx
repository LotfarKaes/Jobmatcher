import Link from "next/link";

const links = [
  { href: "#home", label: "Home" },
  { href: "#features", label: "Features" },
  { href: "#dashboard", label: "Dashboard" },
] as const;

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
        <ul className="flex gap-6 text-sm font-medium text-slate-600">
          {links.map(({ href, label }) => (
            <li key={href}>
              <a href={href} className="hover:text-brand transition-colors">
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}