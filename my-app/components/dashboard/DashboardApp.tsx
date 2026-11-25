"use client";

import { useMemo, useState } from "react";
import {
  DASHBOARD_NAV,
  type DashboardNavId,
} from "@/lib/dashboard/content";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardOverview } from "./DashboardOverview";
import { DashboardPlaceholder } from "./DashboardPlaceholder";
import { DashboardSidebar } from "./DashboardSidebar";

type DashboardAppProps = {
  userLabel: string;
};

/**
 * Client shell: sidebar picks the panel, main area shows cards or a placeholder.
 * Props keep the server page small (only passes the signed-in name).
 */
export function DashboardApp({ userLabel }: DashboardAppProps) {
  const [activeId, setActiveId] = useState<DashboardNavId>("dashboard");

  const activeItem = useMemo(
    () => DASHBOARD_NAV.find((item) => item.id === activeId) ?? DASHBOARD_NAV[0],
    [activeId],
  );

  return (
    <div className="flex min-h-[calc(100vh-4.5rem)] flex-col lg:flex-row">
      <DashboardSidebar
        items={DASHBOARD_NAV}
        activeId={activeId}
        onSelect={setActiveId}
        userLabel={userLabel}
      />
      <p className="sr-only">
        Jobmatcher dashboard. Use the menu to switch sections. Data will connect to APIs later.
      </p>
      <div className="flex flex-1 flex-col px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <DashboardHeader
          title={activeId === "dashboard" ? undefined : activeItem.label}
          subtitle={
            activeId === "dashboard" ? undefined : activeItem.description
          }
        />
        <div className="mt-8 flex-1">
          {activeId === "dashboard" ? (
            <DashboardOverview />
          ) : (
            <DashboardPlaceholder item={activeItem} />
          )}
        </div>
      </div>
    </div>
  );
}