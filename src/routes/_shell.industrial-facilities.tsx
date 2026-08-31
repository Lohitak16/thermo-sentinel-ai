import { createFileRoute } from "@tanstack/react-router";
import { Factory, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState, ErrorState, LoadingSkeleton } from "@/components/common/StatePanels";
import { ThermalMap } from "@/components/map/ThermalMap";
import { useDeleteFacility, useFacilities } from "@/hooks/useThermoData";
import { coord } from "@/lib/thermal";

export const Route = createFileRoute("/_shell/industrial-facilities")({
  head: () => ({
    meta: [
      { title: "Industrial Facilities — ThermoGuard AI" },
      { name: "description", content: "OpenStreetMap industrial infrastructure used for thermal event correlation." },
      { property: "og:title", content: "Industrial Facilities — ThermoGuard AI" },
      { property: "og:description", content: "Registry of industrial facilities powering proximity risk analysis." },
    ],
  }),
  component: Facilities,
});

function Facilities() {
  const facilities = useFacilities();
  const del = useDeleteFacility();
  const list = facilities.data ?? [];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-2xl font-bold">INDUSTRIAL FACILITIES</h1>
        <p className="mono-label mt-1">{list.length} facilities · OpenStreetMap contributors</p>
      </div>

      <ThermalMap className="h-[420px]" title="FACILITY COVERAGE" anomalies={[]} facilities={list} showAnomalies={false} loading={facilities.isLoading} />

      <div className="panel overflow-hidden">
        {facilities.isLoading ? (
          <div className="p-4"><LoadingSkeleton rows={6} /></div>
        ) : facilities.isError ? (
          <ErrorState onRetry={() => void facilities.refetch()} />
        ) : list.length === 0 ? (
          <EmptyState title="No industrial facilities stored" description="Synchronize OpenStreetMap from the OSM Intelligence page." />
        ) : (
          <ul className="divide-y divide-border">
            {list.map((f) => (
              <li key={f.id} className="flex items-center gap-3 px-4 py-3">
                <Factory className="h-4 w-4 shrink-0 text-cyan" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm text-foreground">{f.name ?? "Unnamed facility"}</span>
                  <span className="mono-label block">
                    {f.facility_type ?? "Unclassified"} · {coord(f.latitude, f.longitude)} · {f.source ?? "—"}
                  </span>
                </span>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-alert"
                  aria-label={`Remove facility ${f.id}`}
                  disabled={del.isPending}
                  onClick={() => del.mutate(f.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
