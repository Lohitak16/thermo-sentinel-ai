import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { ThermalMap } from "@/components/map/ThermalMap";
import { RadarScanner } from "@/components/common/RadarScanner";
import { RiskBadge } from "@/components/common/RiskBadge";
import { AnomalyDetailDrawer } from "@/components/anomaly/AnomalyDetailDrawer";
import { EmptyState, ErrorState, LoadingSkeleton } from "@/components/common/StatePanels";
import { useAnomalies, useFacilities } from "@/hooks/useThermoData";
import { anomalyTimestamp, coord, estimateRisk, fmt, num } from "@/lib/thermal";
import type { ThermalAnomaly } from "@/types/api";

export const Route = createFileRoute("/_shell/live-monitor")({
  head: () => ({
    meta: [
      { title: "Live Monitor — ThermoGuard AI" },
      { name: "description", content: "Live thermal anomaly feed with map correlation and radar lock." },
      { property: "og:title", content: "ThermoGuard AI Live Monitor" },
      { property: "og:description", content: "Real-time NASA FIRMS thermal event feed and map." },
    ],
  }),
  component: LiveMonitor,
});

function LiveMonitor() {
  const anomalies = useAnomalies(30_000);
  const facilities = useFacilities();
  const [selected, setSelected] = useState<ThermalAnomaly | null>(null);
  const [open, setOpen] = useState(false);

  const list = [...(anomalies.data ?? [])].sort(
    (a, b) => (anomalyTimestamp(b) ?? 0) - (anomalyTimestamp(a) ?? 0),
  );

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-2xl font-bold">LIVE MONITOR</h1>
        <p className="mono-label mt-1">Auto-refreshing every 30 seconds · NASA FIRMS</p>
      </div>

      <div className="grid gap-3 xl:grid-cols-[1fr_360px]">
        <ThermalMap
          className="h-[560px]"
          title="LIVE THERMAL MAP"
          anomalies={list}
          facilities={facilities.data ?? []}
          selectedId={selected?.id ?? null}
          onSelect={(a) => {
            setSelected(a);
            setOpen(true);
          }}
          loading={anomalies.isLoading}
        />
        <div className="space-y-3">
          <RadarScanner anomalies={list} selected={selected} risk={selected ? estimateRisk(num(selected.frp)) : "LOW"} />
          <section className="panel flex max-h-[300px] flex-col overflow-hidden">
            <header className="border-b border-border px-4 py-3">
              <h2 className="font-display text-sm font-semibold">EVENT FEED</h2>
            </header>
            <div className="flex-1 overflow-y-auto p-3">
              {anomalies.isLoading ? (
                <LoadingSkeleton rows={5} />
              ) : anomalies.isError ? (
                <ErrorState onRetry={() => void anomalies.refetch()} />
              ) : list.length === 0 ? (
                <EmptyState title="No thermal events reported" description="The monitoring feed is clear right now." />
              ) : (
                <ul className="space-y-2">
                  {list.map((a) => (
                    <li key={a.id}>
                      <button
                        type="button"
                        onClick={() => {
                          setSelected(a);
                          setOpen(true);
                        }}
                        className="w-full rounded-md border border-border bg-surface-2/50 p-2.5 text-left transition-colors hover:border-primary/50"
                      >
                        <span className="flex items-center justify-between gap-2">
                          <span className="font-mono text-[11px] text-muted-foreground">
                            {coord(a.latitude, a.longitude)}
                          </span>
                          <RiskBadge level={estimateRisk(num(a.frp))} />
                        </span>
                        <span className="mono-label mt-1 block">
                          FRP {fmt(a.frp, 1)} MW · {a.satellite ?? "—"} · {a.acq_date ?? "—"}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        </div>
      </div>

      <AnomalyDetailDrawer anomaly={selected} open={open} onOpenChange={setOpen} lastSeen={selected ? anomalyTimestamp(selected) : null} />
    </div>
  );
}
