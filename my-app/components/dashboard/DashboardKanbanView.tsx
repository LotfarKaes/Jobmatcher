"use client";

import { DashboardStatsGrid } from "./DashboardStatsGrid";
import { KanbanBoardPreview } from "./KanbanBoardPreview";

/** Kanban menu: telemetry header (in parent) + stats + board preview. */
export function DashboardKanbanView() {
  return (
    <div className="space-y-8">
      <DashboardStatsGrid />
      <KanbanBoardPreview />
    </div>
  );
}