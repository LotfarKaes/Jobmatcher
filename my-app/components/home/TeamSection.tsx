"use client";

import { motion, useReducedMotion } from "framer-motion";
import { TEAM_MEMBERS } from "@/lib/home/content";
import { FadeIn } from "./FadeIn";
import { fadeUp, staggerContainer } from "./motion";

const INITIALS = TEAM_MEMBERS.map((name) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join(""),
);

export function TeamSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="py-20 sm:py-24" aria-labelledby="team-heading">
      <div className="mx-auto max-w-6xl px-4">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-accent">Team</p>
          <h2
            id="team-heading"
            className="mt-2 text-3xl font-bold text-white sm:text-4xl"
          >
            Built at <span className="text-accent">Laxicon</span>
          </h2>
          <p className="mt-4 text-lg text-white/65">
            Lotfar, Gustav, Andreas, and Marina—one Next.js codebase for
            pages, APIs, and Supabase.
          </p>
        </FadeIn>
        <motion.ul
          className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          initial={reduceMotion ? false : "hidden"}
          whileInView={reduceMotion ? undefined : "visible"}
          viewport={{ once: true, margin: "-40px" }}
          variants={staggerContainer}
        >
          {TEAM_MEMBERS.map((name, index) => (
            <motion.li
              key={name}
              variants={fadeUp}
              custom={index * 0.05}
              className="glass-panel flex items-center gap-4 rounded-2xl p-5 transition hover:border-accent/30"
            >
              <span
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand to-accent text-sm font-bold text-midnight"
                aria-hidden
              >
                {INITIALS[index]}
              </span>
              <span className="font-medium text-white">{name}</span>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}