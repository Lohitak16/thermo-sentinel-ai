import type { ReactNode } from "react";
import { motion } from "motion/react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCountUp } from "@/hooks/useCountUp";

export function Sparkline({ values, className }: { values: number[]; className?: string }) {
  if (values.length < 2) return null;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const span = max - min || 1;
  const points = values
    .map((v, i) => `${(i / (values.length - 1)) * 100},${28 - ((v - min) / span) * 26}`)
    .join(" ");
  return (
    <svg viewBox="0 0 100 28" preserveAspectRatio="none" className={cn("h-7 w-full", className)} aria-hidden>
      <polyline points={points} fill="none" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export function KpiCard({
  label,
  value,
  unit,
  icon,
  accent = "cyan",
  trend,
  sparkline,
  footer,
  animateValue = true,
}: {
  label: string;
  value: number | string;
  unit?: string;
  icon: ReactNode;
  accent?: "cyan" | "thermal" | "alert" | "amber" | "emerald";
  trend?: number;
  sparkline?: number[];
  footer?: ReactNode;
  animateValue?: boolean;
}) {
  const numeric = typeof value === "number" ? value : null;
  const counted = useCountUp(numeric ?? 0, animateValue && numeric !== null);
  const accentClass = {
    cyan: "text-cyan",
    thermal: "text-thermal",
    alert: "text-alert",
    amber: "text-amber",
    emerald: "text-emerald",
  }[accent];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="panel group relative overflow-hidden p-4"
    >
      <div
        className={cn(
          "pointer-events-none absolute -right-8 -top-10 h-24 w-24 rounded-full opacity-20 blur-2xl transition-opacity group-hover:opacity-35",
          accentClass,
        )}
        style={{ background: "currentColor" }}
      />
      <div className="flex items-start justify-between gap-3">
        <p className="mono-label">{label}</p>
        <span className={cn("rounded-md border border-border bg-surface-2/70 p-1.5", accentClass)}>{icon}</span>
      </div>
      <div className="mt-3 flex items-baseline gap-1.5">
        <span className="font-display text-3xl font-bold tabular-nums text-foreground">
          {numeric !== null ? counted.toLocaleString(undefined, { maximumFractionDigits: 1 }) : value}
        </span>
        {unit && <span className="font-mono text-xs text-muted-foreground">{unit}</span>}
      </div>
      <div className="mt-2 flex items-end justify-between gap-3">
        <div className="min-w-0">
          {trend !== undefined && (
            <span
              className={cn(
                "inline-flex items-center gap-1 font-mono text-[11px]",
                trend >= 0 ? "text-emerald" : "text-alert",
              )}
            >
              {trend >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {Math.abs(trend).toFixed(1)}%
            </span>
          )}
          {footer}
        </div>
        {sparkline && sparkline.length > 1 && (
          <div className={cn("w-24 shrink-0 opacity-70", accentClass)}>
            <Sparkline values={sparkline} />
          </div>
        )}
      </div>
    </motion.div>
  );
}
