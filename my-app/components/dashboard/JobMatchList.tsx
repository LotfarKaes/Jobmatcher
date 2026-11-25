"use client";

import { DASHBOARD_JOB_MATCHES } from "@/lib/dashboard/content";
import { JobMatchStrip } from "./JobMatchStrip";

type JobMatchListProps = {
  className?: string;
};

/** All saved job matches — shown on the AI match menu. */
export function JobMatchList({ className = "mt-10" }: JobMatchListProps) {
  return (
    <section className={className} aria-labelledby="job-matches-heading">
      <h2 id="job-matches-heading" className="text-lg font-bold text-white sm:text-xl">
        Saved roles <span className="text-accent">deep match</span>
      </h2>
      <p className="mt-1 text-sm text-white/55">
        Four roles ranked against your profile (demo data).
      </p>
      <ul className="mt-5 flex flex-col gap-4">
        {DASHBOARD_JOB_MATCHES.map((match, index) => (
          <li key={match.id}>
            <JobMatchStrip match={match} index={index} />
          </li>
        ))}
      </ul>
    </section>
  );
}