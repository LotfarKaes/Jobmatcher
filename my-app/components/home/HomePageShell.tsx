"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { HomePageLoader } from "./HomePageLoader";

const LOAD_MS = 1650;
const LOAD_MS_REDUCED = 400;

export function HomePageShell({ children }: { children: React.ReactNode }) {
  const reduceMotion = useReducedMotion();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const delay = reduceMotion ? LOAD_MS_REDUCED : LOAD_MS;
    const timer = window.setTimeout(() => setShowContent(true), delay);
    return () => window.clearTimeout(timer);
  }, [reduceMotion]);

  return (
    <>
      <AnimatePresence mode="wait">
        {!showContent && <HomePageLoader key="home-loader" fullScreen />}
      </AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showContent ? 1 : 0 }}
        transition={{ duration: reduceMotion ? 0.15 : 0.45, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden={!showContent}
        className={showContent ? undefined : "pointer-events-none"}
      >
        {children}
      </motion.div>
    </>
  );
}