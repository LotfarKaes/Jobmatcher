import {
  KANBAN_CARDS,
  type KanbanColumnConfig,
} from "@/lib/dashboard/kanban-content";
import { KanbanCard } from "./KanbanCard";

type KanbanColumnProps = {
  column: KanbanColumnConfig;
};

export function KanbanColumn({ column }: KanbanColumnProps) {
  const cards = KANBAN_CARDS[column.id];
  const count = cards.length;

  const dotClass = {
    white: "bg-white/70",
    accent: "bg-accent",
    muted: "bg-white/30",
  }[column.dot];

  return (
    <div
      className={`flex min-h-[20rem] min-w-0 w-full flex-col rounded-2xl border bg-midnight-surface/60 ${
        column.targetStage
          ? "border-accent/40 shadow-glow-yellow"
          : "border-white/10"
      }`}
    >
      <div className="flex items-center justify-between gap-2 border-b border-white/10 px-3 py-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className={`h-2 w-2 shrink-0 rounded-full ${dotClass}`} aria-hidden />
          <h3 className="truncate text-[11px] font-bold uppercase tracking-wider text-white">
            {column.title}
          </h3>
          <span className="rounded-md bg-white/10 px-1.5 py-0.5 text-[10px] font-bold text-white/70">
            {count}
          </span>
        </div>
        <button
          type="button"
          className="text-white/35 hover:text-white/70"
          aria-label={`${column.title} column menu`}
        >
          ⋮
        </button>
      </div>

      {column.targetStage ? (
        <p className="border-b border-accent/20 bg-accent/5 px-3 py-1 text-center text-[9px] font-bold uppercase tracking-widest text-accent">
          Target stage
        </p>
      ) : null}

      <ul className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto p-3">
        {cards.map((card) => (
          <li key={card.id}>
            <KanbanCard card={card} />
          </li>
        ))}
      </ul>
    </div>
  );
}