"use client";

import { motion, useReducedMotion } from "framer-motion";

const columns = [
  {
    title: "Applied",
    accent: "text-brand-light",
    cards: [
      { company: "Northwind Labs", role: "Frontend dev", match: 94 },
      { company: "Blue Harbor", role: "React engineer", match: 88 },
    ],
  },
  {
    title: "Interview",
    accent: "text-accent",
    cards: [{ company: "Laxicon", role: "Full-stack", match: 91 }],
  },
  {
    title: "Offer",
    accent: "text-emerald-400",
    cards: [],
  },
];

export function DashboardPreview() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="relative w-full"
      initial={reduceMotion ? false : { opacity: 0, y: 32 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className="absolute -inset-2 rounded-3xl bg-gradient-to-br from-brand/40 to-accent/10 blur-2xl"
        aria-hidden
      />
      <motion.div
        className="glass-panel relative overflow-hidden rounded-2xl p-4 shadow-card sm:p-5"
        animate={
          reduceMotion
            ? undefined
            : { y: [0, -5, 0], transition: { duration: 5.5, repeat: Infinity, ease: "easeInOut" } }
        }
      >
        <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-1.5" aria-hidden>
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-accent/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-xs font-medium text-white/50">Your board</span>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {columns.map((col, colIndex) => (
            <div key={col.title} className="min-w-0">
              <p className={`mb-2 text-[10px] font-bold uppercase tracking-wide sm:text-xs ${col.accent}`}>
                {col.title}
              </p>
              <div className="space-y-2">
                {col.cards.map((card, cardIndex) => (
                  <motion.div
                    key={`${card.company}-${card.role}`}
                    className="rounded-lg border border-white/10 bg-midnight/60 p-2.5 sm:p-3"
                    initial={reduceMotion ? false : { opacity: 0, x: -10 }}
                    whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: 0.3 + colIndex * 0.12 + cardIndex * 0.08,
                      duration: 0.45,
                    }}
                  >
                    <p className="truncate text-xs font-semibold text-white sm:text-sm">
                      {card.company}
                    </p>
                    <p className="truncate text-[10px] text-white/50 sm:text-xs">{card.role}</p>
                    <p className="mt-1.5 text-[10px] font-bold text-accent sm:text-xs">
                      {card.match}% match
                    </p>
                  </motion.div>
                ))}
                {col.cards.length === 0 && (
                  <div className="rounded-lg border border-dashed border-white/15 p-3 text-center text-[10px] text-white/35 sm:text-xs">
                    Next milestone
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}