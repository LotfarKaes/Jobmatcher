"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import type { KanbanCardData } from "@/lib/dashboard/kanban-content";
import { KanbanCard } from "./KanbanCard";

type KanbanDraggableCardProps = {
  card: KanbanCardData;
  onView: (cardId: string) => void;
};

/** Makes one Kanban card draggable (used inside DndContext). */
export function KanbanDraggableCard({ card, onView }: KanbanDraggableCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: card.id,
    data: { card },
  });

  const style = transform
    ? { transform: CSS.Translate.toString(transform) }
    : undefined;

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`list-none touch-none ${isDragging ? "z-10 opacity-40" : ""}`}
    >
      <div
        className="cursor-grab active:cursor-grabbing"
        {...listeners}
        {...attributes}
      >
        <KanbanCard card={card} onView={onView} />
      </div>
    </li>
  );
}