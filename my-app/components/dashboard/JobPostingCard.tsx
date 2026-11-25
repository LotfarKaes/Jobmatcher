import type { ReactNode } from "react";
import type { DashboardJobMatch } from "@/lib/dashboard/content";

type JobPostingCardProps = {
  job: DashboardJobMatch["job"];
};

/** Left card: role details, metadata, tags (props from content.ts). */
export function JobPostingCard({ job }: JobPostingCardProps) {
  return (
    <article className="glass-panel flex h-full flex-col rounded-2xl p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 gap-3">
          <LogoBox text={job.logoText} />
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-white/45">
              {job.company} • {job.unit}
            </p>
            <h3 className="mt-1 text-base font-bold leading-snug text-white sm:text-lg">
              {job.title}
            </h3>
          </div>
        </div>
        <div className="flex shrink-0 gap-1.5" aria-label="Actions (demo)">
          <IconButton label="Save job">★</IconButton>
          <IconButton label="Share job">↗</IconButton>
        </div>
      </div>

      <ul className="mt-5 space-y-2 text-xs text-white/60 sm:text-sm">
        <li className="flex items-start gap-2">
          <span className="text-accent" aria-hidden>
            ⌖
          </span>
          {job.location}
        </li>
        <li className="flex items-start gap-2">
          <span className="text-accent" aria-hidden>
            €
          </span>
          {job.salary}
        </li>
        <li className="flex items-start gap-2">
          <span className="text-white/40" aria-hidden>
            ◷
          </span>
          {job.indexedAgo}
        </li>
      </ul>

      <ul className="mt-5 flex flex-wrap gap-2">
        {job.tags.map((tag) => {
          const isPrimary = tag === job.primaryTag;
          return (
            <li
              key={tag}
              className={`rounded-md px-2.5 py-1 text-[11px] font-medium ring-1 ${
                isPrimary
                  ? "bg-accent/15 text-accent ring-accent/30"
                  : "bg-white/5 text-white/70 ring-white/10"
              }`}
            >
              {isPrimary ? (
                <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
              ) : null}
              {tag}
            </li>
          );
        })}
      </ul>

      <div className="mt-auto pt-5">
        <span className="inline-block rounded-md bg-brand/30 px-2 py-1 text-[10px] font-semibold text-brand-light ring-1 ring-brand/40">
          ID: {job.jobId}
        </span>
      </div>
    </article>
  );
}

function LogoBox({ text }: { text: string }) {
  return (
    <div
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-midnight text-sm font-bold text-white ring-1 ring-white/15"
      aria-hidden
    >
      {text}
    </div>
  );
}

function IconButton({ children, label }: { children: ReactNode; label: string }) {
  return (
    <button
      type="button"
      className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-xs text-white/70 transition hover:border-accent/40 hover:text-accent"
      aria-label={label}
    >
      {children}
    </button>
  );
}