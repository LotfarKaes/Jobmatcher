"use client";

import { motion, useReducedMotion } from "framer-motion";
import { DASHBOARD_STATS } from "@/lib/dashboard/content";
import { IconCalendar, IconFolder, IconSpark } from "./DashboardIcons";
import { StatCard } from "./StatCard";

const STAT_ICONS = {
  pipeline: <IconFolder className="h-5 w-5" />,
  match: <IconSpark className="h-5 w-5" />,
  funnel: <IconCalendar className="h-5 w-5" />,
} as const;

/** Three pipeline stat cards (Kanban board page). */
export function DashboardStatsGrid() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      aria-label="Pipeline stats"
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
    >
      {DASHBOARD_STATS.map((stat, index) => (
        <motion.div
          key={stat.id}
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.08, duration: 0.4 }}
        >
          <StatCard
            eyebrow={stat.eyebrow}
            label={stat.label}
            value={stat.value}
            valueSuffix={"valueSuffix" in stat ? stat.valueSuffix : undefined}
            badge={stat.badge}
            trend={"trend" in stat ? stat.trend : undefined}
            trendUp={"trendUp" in stat ? stat.trendUp : undefined}
            hint={stat.hint}
            highlight={"highlight" in stat ? stat.highlight : undefined}
            icon={STAT_ICONS[stat.id as keyof typeof STAT_ICONS]}
          />
        </motion.div>
      ))}
    </motion.section>
  );
}