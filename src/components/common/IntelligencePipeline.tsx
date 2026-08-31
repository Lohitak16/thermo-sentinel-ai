import { useState } from "react";
import { motion } from "motion/react";
import {
  Activity,
  BrainCircuit,
  Factory,
  Gauge,
  Layers,
  Radio,
  Satellite,
  Siren,
  Truck,
} from "lucide-react";
import { cn } from "@/lib/utils";

const STAGES = [
  { id: "firms", label: "NASA FIRMS", icon: Satellite, detail: "Thermal anomaly observations from MODIS/VIIRS instruments." },
  { id: "detect", label: "Thermal Detection", icon: Activity, detail: "Anomalies stored with brightness, FRP, confidence and acquisition metadata." },
  { id: "signal", label: "Satellite Signal Analysis", icon: Radio, detail: "FRP and brightness signals are profiled per satellite and confidence band." },
  { id: "osm", label: "OSM Industrial Context", icon: Factory, detail: "OpenStreetMap industrial facilities enrich each observation with ground context." },
  { id: "geo", label: "Geospatial Correlation", icon: Layers, detail: "Proximity analysis associates thermal events with nearby industrial facilities." },
  { id: "ai", label: "AI Classification", icon: BrainCircuit, detail: "Planned stage: classify industrial fires vs persistent thermal sources. Inference API not connected." },
  { id: "risk", label: "Risk Assessment", icon: Gauge, detail: "Rule-based engine combining FRP thresholds with industrial proximity." },
  { id: "warn", label: "Early Warning", icon: Siren, detail: "High-risk events are surfaced to the live monitor and notification centre." },
  { id: "respond", label: "Response", icon: Truck, detail: "Responders act on located, classified and prioritised thermal events." },
];

export function IntelligencePipeline({ className }: { className?: string }) {
  const [active, setActive] = useState(STAGES[0]!.id);
  const current = STAGES.find((s) => s.id === active) ?? STAGES[0]!;

  return (
    <section className={cn("panel overflow-hidden", className)} aria-label="Intelligence pipeline">
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3">
        <h2 className="font-display text-sm font-semibold">INTELLIGENCE PIPELINE</h2>
        <span className="mono-label">Detect · Classify · Locate · Assess · Respond</span>
      </header>

      <div className="grid-overlay flex gap-1 overflow-x-auto p-4">
        {STAGES.map((stage, i) => {
          const Icon = stage.icon;
          const isActive = stage.id === active;
          return (
            <div key={stage.id} className="flex min-w-fit items-center gap-1">
              <motion.button
                type="button"
                onClick={() => setActive(stage.id)}
                whileHover={{ y: -2 }}
                aria-pressed={isActive}
                className={cn(
                  "flex w-[110px] flex-col items-center gap-2 rounded-md border px-2 py-3 text-center transition-colors",
                  isActive
                    ? "border-primary/50 bg-primary/10 text-foreground shadow-[var(--shadow-glow)]"
                    : "border-border bg-surface-2/40 text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className={cn("h-4 w-4", isActive ? "text-primary" : "")} />
                <span className="font-mono text-[10px] uppercase leading-tight tracking-wider">{stage.label}</span>
              </motion.button>
              {i < STAGES.length - 1 && <span className="h-px w-4 shrink-0 bg-border" aria-hidden />}
            </div>
          );
        })}
      </div>

      <div className="border-t border-border px-4 py-3">
        <p className="mono-label mb-1">{current.label}</p>
        <p className="text-sm text-muted-foreground">{current.detail}</p>
      </div>
    </section>
  );
}
