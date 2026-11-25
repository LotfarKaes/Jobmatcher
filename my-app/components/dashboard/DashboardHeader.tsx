import { DASHBOARD_META } from "@/lib/dashboard/content";

type DashboardHeaderProps = {
  title?: string;
  subtitle?: string;
  showTelemetry?: boolean;
  showSync?: boolean;
  showExport?: boolean;
};

export function DashboardHeader({
  title,
  subtitle,
  showTelemetry = true,
  showSync = true,
  showExport = true,
}: DashboardHeaderProps) {
  const heading = title ?? DASHBOARD_META.pageTitle;
  const description = subtitle ?? DASHBOARD_META.pageSubtitle;

  return (
    <header className="flex flex-col gap-4 border-b border-white/10 pb-6 lg:flex-row lg:items-start lg:justify-between">
      <div>
        {showTelemetry ? (
          <p className="text-[10px] font-semibold uppercase tracking-widest text-accent/90">
            {DASHBOARD_META.telemetry} | {DASHBOARD_META.nodeId}
          </p>
        ) : null}
        <h1 className={`text-2xl font-bold text-white sm:text-3xl ${showTelemetry ? "mt-2" : ""}`}>
          {heading}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/60">{description}</p>
        {showSync ? (
          <p className="mt-3 inline-flex items-center gap-2 rounded-lg bg-white/5 px-3 py-1.5 text-xs text-white/55 ring-1 ring-white/10">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" aria-hidden />
            {DASHBOARD_META.parseSynced}
          </p>
        ) : null}
      </div>
      {showExport ? (
        <button
          type="button"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-accent/35 bg-accent/10 px-4 py-2.5 text-sm font-semibold text-accent transition hover:bg-accent/20"
        >
          <span aria-hidden>↓</span>
          Export full audit
          <span className="sr-only">(demo — not wired yet)</span>
        </button>
      ) : null}
    </header>
  );
}