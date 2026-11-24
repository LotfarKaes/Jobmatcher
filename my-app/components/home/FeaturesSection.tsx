"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FEATURES } from "@/lib/home/content";
import { FadeIn } from "./FadeIn";
import { staggerContainer, fadeUp } from "./motion";

function FeatureIcon({ type }: { type: string }) {
  const paths: Record<string, ReactNode> = {
    sparkles: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z"
      />
    ),
    layout: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"
      />
    ),
    chart: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
      />
    ),
  };

  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/15 text-accent ring-1 ring-accent/30">
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.75}
        stroke="currentColor"
        aria-hidden
      >
        {paths[type] ?? paths.sparkles}
      </svg>
    </div>
  );
}

export function FeaturesSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="py-20 sm:py-24" aria-labelledby="features-heading">
      <div className="mx-auto max-w-6xl px-4">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-accent">
            Platform
          </p>
          <h2
            id="features-heading"
            className="mt-2 text-3xl font-bold text-white sm:text-4xl"
          >
            Built for clarity on a <span className="text-accent">dark canvas</span>
          </h2>
          <p className="mt-4 text-lg text-white/65">
            White copy for reading comfort, yellow accents for scores and CTAs—same
            rhythm as modern job-match UX flows.
          </p>
        </FadeIn>
        <motion.ul
          className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          initial={reduceMotion ? false : "hidden"}
          whileInView={reduceMotion ? undefined : "visible"}
          viewport={{ once: true, margin: "-40px" }}
          variants={staggerContainer}
        >
          {FEATURES.map((feature) => (
            <motion.li
              key={feature.title}
              variants={fadeUp}
              className="glass-panel rounded-2xl p-6 transition hover:border-accent/25 hover:shadow-glow-yellow"
            >
              <FeatureIcon type={feature.icon} />
              <h3 className="mt-5 text-lg font-semibold text-white">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">
                {feature.description}
              </p>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}