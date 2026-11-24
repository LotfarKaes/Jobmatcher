"use client";

import { useEffect, useState } from "react";
import { animate, motion, useMotionValue, useReducedMotion, useMotionValueEvent } from "framer-motion";

type HomePageLoaderProps = {
  fullScreen?: boolean;
};

export function HomePageLoader({ fullScreen = true }: HomePageLoaderProps) {
  const reduceMotion = useReducedMotion();

  const wrapperClass = fullScreen
    ? "fixed inset-0 z-[100] flex items-center justify-center bg-midnight bg-dark-mesh"
    : "flex min-h-[50vh] items-center justify-center py-24";

  return (
    <motion.div
      className={wrapperClass}
      role="status"
      aria-live="polite"
      aria-label="Loading Jobmatcher"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.35 } }}
    >
      <div className="hero-glow pointer-events-none absolute inset-0" aria-hidden />
      <div className="relative mx-auto w-full max-w-sm px-6 text-center">
        <p className="text-sm font-bold uppercase tracking-widest text-accent">Jobmatcher</p>
        <p className="mt-2 text-white/70">Preparing your job matches…</p>

        <div className="relative mx-auto mt-10 h-40 w-full max-w-[220px]">
          <motion.p
            className="absolute -top-1 left-1/2 -translate-x-1/2 text-xs font-semibold uppercase tracking-wide text-accent"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            Drop CV
          </motion.p>
          <hr className="absolute bottom-16 left-1/2 w-44 -translate-x-1/2 border-0 border-t-2 border-dashed border-accent/35" />
          <div className="absolute bottom-0 left-1/2 h-14 w-44 -translate-x-1/2 rounded-2xl border border-accent/25 bg-accent/5" />
          <motion.div
            className="absolute bottom-6 left-1/2 flex h-14 w-11 -translate-x-1/2 flex-col items-center justify-center rounded-md border border-white/20 bg-gradient-to-b from-midnight-card to-midnight shadow-lg"
            aria-hidden
            initial={reduceMotion ? { y: 0 } : { y: -96, rotate: -12, opacity: 0.5 }}
            animate={
              reduceMotion
                ? { y: 0, rotate: 0, opacity: 1 }
                : {
                    y: [-96, 6, 0],
                    rotate: [-12, 6, 0],
                    opacity: [0.5, 1, 1],
                  }
            }
            transition={
              reduceMotion
                ? { duration: 0.2 }
                : { duration: 1.1, times: [0, 0.7, 1], ease: "easeOut" }
            }
          >
            <span className="text-[10px] font-bold text-white">CV</span>
            <div className="mt-1 space-y-0.5">
              <span className="block h-0.5 w-6 rounded bg-white/35" />
              <span className="block h-0.5 w-4 rounded bg-white/20" />
            </div>
          </motion.div>
        </div>

        <MatchScoreBadge reduced={!!reduceMotion} />

        <motion.div
          className="mx-auto mt-8 h-1.5 max-w-xs overflow-hidden rounded-full bg-white/10"
        >
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-brand via-brand-light to-accent"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{
              duration: reduceMotion ? 0.4 : 1.3,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}

function MatchScoreBadge({ reduced }: { reduced: boolean }) {
  const [score, setScore] = useState(reduced ? 95 : 62);
  const motionScore = useMotionValue(62);

  useMotionValueEvent(motionScore, "change", (v) => {
    setScore(Math.round(v));
  });

  useEffect(() => {
    if (reduced) {
      setScore(95);
      return;
    }
    const controls = animate(motionScore, 95, {
      duration: 0.9,
      delay: 0.65,
      ease: [0.22, 1, 0.36, 1],
    });
    return () => controls.stop();
  }, [motionScore, reduced]);

  return (
    <motion.div
      className="mt-8 inline-flex items-center gap-3 rounded-2xl border border-accent/30 bg-accent/10 px-5 py-3 shadow-glow-yellow"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.45, duration: 0.35 }}
    >
      <span className="text-3xl font-black tabular-nums text-accent">{score}%</span>
      <span className="text-left text-sm font-medium text-white">
        match
        <span className="mt-0.5 block text-xs font-normal text-white/50">
          Analyzing skills…
        </span>
      </span>
    </motion.div>
  );
}