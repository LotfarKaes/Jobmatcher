"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { FadeIn } from "./FadeIn";

export function CtaSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="pb-20 sm:pb-28" aria-labelledby="cta-heading">
      <div className="mx-auto max-w-6xl px-4">
        <FadeIn>
          <div className="relative overflow-hidden rounded-3xl border border-accent/20 bg-gradient-to-br from-brand via-midnight-card to-midnight px-8 py-14 text-center shadow-glow sm:px-16">
            <motion.div
              className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent/15 blur-3xl"
              animate={
                reduceMotion
                  ? undefined
                  : { scale: [1, 1.1, 1], opacity: [0.4, 0.7, 0.4] }
              }
              transition={{ duration: 5, repeat: Infinity }}
              aria-hidden
            />
            <h2
              id="cta-heading"
              className="relative text-3xl font-bold text-white sm:text-4xl"
            >
              Ready to <span className="text-accent">organize</span> your job hunt?
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-lg text-white/75">
              Create an account, upload your CV, and open your dashboard. AI matching
              grows with your project.
            </p>
            <div className="relative mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/register"
                className="inline-flex rounded-xl bg-accent px-7 py-3.5 text-sm font-bold text-midnight shadow-glow-yellow transition hover:bg-accent-bright"
              >
                Create free account
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex rounded-xl border border-white/25 px-7 py-3.5 text-sm font-semibold text-white transition hover:border-accent hover:text-accent"
              >
                Go to dashboard
              </Link>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}