"use client";

import { DashboardStatsGrid } from "./DashboardStatsGrid";
import { KanbanBoard } from "./kanban/KanbanBoard";

/** Kanban menu: stats row + full pipeline board. */
export function DashboardKanbanView() {
  return (
    <div className="space-y-8">
      <DashboardStatsGrid />
      <KanbanBoard />
    </div>
  );
}