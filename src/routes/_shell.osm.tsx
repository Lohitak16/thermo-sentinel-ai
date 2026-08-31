import { createFileRoute } from "@tanstack/react-router";
import { DownloadCloud, Factory } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState, ErrorState, LoadingSkeleton } from "@/components/common/StatePanels";
import { useOsmFacilities, useOsmImport } from "@/hooks/useThermoData";
import { coord } from "@/lib/thermal";

export const Route = createFileRoute("/_shell/osm")({
  head: () => ({
    meta: [
      { title: "OSM Intelligence — ThermoGuard AI" },
      { name: "description", content: "Synchronize and inspect OpenStreetMap industrial infrastructure data." },
      { property: "og:title", content: "OSM Intelligence — ThermoGuard AI" },
      { property: "og:description", content: "Import industrial facility context from OpenStreetMap." },
    ],
  }),
  component: OsmPage,
});

function OsmPage() {
  const osm = useOsmFacilities();
  const importer = useOsmImport();
  const list = osm.data ?? [];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">OSM INTELLIGENCE</h1>
          <p className="mono-label mt-1">{list.length} facilities available from OpenStreetMap</p>
        </div>
        <Button onClick={() => importer.mutate()} disabled={importer.isPending}>
          <DownloadCloud className="mr-2 h-4 w-4" />
          {importer.isPending ? "Synchronizing…" : "Synchronize OSM data"}
        </Button>
      </div>

      <div className="panel overflow-hidden">
        {osm.isLoading ? (
          <div className="p-4"><LoadingSkeleton rows={6} /></div>
        ) : osm.isError ? (
          <ErrorState
            title="OpenStreetMap data unavailable"
            description="The OSM endpoint could not be reached."
            onRetry={() => void osm.refetch()}
          />
        ) : list.length === 0 ? (
          <EmptyState title="No OSM facilities loaded" description="Run a synchronization to pull industrial infrastructure." />
        ) : (
          <ul className="divide-y divide-border">
            {list.map((f) => (
              <li key={`${f.id}-${f.latitude}`} className="flex items-center gap-3 px-4 py-3">
                <Factory className="h-4 w-4 shrink-0 text-cyan" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm text-foreground">{f.name ?? "Unnamed facility"}</span>
                  <span className="mono-label block">
                    {f.facility_type ?? "Unclassified"} · {coord(f.latitude, f.longitude)}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
