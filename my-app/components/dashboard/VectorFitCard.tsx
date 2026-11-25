"use client";

import { useId } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { DashboardJobMatch } from "@/lib/dashboard/content";

type VectorFitCardProps = {
  fit: DashboardJobMatch["fit"];
  animateRing?: boolean;
};

/** Right card: circular match % + fit copy (yellow ring = theme accent). */
export function VectorFitCard({ fit, animateRing = true }: VectorFitCardProps) {
  const reduceMotion = useReducedMotion();
  const gradientId = useId();
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (fit.percent / 100) * circumference;

  return (
    <article className="glass-panel flex h-full flex-col rounded-2xl p-5 sm:flex-row sm:items-center sm:gap-6 sm:p-6">
      <div className="relative mx-auto flex h-36 w-36 shrink-0 items-center justify-center sm:mx-0">
        <svg className="-rotate-90" width="144" height="144" viewBox="0 0 144 144" aria-hidden>
          <circle
            cx="72"
            cy="72"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="10"
          />
          <motion.circle
            cx="72"
            cy="72"
            r={radius}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={
              animateRing && !reduceMotion
                ? { strokeDashoffset: circumference }
                : { strokeDashoffset: offset }
            }
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: reduceMotion ? 0.2 : 1, ease: [0.22, 1, 0.36, 1] }}
          />
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#facc15" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute text-center">
          <p className="text-3xl font-black tabular-nums text-white">{fit.percent}%</p>
          <p className="text-[9px] font-bold uppercase tracking-widest text-white/45">
            {fit.ringLabel}
          </p>
        </div>
      </div>

      <div className="mt-4 flex-1 sm:mt-0">
        <span className="inline-flex items-center gap-1.5 rounded-md bg-accent/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-accent ring-1 ring-accent/35">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
          {fit.fitBadge}
        </span>
        <h3 className="mt-3 text-lg font-bold text-white">{fit.headline}</h3>
        <p className="mt-2 text-sm leading-relaxed text-white/55">{fit.summary}</p>
      </div>
    </article>
  );
}