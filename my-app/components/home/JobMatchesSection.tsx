"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { FEATURED_JOBS } from "@/lib/home/content";
import { FadeIn } from "./FadeIn";
import { fadeUp, staggerContainer } from "./motion";

export function JobMatchesSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="matches"
      className="border-y border-white/10 bg-midnight-surface/60 py-20 backdrop-blur-sm sm:py-24"
      aria-labelledby="matches-heading"
    >
      <div className="mx-auto max-w-6xl px-4">
        <FadeIn className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-accent">
              Top matches
            </p>
            <h2
              id="matches-heading"
              className="mt-2 text-3xl font-bold text-white sm:text-4xl"
            >
              Roles ranked for <span className="text-accent">your profile</span>
            </h2>
            <p className="mt-3 max-w-xl text-white/65">
              Fit scores, locations, and skill tags—like a Stitch job-results screen,
              wired to your real data later via Supabase + Gemini.
            </p>
          </div>
          <Link
            href="/register"
            className="shrink-0 text-sm font-semibold text-accent transition hover:text-accent-bright"
          >
            View all matches →
          </Link>
        </FadeIn>

        <motion.ul
          className="mt-12 grid gap-5 lg:grid-cols-3"
          initial={reduceMotion ? false : "hidden"}
          whileInView={reduceMotion ? undefined : "visible"}
          viewport={{ once: true, margin: "-40px" }}
          variants={staggerContainer}
        >
          {FEATURED_JOBS.map((job, index) => (
            <motion.li
              key={job.company}
              variants={fadeUp}
              custom={index * 0.06}
              whileHover={reduceMotion ? undefined : { y: -6, transition: { duration: 0.2 } }}
              className="glass-panel group rounded-2xl p-6 transition hover:border-accent/30 hover:shadow-glow-yellow"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-lg font-bold text-white">{job.company}</p>
                  <p className="mt-1 text-sm text-white/70">{job.role}</p>
                  <p className="mt-2 text-xs text-white/45">{job.location}</p>
                </div>
                <motion.span
                  className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-accent/15 text-center ring-1 ring-accent/40"
                  initial={false}
                  animate={
                    reduceMotion
                      ? undefined
                      : { scale: [1, 1.05, 1] }
                  }
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.3,
                  }}
                >
                  <span className="text-lg font-bold leading-none text-accent">
                    {job.match}
                  </span>
                  <span className="text-[9px] font-medium uppercase text-accent/80">
                    fit
                  </span>
                </motion.span>
              </div>
              <ul className="mt-5 flex flex-wrap gap-2">
                {job.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-md bg-white/5 px-2.5 py-1 text-xs font-medium text-white/75 ring-1 ring-white/10"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className="mt-6 w-full rounded-lg bg-brand py-2.5 text-sm font-semibold text-white transition group-hover:bg-brand-light"
              >
                Save & track
              </button>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}