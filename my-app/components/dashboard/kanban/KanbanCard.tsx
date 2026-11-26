import type { ReactNode } from "react";
import type { KanbanBadge, KanbanCardData } from "@/lib/dashboard/kanban-content";

type KanbanCardProps = {
  card: KanbanCardData;
  onView?: (cardId: string) => void;
  showViewButton?: boolean;
};

export function KanbanCard({ card, onView, showViewButton = true }: KanbanCardProps) {
  return (
    <article className="rounded-xl border border-white/10 bg-midnight/80 p-3.5 transition">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[10px] font-bold tracking-wider text-white/45">{card.company}</p>
          <h4 className="mt-0.5 text-sm font-bold leading-snug text-white">{card.title}</h4>
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

      {card.badges?.length ? (
        <ul className="mt-2 flex flex-wrap gap-1.5">
          {card.badges.map((b) => (
            <li key={b.label}>
              <Badge badge={b} />
            </li>
          ))}
        </ul>
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

      {card.deadline ? (
        <p className="mt-1 text-xs font-medium text-rose-400/90">{card.deadline}</p>
      ) : null}

      <div className="mt-3 flex items-center justify-between gap-2 text-[10px] text-white/40">
        {card.footer ? <span>{card.footer}</span> : <span />}
        <div className="flex items-center gap-2">
          {showViewButton && onView ? (
            <button
              type="button"
              className="rounded-md border border-white/15 bg-white/5 px-2 py-1 text-[10px] font-semibold text-white/80 hover:border-accent/50 hover:text-accent"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => onView(card.id)}
            >
              View
            </button>
          ) : null}
          {card.actionLink ? (
            <button type="button" className="font-semibold text-accent hover:text-accent-bright">
              {card.actionLink}
            </button>
          ) : null}
        </div>
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