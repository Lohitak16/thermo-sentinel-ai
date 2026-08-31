import { motion } from "motion/react";
import { Radar } from "lucide-react";
import { fmt } from "@/lib/thermal";
import type { RiskLevel, ThermalAnomaly } from "@/types/api";
import { cn } from "@/lib/utils";

function blipPosition(a: ThermalAnomaly, i: number) {
  const seed = (Number(a.id) || i + 1) * 37.7;
  const angle = (seed % 360) * (Math.PI / 180);
  const radius = 18 + ((seed * 1.7) % 30);
  return {
    x: 50 + Math.cos(angle) * radius,
    y: 50 + Math.sin(angle) * radius,
  };
}

export function RadarScanner({
  anomalies,
  selected,
  risk = "LOW",
  className,
}: {
  anomalies: ThermalAnomaly[];
  selected?: ThermalAnomaly | null;
  risk?: RiskLevel;
  className?: string;
}) {
  const blips = anomalies.slice(0, 14);
  const riskColor = { LOW: "text-emerald", MEDIUM: "text-amber", HIGH: "text-alert" }[risk];

  return (
    <section className={cn("panel relative flex flex-col overflow-hidden", className)} aria-label="Thermal radar">
      <header className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Radar className="h-4 w-4 text-primary" />
          <h2 className="font-display text-sm font-semibold">THERMAL RADAR</h2>
        </div>
        <span className={cn("mono-label", selected ? riskColor : "text-muted-foreground")}>
          {selected ? "SIGNAL LOCKED" : anomalies.length ? "SCANNING" : "NO SIGNAL"}
        </span>
      </header>

      <div className="relative aspect-square w-full p-4">
        <div className="relative h-full w-full">
          {[100, 74, 48, 22].map((s) => (
            <span
              key={s}
              className="absolute rounded-full border border-primary/15"
              style={{ inset: `${(100 - s) / 2}%` }}
            />
          ))}
          <span className="absolute left-1/2 top-0 h-full w-px bg-primary/10" />
          <span className="absolute top-1/2 h-px w-full bg-primary/10" />

          <div
            className="absolute inset-0 rounded-full [animation:tg-sweep_4s_linear_infinite]"
            style={{
              background:
                "conic-gradient(from 0deg, color-mix(in oklab, var(--cyan) 30%, transparent), transparent 32%)",
              maskImage: "radial-gradient(circle, black 99%, transparent 100%)",
            }}
            aria-hidden
          />

          {blips.map((a, i) => {
            const p = blipPosition(a, i);
            const isSelected = selected?.id === a.id;
            return (
              <motion.span
                key={String(a.id)}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: isSelected ? 1.6 : 1, opacity: 1 }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                className={cn(
                  "absolute h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full",
                  isSelected ? "bg-alert shadow-[0_0_14px_currentColor] text-alert" : "bg-primary/70",
                )}
                style={{ left: `${p.x}%`, top: `${p.y}%` }}
              />
            );
          })}

          {selected && (
            <motion.div
              key={String(selected.id)}
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-alert/50"
            >
              <span className="absolute inset-0 rounded-full border border-alert/30 [animation:tg-pulse-ring_2s_ease-out_infinite]" />
            </motion.div>
          )}
        </div>
      </div>

      <footer className="space-y-1.5 border-t border-border px-4 py-3 font-mono text-[11px]">
        {selected ? (
          <>
            <Row label="EVENT" value={`#${selected.id}`} />
            <Row label="LAT" value={fmt(selected.latitude, 4)} />
            <Row label="LON" value={fmt(selected.longitude, 4)} />
            <Row label="FRP" value={`${fmt(selected.frp, 1)} MW`} />
            <Row label="CONF" value={String(selected.confidence ?? "—")} />
          </>
        ) : (
          <p className="text-muted-foreground">
            {anomalies.length
              ? "Select a thermal event to lock the radar onto its signal."
              : "Awaiting thermal anomaly observations."}
          </p>
        )}
      </footer>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-foreground">{value}</span>
    </div>
  );
}
