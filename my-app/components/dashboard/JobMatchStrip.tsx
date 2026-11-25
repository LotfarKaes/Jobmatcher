"use client";

import type { ReactNode } from "react";
import { useId } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { DashboardJobMatch } from "@/lib/dashboard/content";
import { JobStripActions } from "./JobStripActions";

type JobMatchStripProps = {
  match: DashboardJobMatch;
  index?: number;
};

/**
 * One row = job details + fit score in a single card (no gap between sides).
 */
export function JobMatchStrip({ match, index = 0 }: JobMatchStripProps) {
  const { job, fit } = match;
  const reduceMotion = useReducedMotion();
  const gradientId = useId();
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (fit.percent / 100) * circumference;

  return (
    <motion.article
      className="glass-panel overflow-hidden rounded-2xl"
      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
    >
      <div className="flex flex-col sm:flex-row sm:items-stretch">
        <JobStripActions jobId={job.jobId} />
        <div className="flex min-w-0 flex-1 flex-col lg:flex-row lg:items-stretch">
        {/* Job block */}
        <div className="min-w-0 flex-1 p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 gap-3">
              <LogoBox text={job.logoText} />
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-white/45">
                  {job.company} • {job.unit}
                </p>
                <h3 className="mt-0.5 text-base font-bold leading-tight text-white sm:text-lg">
                  {job.title}
                </h3>
              </div>
            </div>
            <div className="flex shrink-0 gap-1.5 lg:hidden" aria-label="Actions (demo)">
              <IconButton label="Save">★</IconButton>
              <IconButton label="Share">↗</IconButton>
            </div>
          </div>

          <ul className="mt-4 space-y-1.5 text-xs text-white/60 sm:text-sm">
            <li className="flex items-start gap-2">
              <span className="text-accent" aria-hidden>
                ⌖
              </span>
              {job.location}
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent" aria-hidden>
                €
              </span>
              {job.salary}
            </li>
            <li className="flex items-start gap-2">
              <span className="text-white/40" aria-hidden>
                ◷
              </span>
              {job.indexedAgo}
            </li>
          </ul>

          <ul className="mt-4 flex flex-wrap gap-2">
            {job.tags.map((tag) => {
              const isPrimary = tag === job.primaryTag;
              return (
                <li
                  key={tag}
                  className={`rounded-md px-2.5 py-1 text-[11px] font-medium ring-1 ${
                    isPrimary
                      ? "bg-accent/15 text-accent ring-accent/30"
                      : "bg-white/5 text-white/70 ring-white/10"
                  }`}
                >
                  {isPrimary ? (
                    <span
                      className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-accent"
                      aria-hidden
                    />
                  ) : null}
                  {tag}
                </li>
              );
            })}
          </ul>

          <div className="mt-4 flex items-center justify-between gap-2">
            <span className="rounded-md bg-brand/30 px-2 py-1 text-[10px] font-semibold text-brand-light ring-1 ring-brand/40">
              ID: {job.jobId}
            </span>
            <div className="hidden gap-1.5 lg:flex" aria-label="Actions (demo)">
              <IconButton label="Save">★</IconButton>
              <IconButton label="Share">↗</IconButton>
            </div>
          </div>
        </div>

        {/* Fit block — flush with job block, no outer gap */}
        <div className="flex flex-row items-start gap-3 border-t border-white/10 bg-midnight/40 p-4 sm:gap-3 sm:p-5 lg:w-[min(100%,26rem)] lg:shrink-0 lg:items-center lg:border-l lg:border-t-0 lg:py-5 lg:pl-4 lg:pr-5">
          <motion.div
            className="relative mx-auto flex h-[7.5rem] w-[7.5rem] shrink-0 items-center justify-center sm:mx-0"
            initial={false}
          >
            <svg
              className="-rotate-90"
              width="120"
              height="120"
              viewBox="0 0 120 120"
              aria-hidden
            >
              <circle
                cx="60"
                cy="60"
                r={radius}
                fill="none"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="9"
              />
              <motion.circle
                cx="60"
                cy="60"
                r={radius}
                fill="none"
                stroke={`url(#${gradientId})`}
                strokeWidth="9"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={
                  reduceMotion ? { strokeDashoffset: offset } : { strokeDashoffset: circumference }
                }
                whileInView={{ strokeDashoffset: offset }}
                viewport={{ once: true }}
                transition={{ duration: reduceMotion ? 0.2 : 0.85, ease: [0.22, 1, 0.36, 1] }}
              />
              <defs>
                <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#facc15" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute text-center leading-none">
              <p className="text-2xl font-black tabular-nums text-white">{fit.percent}%</p>
              <p className="mt-0.5 text-[8px] font-bold uppercase tracking-widest text-white/45">
                {fit.ringLabel}
              </p>
            </div>
          </motion.div>

          <div className="flex min-w-0 flex-1 flex-col justify-center gap-0.5">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-md bg-accent/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-accent ring-1 ring-accent/35">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
              {fit.fitBadge}
            </span>
            <h4 className="mt-1 text-base font-bold leading-tight text-white">{fit.headline}</h4>
            <p className="mt-1 text-xs leading-snug text-white/55 sm:text-sm">{fit.summary}</p>
          </div>
        </div>
        </div>
      </div>
    </motion.article>
  );
}

function LogoBox({ text }: { text: string }) {
  return (
    <div
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-midnight text-sm font-bold text-white ring-1 ring-white/15"
      aria-hidden
    >
      {text}
    </div>
  );
}

function IconButton({ children, label }: { children: ReactNode; label: string }) {
  return (
    <button
      type="button"
      className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-xs text-white/70 transition hover:border-accent/40 hover:text-accent"
      aria-label={label}
    >
      {children}
    </button>
  );
}