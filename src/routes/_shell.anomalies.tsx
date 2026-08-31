import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RiskBadge } from "@/components/common/RiskBadge";
import { AnomalyDetailDrawer } from "@/components/anomaly/AnomalyDetailDrawer";
import { EmptyState, ErrorState, LoadingSkeleton } from "@/components/common/StatePanels";
import { useAnomalies, useDeleteAnomaly } from "@/hooks/useThermoData";
import { coord, estimateRisk, fmt, num } from "@/lib/thermal";
import type { ThermalAnomaly } from "@/types/api";

export const Route = createFileRoute("/_shell/anomalies")({
  head: () => ({
    meta: [
      { title: "Thermal Events — ThermoGuard AI" },
      { name: "description", content: "Searchable register of detected thermal anomalies with risk levels." },
      { property: "og:title", content: "Thermal Events Register — ThermoGuard AI" },
      { property: "og:description", content: "Browse, inspect and manage NASA FIRMS thermal anomaly records." },
    ],
  }),
  component: Anomalies,
});

function Anomalies() {
  const anomalies = useAnomalies();
  const del = useDeleteAnomaly();
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<ThermalAnomaly | null>(null);
  const [open, setOpen] = useState(false);

  const rows = useMemo(() => {
    const list = anomalies.data ?? [];
    const term = q.trim().toLowerCase();
    if (!term) return list;
    return list.filter((a) =>
      [a.id, a.satellite, a.acq_date, a.latitude, a.longitude].some((v) =>
        String(v ?? "").toLowerCase().includes(term),
      ),
    );
  }, [anomalies.data, q]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">THERMAL EVENTS</h1>
          <p className="mono-label mt-1">{rows.length} records</p>
        </div>
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by id, satellite, date or coordinates"
          className="w-full sm:w-80"
          aria-label="Search thermal events"
        />
      </div>

      <div className="panel overflow-hidden">
        {anomalies.isLoading ? (
          <div className="p-4">
            <LoadingSkeleton rows={8} />
          </div>
        ) : anomalies.isError ? (
          <ErrorState onRetry={() => void anomalies.refetch()} />
        ) : rows.length === 0 ? (
          <EmptyState title="No thermal events found" description="Adjust the search or wait for the next satellite pass." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  {["ID", "Coordinates", "Brightness", "FRP", "Satellite", "Date", "Risk", ""].map((h) => (
                    <th key={h} className="mono-label px-3 py-2 font-normal">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((a) => (
                  <tr key={a.id} className="border-b border-border/60 transition-colors hover:bg-surface-2/50">
                    <td className="px-3 py-2 font-mono text-xs">#{a.id}</td>
                    <td className="px-3 py-2 font-mono text-xs">{coord(a.latitude, a.longitude)}</td>
                    <td className="px-3 py-2 font-mono text-xs">{fmt(a.brightness, 1)}</td>
                    <td className="px-3 py-2 font-mono text-xs">{fmt(a.frp, 1)}</td>
                    <td className="px-3 py-2 text-xs">{a.satellite ?? "—"}</td>
                    <td className="px-3 py-2 text-xs">{a.acq_date ?? "—"}</td>
                    <td className="px-3 py-2"><RiskBadge level={estimateRisk(num(a.frp))} /></td>
                    <td className="px-3 py-2">
                      <div className="flex justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelected(a);
                            setOpen(true);
                          }}
                        >
                          Inspect
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-alert"
                          aria-label={`Delete event ${a.id}`}
                          disabled={del.isPending}
                          onClick={() => del.mutate(a.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AnomalyDetailDrawer anomaly={selected} open={open} onOpenChange={setOpen} />
    </div>
  );
}
