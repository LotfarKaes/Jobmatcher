"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { HERO_STATS } from "@/lib/home/content";
import { DashboardPreview } from "./DashboardPreview";
import { fadeUp } from "./motion";
import { ResumeUploadCard } from "./ResumeUploadCard";

export function HeroSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="home"
      className="relative overflow-hidden pb-16 pt-10 sm:pb-24 sm:pt-14"
      aria-labelledby="hero-heading"
    >
      <div className="hero-glow pointer-events-none absolute inset-0" aria-hidden />
      <div className="relative mx-auto max-w-6xl px-4">
        <motion.div
          className="mx-auto max-w-3xl text-center lg:mx-0 lg:text-left"
          initial={reduceMotion ? false : "hidden"}
          animate={reduceMotion ? undefined : "visible"}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } },
          }}
        >
          <motion.span
            variants={fadeUp}
            custom={0}
            className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-accent"
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent-bright" />
            AI-powered job search
          </motion.span>
          <motion.h1
            id="hero-heading"
            variants={fadeUp}
            custom={0.05}
            className="mt-6 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl"
          >
            Find roles that{" "}
            <span className="text-accent">match your future</span>
          </motion.h1>
          <motion.p
            variants={fadeUp}
            custom={0.12}
            className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/75 lg:mx-0"
          >
            Jobmatcher helps you save time: upload your CV, get ranked matches with
            fit scores, and track every application on one visual board—from applying
            to getting hired.
          </motion.p>
          <motion.div
            variants={fadeUp}
            custom={0.18}
            className="mt-8 flex flex-wrap items-center justify-center gap-4 lg:justify-start"
          >
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-xl bg-accent px-7 py-3.5 text-sm font-bold text-midnight shadow-glow-yellow transition hover:bg-accent-bright"
            >
              Get started free
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white transition hover:border-accent/50 hover:text-accent"
            >
              Log in
            </Link>
          </motion.div>
        </motion.div>

        <div className="mt-14 grid items-start gap-10 lg:grid-cols-2 lg:gap-12">
          <ResumeUploadCard />
          <DashboardPreview />
        </div>

        <motion.ul
          className="mt-16 grid gap-6 border-t border-white/10 pt-10 sm:grid-cols-3"
          initial={reduceMotion ? false : "hidden"}
          whileInView={reduceMotion ? undefined : "visible"}
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.12 } },
          }}
        >
          {HERO_STATS.map((stat) => (
            <motion.li
              key={stat.label}
              variants={fadeUp}
              className="text-center sm:text-left"
            >
              <p className="text-3xl font-bold text-accent sm:text-4xl">{stat.value}</p>
              <p className="mt-1 text-sm text-white/60">{stat.label}</p>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}