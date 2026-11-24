"use client";

import { motion, useReducedMotion } from "framer-motion";
import { STEPS } from "@/lib/home/content";
import { FadeIn } from "./FadeIn";
import { fadeUp, staggerContainer } from "./motion";

export function HowItWorksSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      className="border-t border-white/10 bg-midnight-surface/50 py-20 sm:py-24"
      aria-labelledby="how-heading"
    >
      <div className="mx-auto max-w-6xl px-4">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-accent">
            Workflow
          </p>
          <h2 id="how-heading" className="mt-2 text-3xl font-bold text-white sm:text-4xl">
            Three steps to your next role
          </h2>
        </FadeIn>
        <motion.ol
          className="mt-14 grid gap-8 md:grid-cols-3"
          initial={reduceMotion ? false : "hidden"}
          whileInView={reduceMotion ? undefined : "visible"}
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          {STEPS.map((item) => (
            <motion.li
              key={item.step}
              variants={fadeUp}
              className="glass-panel relative rounded-2xl p-8"
            >
              <span className="text-4xl font-black text-accent/30">{item.step}</span>
              <h3 className="mt-4 text-xl font-bold text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">
                {item.description}
              </p>
              <div
                className="pointer-events-none absolute inset-x-8 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent"
                aria-hidden
              />
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
}