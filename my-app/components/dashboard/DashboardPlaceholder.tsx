import type { DashboardNavItem } from "@/lib/dashboard/content";

type DashboardPlaceholderProps = {
  item: DashboardNavItem;
};

/** Shown for menu items that are not built yet — keeps navigation clear. */
export function DashboardPlaceholder({ item }: DashboardPlaceholderProps) {
  return (
    <section className="glass-panel rounded-2xl p-8 text-center sm:p-12">
      <p className="text-xs font-bold uppercase tracking-widest text-accent">{item.label}</p>
      <h2 className="mt-3 text-xl font-semibold text-white">Coming in the next sprint</h2>
      <p className="mx-auto mt-3 max-w-md text-sm text-white/55">{item.description}</p>
      <p className="mt-6 text-xs text-white/40">
        Front-end menu is ready. Later you will connect Next.js API routes and Supabase here.
      </p>
    </section>
  );
}