"use client";

import { KANBAN_COLUMNS } from "@/lib/dashboard/kanban-content";
import { KanbanColumn } from "./KanbanColumn";
import { KanbanToolbar } from "./KanbanToolbar";

/** Five-column application pipeline (demo cards). */
export function KanbanBoard() {
  return (
    <section aria-labelledby="kanban-board-heading">
      <p id="kanban-board-heading" className="sr-only">
        Application pipeline and tracker
      </p>
      <KanbanToolbar />
      <div className="mt-5 grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {KANBAN_COLUMNS.map((column) => (
          <KanbanColumn key={column.id} column={column} />
        ))}
      </div>
    </section>
  );
}