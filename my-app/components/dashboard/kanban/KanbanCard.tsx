import type { ReactNode } from "react";
import type { KanbanBadge, KanbanCardData } from "@/lib/dashboard/kanban-content";

type KanbanCardProps = {
  card: KanbanCardData;
};

export function KanbanCard({ card }: KanbanCardProps) {
  return (
    <article
      className={`rounded-xl border bg-midnight/80 p-3.5 transition ${
        card.featured
          ? "border-accent/60 shadow-glow-yellow ring-1 ring-accent/25"
          : "border-white/10"
      } ${card.dimmed ? "opacity-50" : ""}`}
    >
      {card.drawerLabel ? (
        <div className="mb-2 flex items-center justify-between border-b border-accent/20 pb-2 text-[10px] font-semibold uppercase tracking-wide text-accent">
          <span>{card.drawerLabel} —</span>
          <button type="button" className="text-white/50 hover:text-white" aria-label="Close drawer">
            ×
          </button>
        </div>
      ) : null}

      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[10px] font-bold tracking-wider text-white/45">{card.company}</p>
          <h4
            className={`mt-0.5 text-sm font-bold leading-snug text-white ${
              card.strikethrough ? "line-through decoration-white/40" : ""
            }`}
          >
            {card.title}
          </h4>
        </div>
        {card.matchPercent != null ? (
          <span className="shrink-0 rounded-md bg-accent/15 px-1.5 py-0.5 text-[10px] font-bold text-accent ring-1 ring-accent/30">
            {card.matchPercent}%
          </span>
        ) : null}
      </div>

      {card.description ? (
        <p className="mt-2 text-xs leading-relaxed text-white/50">{card.description}</p>
      ) : null}

      {card.noteWarning ? (
        <p className="mt-2 text-xs font-medium text-amber-300/90">{card.noteWarning}</p>
      ) : null}

      {card.badges?.length ? (
        <ul className="mt-2 flex flex-wrap gap-1.5">
          {card.badges.map((b) => (
            <li key={b.label}>
              <Badge badge={b} />
            </li>
          ))}
        </ul>
      ) : null}

      {card.progress ? (
        <div className="mt-3">
          <div className="flex justify-between text-[10px] text-white/50">
            <span className="capitalize">{card.progress.label}</span>
            <span className="text-accent">{card.progress.percent}% ready</span>
          </div>
          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand to-accent"
              style={{ width: `${card.progress.percent}%` }}
            />
          </div>
        </div>
      ) : null}

      {card.interviewEvent ? (
        <div className="mt-3 rounded-lg border border-white/10 bg-white/5 p-2.5 text-xs">
          <p className="font-medium text-white/85">{card.interviewEvent.title}</p>
          <p className="mt-1 flex items-center gap-1.5 text-white/50">
            <span aria-hidden>📅</span>
            {card.interviewEvent.when}
          </p>
        </div>
      ) : null}

      {card.offerLine ? (
        <p className="mt-2 text-xs font-semibold text-emerald-400">{card.offerLine}</p>
      ) : null}
      {card.deadline ? (
        <p className="mt-1 text-xs font-medium text-rose-400/90">{card.deadline}</p>
      ) : null}

      <div className="mt-3 flex items-center justify-between gap-2 text-[10px] text-white/40">
        {card.footer ? <span>{card.footer}</span> : <span />}
        {card.actionLink ? (
          <button type="button" className="font-semibold text-accent hover:text-accent-bright">
            {card.actionLink}
          </button>
        ) : null}
      </div>
    </article>
  );
}

function Badge({ badge }: { badge: KanbanBadge }) {
  const styles = {
    accent: "bg-accent/15 text-accent ring-accent/30",
    brand: "bg-brand/20 text-brand-light ring-brand/30",
    warn: "bg-amber-500/15 text-amber-300 ring-amber-500/30",
    muted: "bg-white/5 text-white/55 ring-white/10",
  };
  return (
    <span className={`rounded px-2 py-0.5 text-[10px] font-semibold ring-1 ${styles[badge.tone]}`}>
      {badge.label}
    </span>
  );
}