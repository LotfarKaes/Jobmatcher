import type { ReactNode } from "react";

export type StatCardProps = {
  eyebrow: string;
  label: string;
  value: string;
  valueSuffix?: string;
  badge?: string;
  trend?: string;
  trendUp?: boolean;
  hint?: string;
  highlight?: boolean;
  icon?: ReactNode;
};

/** One metric tile on the dashboard overview (props = easy to test and reuse). */
export function StatCard({
  eyebrow,
  label,
  value,
  valueSuffix,
  badge,
  trend,
  trendUp,
  hint,
  highlight,
  icon,
}: StatCardProps) {
  return (
    <article
      className={`glass-panel flex flex-col rounded-2xl p-5 sm:p-6 ${
        highlight ? "ring-1 ring-accent/30 shadow-glow-yellow" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/45">
            {eyebrow}
          </p>
          <h3 className="mt-1 text-sm font-medium text-white/80">{label}</h3>
        </div>
        {icon ? (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-accent">
            {icon}
          </div>
        ) : null}
      </div>

      <p className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
        {highlight ? (
          <span className="text-accent">
            {value}
            {valueSuffix ? (
              <span className="text-2xl font-semibold text-white/50">{valueSuffix}</span>
            ) : null}
          </span>
        ) : (
          <>
            {value}
            {valueSuffix ? (
              <span className="text-2xl font-semibold text-white/50">{valueSuffix}</span>
            ) : null}
          </>
        )}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {badge ? (
          <span
            className={`rounded-md px-2.5 py-1 text-xs font-semibold ${
              highlight
                ? "bg-accent/20 text-accent"
                : "bg-emerald-500/15 text-emerald-300"
            }`}
          >
            {badge}
          </span>
        ) : null}
        {trend ? (
          <span
            className={`text-xs font-medium ${
              trendUp ? "text-emerald-400" : "text-white/55"
            }`}
          >
            {trendUp ? "▲ " : ""}
            {trend}
          </span>
        ) : null}
      </div>

      {hint ? <p className="mt-4 text-xs leading-relaxed text-white/45">{hint}</p> : null}
    </article>
  );
}