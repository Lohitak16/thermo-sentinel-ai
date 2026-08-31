import { motion } from "motion/react";
import type { RiskLevel } from "@/types/api";
import { cn } from "@/lib/utils";

const LEVEL_VALUE: Record<RiskLevel, number> = { LOW: 0.18, MEDIUM: 0.55, HIGH: 0.9 };
const LEVEL_COLOR: Record<RiskLevel, string> = {
  LOW: "var(--emerald)",
  MEDIUM: "var(--amber)",
  HIGH: "var(--alert)",
};

export function RiskGauge({ level, className }: { level: RiskLevel; className?: string }) {
  const value = LEVEL_VALUE[level];
  const radius = 70;
  const circumference = Math.PI * radius;

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <svg viewBox="0 0 180 104" className="w-full max-w-[240px]">
        <path
          d="M20 94 A70 70 0 0 1 160 94"
          fill="none"
          stroke="var(--surface-2)"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <motion.path
          d="M20 94 A70 70 0 0 1 160 94"
          fill="none"
          stroke={LEVEL_COLOR[level]}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference * (1 - value) }}
          transition={{ duration: 1.1, ease: "easeOut" }}
          style={{ filter: `drop-shadow(0 0 8px ${LEVEL_COLOR[level]})` }}
        />
        <text
          x="90"
          y="80"
          textAnchor="middle"
          className="font-display"
          fontSize="24"
          fontWeight="700"
          fill={LEVEL_COLOR[level]}
        >
          {level}
        </text>
        <text x="90" y="96" textAnchor="middle" fontSize="8" fill="var(--muted-foreground)" letterSpacing="2">
          RISK LEVEL
        </text>
      </svg>
      <div className="mt-1 flex w-full max-w-[240px] justify-between px-2 font-mono text-[10px] text-muted-foreground">
        <span>LOW</span>
        <span>MEDIUM</span>
        <span>HIGH</span>
      </div>
    </div>
  );
}
