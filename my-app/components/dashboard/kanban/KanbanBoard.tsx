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
import {
  KanbanCardDetailModal,
  type KanbanCardSavePayload,
} from "./KanbanCardDetailModal";

type BoardState = Record<KanbanStageId, KanbanCardData[]>;

type Selection = {
  cardId: string;
  stageId: KanbanStageId;
} | null;

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
 * Five-column pipeline with drag-and-drop + view/edit/delete modal (frontend state).
 */
export function KanbanBoard() {
  const [board, setBoard] = useState<BoardState>(copyInitialBoard);
  const [activeCard, setActiveCard] = useState<KanbanCardData | null>(null);
  const [selection, setSelection] = useState<Selection>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor),
  );

  const selectedCard = useMemo(() => {
    if (!selection) {
      return null;
    }
    return board[selection.stageId].find((c) => c.id === selection.cardId) ?? null;
  }, [board, selection]);

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
    setSelection((prev) => (prev?.cardId === cardId ? null : prev));
  }, []);

  const onDragCancel = useCallback(() => setActiveCard(null), []);

  const openCard = useCallback(
    (cardId: string) => {
      const stageId = findColumnForCard(board, cardId);
      if (stageId) {
        setSelection({ cardId, stageId });
      }
    },
    [board],
  );

  const handleSave = useCallback((payload: KanbanCardSavePayload) => {
    const { card, stageId } = payload;
    setBoard((current) => {
      const from = findColumnForCard(current, card.id);
      if (!from) {
        return current;
      }
      if (from === stageId) {
        return {
          ...current,
          [stageId]: current[stageId].map((c) => (c.id === card.id ? card : c)),
        };
      }
      const next: BoardState = {
        ...current,
        [from]: current[from].filter((c) => c.id !== card.id),
      };
      next[stageId] = [...next[stageId], card];
      return next;
    });
    setSelection(null);
  }, []);

  const handleDelete = useCallback((cardId: string) => {
    setBoard((current) => {
      const from = findColumnForCard(current, cardId);
      if (!from) {
        return current;
      }
      return {
        ...current,
        [from]: current[from].filter((c) => c.id !== cardId),
      };
    });
    setSelection(null);
  }, []);

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
            <KanbanColumn
              key={column.id}
              column={column}
              cards={board[column.id]}
              onViewCard={openCard}
            />
          ))}
        </div>

        <DragOverlay dropAnimation={{ duration: 200 }}>
          {activeCard ? (
            <div className="w-[min(100vw-2rem,16rem)] rotate-1 cursor-grabbing shadow-glow-yellow sm:w-64">
              <KanbanCard card={activeCard} showViewButton={false} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {selectedCard && selection ? (
        <KanbanCardDetailModal
          open
          card={selectedCard}
          stageId={selection.stageId}
          onClose={() => setSelection(null)}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      ) : null}
    </section>
  );
}