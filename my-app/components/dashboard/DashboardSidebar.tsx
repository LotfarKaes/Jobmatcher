"use client";

import type { DashboardNavId, DashboardNavItem } from "@/lib/dashboard/content";
import { DashboardNavIcon } from "./DashboardIcons";

type DashboardSidebarProps = {
  items: DashboardNavItem[];
  activeId: DashboardNavId;
  onSelect: (id: DashboardNavId) => void;
  userLabel: string;
};

/** Left menu — each item is a button that tells the parent which panel to show. */
export function DashboardSidebar({
  items,
  activeId,
  onSelect,
  userLabel,
}: DashboardSidebarProps) {
  return (
    <aside
      className="flex w-full shrink-0 flex-col border-b border-white/10 bg-midnight-surface/90 lg:w-64 lg:border-b-0 lg:border-r"
      aria-label="Dashboard menu"
    >
      <div className="border-b border-white/10 px-4 py-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
          Jobmatcher suite
        </p>
        <p className="mt-2 truncate text-sm font-medium text-white/70" title={userLabel}>
          {userLabel}
        </p>
      </div>

      <nav className="flex flex-1 flex-row gap-1 overflow-x-auto p-2 lg:flex-col lg:overflow-visible">
        <ul className="flex min-w-0 flex-1 flex-row gap-1 lg:flex-col">
          {items.map((item) => {
            const active = item.id === activeId;
            return (
              <li key={item.id} className="min-w-[140px] flex-1 lg:min-w-0 lg:flex-none">
                <button
                  type="button"
                  onClick={() => onSelect(item.id)}
                  aria-current={active ? "page" : undefined}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${
                    active
                      ? "bg-brand/25 text-white shadow-inner ring-1 ring-accent/40"
                      : "text-white/60 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <DashboardNavIcon
                    id={item.id}
                    className={`h-5 w-5 shrink-0 ${active ? "text-accent" : "text-white/45"}`}
                  />
                  <span className="truncate">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}