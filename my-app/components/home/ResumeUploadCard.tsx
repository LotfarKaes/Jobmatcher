"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { fadeUp } from "./motion";

export function ResumeUploadCard() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="glass-panel relative overflow-hidden rounded-2xl p-6 sm:p-8"
      initial={reduceMotion ? false : "hidden"}
      whileInView={reduceMotion ? undefined : "visible"}
      viewport={{ once: true }}
      variants={fadeUp}
      custom={0}
    >
      <motion.div
        className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-accent/10 blur-2xl"
        animate={
          reduceMotion
            ? undefined
            : { scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }
        }
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden
      />
      <p className="text-xs font-bold uppercase tracking-widest text-accent">
        Start here
      </p>
      <h2 className="mt-2 text-xl font-bold text-white">Upload your resume</h2>
      <p className="mt-2 text-sm text-white/60">
        PDF or DOCX — we turn it into a profile and match you to roles. (Demo UI;
        connect Gemini + storage in your next sprint.)
      </p>
      <Link
        href="/register"
        className="mt-6 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-white/20 bg-midnight/50 px-6 py-10 text-center transition hover:border-accent/50 hover:bg-accent/5"
      >
        <motion.span
          className="flex h-14 w-14 items-center justify-center rounded-full bg-brand/30 text-2xl"
          animate={reduceMotion ? undefined : { y: [0, -4, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden
        >
          📄
        </motion.span>
        <span className="mt-4 text-sm font-semibold text-white">
          Drag & drop or{" "}
          <span className="text-accent underline decoration-accent/50">browse files</span>
        </span>
        <span className="mt-1 text-xs text-white/45">Supports PDF and DOCX</span>
      </Link>
      <motion.div
        className="mt-5 flex gap-2"
        initial={reduceMotion ? false : { opacity: 0 }}
        whileInView={reduceMotion ? undefined : { opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
      >
        <input
          type="search"
          readOnly
          placeholder="Role, keyword, or company…"
          className="w-full rounded-lg border border-white/10 bg-midnight px-4 py-2.5 text-sm text-white/80 placeholder:text-white/35"
          aria-label="Search roles (demo)"
        />
        <span className="inline-flex shrink-0 items-center rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white">
          Search
        </span>
      </motion.div>
    </motion.div>
  );
}