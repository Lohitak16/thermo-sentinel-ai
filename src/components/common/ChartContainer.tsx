import type { ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export function ChartContainer({
  title,
  subtitle,
  question,
  actions,
  children,
  className,
  bodyClassName,
}: {
  title: string;
  subtitle?: string;
  question?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4 }}
      className={cn("panel flex flex-col overflow-hidden", className)}
    >
      <header className="flex flex-wrap items-start justify-between gap-2 border-b border-border px-4 py-3">
        <div>
          <h2 className="font-display text-sm font-semibold text-foreground">{title}</h2>
          {subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        {actions}
      </header>
      <div className={cn("flex-1 p-3", bodyClassName)}>{children}</div>
      {question && (
        <footer className="border-t border-border px-4 py-2">
          <p className="mono-label">{question}</p>
        </footer>
      )}
    </motion.section>
  );
}

export const chartTheme = {
  grid: "var(--grid)",
  axis: "var(--muted-foreground)",
  tooltip: {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "8px",
    fontSize: "12px",
    color: "var(--foreground)",
  } as const,
  palette: ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"],
  risk: { LOW: "var(--emerald)", MEDIUM: "var(--amber)", HIGH: "var(--alert)" },
};
