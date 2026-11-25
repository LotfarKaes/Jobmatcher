"use client";

import { useCallback, useMemo, useState } from "react";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { KANBAN_CARDS, KANBAN_COLUMNS, type KanbanCardData, type KanbanStageId } from "@/lib/dashboard/kanban-content";
import { moveKanbanCard, findColumnForCard } from "@/lib/dashboard/kanban-drag";
import { KanbanColumn } from "./KanbanColumn";
import { KanbanToolbar } from "./KanbanToolbar";
import { KanbanCard } from "./KanbanCard";

type BoardState = Record<KanbanStageId, KanbanCardData[]>;

function copyInitialBoard(): BoardState {
  return {
    saved: [...KANBAN_CARDS.saved],
    applied: [...KANBAN_CARDS.applied],
    interview: [...KANBAN_CARDS.interview],
    offer: [...KANBAN_CARDS.offer],
    rejected: [...KANBAN_CARDS.rejected],
  };
}

/**
 * Five-column pipeline with drag-and-drop.
 * State lives here in React — later you can sync to Supabase on drop.
 */
export function KanbanBoard() {
  const [board, setBoard] = useState<BoardState>(copyInitialBoard);
  const [activeCard, setActiveCard] = useState<KanbanCardData | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor),
  );

  const onDragStart = useCallback((event: DragStartEvent) => {
    const card = event.active.data.current?.card as KanbanCardData | undefined;
    setActiveCard(card ?? null);
  }, []);

  const onDragEnd = useCallback((event: DragEndEvent) => {
    setActiveCard(null);
    const { active, over } = event;
    if (!over) {
      return;
    }

    const cardId = String(active.id);
    const overId = String(over.id);

    setBoard((current) => {
      const next = moveKanbanCard(current, cardId, overId);
      return next ?? current;
    });
  }, []);

  const onDragCancel = useCallback(() => setActiveCard(null), []);

  const activeColumn = useMemo(() => {
    if (!activeCard) {
      return null;
    }
    return findColumnForCard(board, activeCard.id);
  }, [activeCard, board]);

  return (
    <section aria-labelledby="kanban-board-heading">
      <p id="kanban-board-heading" className="sr-only">
        Application pipeline and tracker
      </p>
      <KanbanToolbar />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragCancel={onDragCancel}
      >
        <div className="mt-5 grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {KANBAN_COLUMNS.map((column) => (
            <KanbanColumn key={column.id} column={column} cards={board[column.id]} />
          ))}
        </div>

        <DragOverlay dropAnimation={{ duration: 200 }}>
          {activeCard ? (
            <div className="w-[min(100vw-2rem,16rem)] rotate-1 cursor-grabbing shadow-glow-yellow sm:w-64">
              <KanbanCard card={activeCard} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {activeColumn ? (
        <p className="sr-only" aria-live="polite">
          Dragging {activeCard?.title}
        </p>
      ) : null}
    </section>
  );
}