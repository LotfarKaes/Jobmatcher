"use client";

import { useState } from "react";

/** Board title, actions, and filter row (demo — client state for search only). */
export function KanbanToolbar() {
  const [query, setQuery] = useState("");

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-bold text-white sm:text-2xl">
          Application pipeline <span className="text-accent">&amp; tracker</span>
        </h2>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-brand/40 hover:text-white"
          >
            Match velocity
          </button>
          <button
            type="button"
            className="rounded-xl bg-accent px-4 py-2 text-sm font-bold text-midnight shadow-glow-yellow transition hover:bg-accent-bright"
          >
            + Add application
          </button>
        </div>
      </div>

      <div className="glass-panel flex flex-col gap-3 rounded-2xl p-3 sm:flex-row sm:flex-wrap sm:items-center">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter by company or role…"
          className="min-w-[12rem] flex-1 rounded-lg border border-white/10 bg-midnight px-3 py-2 text-sm text-white placeholder:text-white/35 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        />
        <FilterSelect label="Status" options={["All", "Active", "Closed"]} />
        <FilterSelect label="Tier" options={["All", "High", "Mid"]} />
        <FilterSelect label="Sort" options={["Recent", "Match %", "Company"]} />
        {query ? (
          <span className="text-xs text-white/45 sm:ml-auto">
            Filtering: &quot;{query}&quot; (UI demo)
          </span>
        ) : null}
      </div>
    </div>
  );
}

function FilterSelect({ label, options }: { label: string; options: string[] }) {
  return (
    <label className="flex items-center gap-2 text-xs text-white/55">
      <span className="sr-only">{label}</span>
      <span aria-hidden>{label}</span>
      <select className="rounded-lg border border-white/10 bg-midnight px-2 py-2 text-sm text-white focus:border-accent focus:outline-none">
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}