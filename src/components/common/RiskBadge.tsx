import { cn } from "@/lib/utils";
import type { RiskLevel } from "@/types/api";

const styles: Record<RiskLevel, string> = {
  LOW: "border-risk-low/40 bg-risk-low/10 text-risk-low",
  MEDIUM: "border-risk-medium/40 bg-risk-medium/10 text-risk-medium",
  HIGH: "border-risk-high/50 bg-risk-high/15 text-risk-high",
};

export function RiskBadge({
  level,
  className,
  size = "sm",
}: {
  level: RiskLevel;
  className?: string;
  size?: "sm" | "lg";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border font-mono font-medium uppercase tracking-widest",
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs",
        styles[level],
        className,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full bg-current", level === "HIGH" && "animate-pulse")} />
      {level}
    </span>
  );
}
