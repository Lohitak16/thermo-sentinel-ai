import { Suspense, lazy, useState } from "react";
import { ClientOnly } from "@tanstack/react-router";
import {
  Expand,
  Factory,
  Flame,
  Layers,
  LocateFixed,
  Minimize2,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MapLegend } from "@/components/map/MapLegend";
import { MapScanningOverlay } from "@/components/common/StatePanels";
import { cn } from "@/lib/utils";
import type { ThermalMapProps } from "./ThermalMapInner";

const ThermalMapInner = lazy(() => import("./ThermalMapInner"));

export function ThermalMap({
  className,
  loading = false,
  title = "GLOBAL THERMAL MAP",
  onLocateSelected,
  ...props
}: ThermalMapProps & {
  className?: string;
  loading?: boolean;
  title?: string;
  onLocateSelected?: () => void;
}) {
  const [showAnomalies, setShowAnomalies] = useState(props.showAnomalies ?? true);
  const [showFacilities, setShowFacilities] = useState(props.showFacilities ?? true);
  const [baseLayer, setBaseLayer] = useState<"satellite" | "terrain">(props.baseLayer ?? "satellite");
  const [mapKey, setMapKey] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  return (
    <section
      aria-label={title}
      className={cn(
        "panel relative overflow-hidden",
        fullscreen ? "fixed inset-3 z-50" : className,
      )}
    >
      <header className="absolute inset-x-0 top-0 z-[600] flex flex-wrap items-center justify-between gap-2 border-b border-border bg-background/70 px-3 py-2 backdrop-blur">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-primary" />
          <h2 className="font-display text-sm font-semibold">{title}</h2>
        </div>
        <div className="flex flex-wrap items-center gap-1">
          <Toggle active={showAnomalies} onClick={() => setShowAnomalies((v) => !v)} icon={<Flame className="h-3.5 w-3.5" />} label="Anomalies" />
          <Toggle active={showFacilities} onClick={() => setShowFacilities((v) => !v)} icon={<Factory className="h-3.5 w-3.5" />} label="Facilities" />
          <Toggle
            active={baseLayer === "satellite"}
            onClick={() => setBaseLayer((v) => (v === "satellite" ? "terrain" : "satellite"))}
            icon={<Layers className="h-3.5 w-3.5" />}
            label={baseLayer === "satellite" ? "Satellite" : "Terrain"}
          />
          {onLocateSelected && (
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onLocateSelected} aria-label="Locate selected event">
              <LocateFixed className="h-3.5 w-3.5" />
            </Button>
          )}
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setMapKey((k) => k + 1)} aria-label="Reset view">
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setFullscreen((v) => !v)}
            aria-label={fullscreen ? "Exit fullscreen" : "Fullscreen map"}
          >
            {fullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Expand className="h-3.5 w-3.5" />}
          </Button>
        </div>
      </header>

      <div className="h-full w-full">
        <ClientOnly fallback={<MapScanningOverlay label="INITIALISING GEOSPATIAL ENGINE" />}>
          <Suspense fallback={<MapScanningOverlay label="LOADING MAP TILES" />}>
            <ThermalMapInner
              key={mapKey}
              {...props}
              showAnomalies={showAnomalies}
              showFacilities={showFacilities}
              baseLayer={baseLayer}
            />
          </Suspense>
        </ClientOnly>
      </div>

      {loading && <MapScanningOverlay />}
      <MapLegend className="absolute bottom-8 left-3 z-[600]" />
    </section>
  );
}

function Toggle({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors",
        active
          ? "border-primary/50 bg-primary/10 text-primary"
          : "border-border bg-surface-2/50 text-muted-foreground hover:text-foreground",
      )}
    >
      {icon}
      {label}
    </button>
  );
}
