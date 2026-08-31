import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { RiskBadge } from "@/components/common/RiskBadge";
import { AnomalyDetailDrawer } from "@/components/anomaly/AnomalyDetailDrawer";
import { EmptyState, ErrorState, LoadingSkeleton } from "@/components/common/StatePanels";
import { useAnomalies } from "@/hooks/useThermoData";
import { coord, estimateRisk, fmt, num, HIGH_FRP_THRESHOLD, MEDIUM_FRP_THRESHOLD } from "@/lib/thermal";
import type { ThermalAnomaly } from "@/types/api";

export const Route = createFileRoute("/_shell/risk-analysis")({
  head: () => ({
    meta: [
      { title: "Risk Analysis — ThermoGuard AI" },
      { name: "description", content: "Rule-based thermal risk triage ranked by Fire Radiative Power and proximity." },
      { property: "og:title", content: "Risk Analysis — ThermoGuard AI" },
      { property: "og:description", content: "Prioritized thermal events for responder triage." },
    ],
  }),
  component: RiskAnalysis,
});

function RiskAnalysis() {
  const anomalies = useAnomalies();
  const [selected, setSelected] = useState<ThermalAnomaly | null>(null);
  const [open, setOpen] = useState(false);
  const ranked = [...(anomalies.data ?? [])].sort((a, b) => (num(b.frp) ?? 0) - (num(a.frp) ?? 0));

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-2xl font-bold">RISK ANALYSIS</h1>
        <p className="mono-label mt-1">
          Thresholds: HIGH ≥ {HIGH_FRP_THRESHOLD} MW · MEDIUM ≥ {MEDIUM_FRP_THRESHOLD} MW
        </p>
      </div>

      <div className="panel overflow-hidden">
        {anomalies.isLoading ? (
          <div className="p-4"><LoadingSkeleton rows={8} /></div>
        ) : anomalies.isError ? (
          <ErrorState onRetry={() => void anomalies.refetch()} />
        ) : ranked.length === 0 ? (
          <EmptyState title="Nothing to triage" description="No thermal events are currently stored." />
        ) : (
          <ul className="divide-y divide-border">
            {ranked.map((a, i) => (
              <li key={a.id}>
                <button
                  type="button"
                  className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-2/50"
                  onClick={() => {
                    setSelected(a);
                    setOpen(true);
                  }}
                >
                  <span className="font-mono text-xs text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-mono text-xs text-foreground">{coord(a.latitude, a.longitude)}</span>
                    <span className="mono-label block">
                      FRP {fmt(a.frp, 1)} MW · brightness {fmt(a.brightness, 1)} K · {a.satellite ?? "—"}
                    </span>
                  </span>
                  <RiskBadge level={estimateRisk(num(a.frp))} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <AnomalyDetailDrawer anomaly={selected} open={open} onOpenChange={setOpen} />
    </div>
  );
}
