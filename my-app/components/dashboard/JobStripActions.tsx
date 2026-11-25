import type { ReactNode } from "react";

type JobStripActionsProps = {
  jobId: string;
};

/** Demo AI actions on the left edge of each job strip. */
export function JobStripActions({ jobId }: JobStripActionsProps) {
  return (
    <nav
      className="flex shrink-0 flex-row gap-2 border-b border-white/10 bg-midnight/50 p-3 sm:flex-col sm:gap-2 sm:border-b-0 sm:border-r sm:p-3 lg:w-[11.5rem]"
      aria-label={`Quick actions for job ${jobId}`}
    >
      <ActionButton
        icon={<IconAutoAwesome />}
        label="1-Click Cover Letter"
      />
      <ActionButton
        icon={<IconSmartToy />}
        label="Prepare Interview"
      />
    </nav>
  );
}

function ActionButton({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <button
      type="button"
      className="group flex flex-1 flex-row items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-left transition hover:border-accent/45 hover:bg-accent/10 sm:flex-col sm:items-stretch sm:gap-1.5 sm:py-3"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand/20 text-accent transition group-hover:bg-accent/20 sm:mx-auto">
        {icon}
      </span>
      <span className="text-[11px] font-semibold leading-tight text-white/85 group-hover:text-accent sm:text-center sm:text-xs">
        {label}
      </span>
    </button>
  );
}

/** Material icon: auto_awesome */
function IconAutoAwesome() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="m19 9 1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25L19 9ZM11.5 9.5 9 4 6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12l-5.5-2.5ZM19 15l-1.25 2.75L15 19l2.75 1.25L19 23l1.25-2.75L23 19l-2.75-1.25L19 15Z" />
    </svg>
  );
}

/** Material icon: smart_toy */
function IconSmartToy() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20 9V7c0-1.1-.9-2-2-2h-3c0-1.66-1.34-3-3-3S9 3.34 9 5H6c-1.1 0-2 .9-2 2v2c-1.66 0-3 1.34-3 3s1.34 3 3 3v4c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-4c1.66 0 3-1.34 3-3s-1.34-3-3-3ZM7.5 11.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5S9.83 13 9 13s-1.5-.67-1.5-1.5zM12 17.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4.5-6c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
    </svg>
  );
}