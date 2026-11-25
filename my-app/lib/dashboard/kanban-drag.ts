import type { KanbanCardData, KanbanStageId } from "./kanban-content";

export const KANBAN_STAGE_IDS: KanbanStageId[] = [
  "saved",
  "applied",
  "interview",
  "offer",
  "rejected",
];

export function isKanbanStageId(value: string): value is KanbanStageId {
  return KANBAN_STAGE_IDS.includes(value as KanbanStageId);
}

/** Find which column currently holds a card. */
export function findColumnForCard(
  board: Record<KanbanStageId, KanbanCardData[]>,
  cardId: string,
): KanbanStageId | null {
  for (const stage of KANBAN_STAGE_IDS) {
    if (board[stage].some((card) => card.id === cardId)) {
      return stage;
    }
  }
  return null;
}

/**
 * Move a card to another column (or reorder in the same column).
 * `overId` is either a stage id (empty column area) or another card id.
 */
export function moveKanbanCard(
  board: Record<KanbanStageId, KanbanCardData[]>,
  cardId: string,
  overId: string,
): Record<KanbanStageId, KanbanCardData[]> | null {
  const from = findColumnForCard(board, cardId);
  if (!from) {
    return null;
  }

  const card = board[from].find((c) => c.id === cardId);
  if (!card) {
    return null;
  }

  let to: KanbanStageId;
  if (isKanbanStageId(overId)) {
    to = overId;
  } else {
    const overColumn = findColumnForCard(board, overId);
    if (!overColumn) {
      return null;
    }
    to = overColumn;
  }

  const withoutCard: Record<KanbanStageId, KanbanCardData[]> = {
    ...board,
    [from]: board[from].filter((c) => c.id !== cardId),
  };

  const destination = [...withoutCard[to]];

  if (isKanbanStageId(overId)) {
    destination.push(card);
  } else if (from === to) {
    const fromList = [...board[from]];
    const oldIndex = fromList.findIndex((c) => c.id === cardId);
    const newIndex = fromList.findIndex((c) => c.id === overId);
    if (oldIndex < 0 || newIndex < 0) {
      destination.push(card);
    } else {
      const reordered = fromList.filter((c) => c.id !== cardId);
      reordered.splice(newIndex, 0, card);
      withoutCard[to] = reordered;
      return withoutCard;
    }
  } else {
    const insertAt = destination.findIndex((c) => c.id === overId);
    destination.splice(insertAt >= 0 ? insertAt : destination.length, 0, card);
  }

  return { ...withoutCard, [to]: destination };
}