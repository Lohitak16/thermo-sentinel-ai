import { useState } from "react";
import { Factory, Flame, MapPin, Satellite, Thermometer } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { RiskGauge } from "@/components/common/RiskGauge";
import { RiskBadge } from "@/components/common/RiskBadge";
import { EmptyState, ErrorState, LoadingSkeleton } from "@/components/common/StatePanels";
import { useNearbyFacilities, useRiskAssessment } from "@/hooks/useThermoData";
import {
  confidenceBand,
  coord,
  facilityDistance,
  fmt,
  formatAcqTime,
  normalizeRisk,
  num,
} from "@/lib/thermal";
import type { ThermalAnomaly } from "@/types/api";

export function AnomalyDetailDrawer({
  anomaly,
  open,
  onOpenChange,
  lastSeen,
}: {
  anomaly: ThermalAnomaly | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  lastSeen?: number | null;
}) {
  const [radius, setRadius] = useState(5);
  const id = anomaly?.id ?? "";
  const risk = useRiskAssessment(id, open && Boolean(anomaly));
  const nearby = useNearbyFacilities(id, radius, open && Boolean(anomaly));

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto border-border bg-surface sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-display flex items-center gap-2">
            <Flame className="h-4 w-4 text-thermal" />
            Thermal event #{anomaly?.id ?? "—"}
          </SheetTitle>
          <SheetDescription className="font-mono text-[11px]">
            {anomaly ? coord(anomaly.latitude, anomaly.longitude) : "No event selected"}
            {lastSeen ? ` · ${new Date(lastSeen).toUTCString()}` : ""}
          </SheetDescription>
        </SheetHeader>

        {!anomaly ? (
          <div className="p-4">
            <EmptyState title="Select a thermal event" description="Choose a signal on the map or in the feed." />
          </div>
        ) : (
          <div className="space-y-5 p-4">
            <dl className="grid grid-cols-2 gap-2">
              <Field icon={<Thermometer className="h-3.5 w-3.5" />} label="Brightness (K)" value={fmt(anomaly.brightness, 1)} />
              <Field icon={<Flame className="h-3.5 w-3.5" />} label="FRP (MW)" value={fmt(anomaly.frp, 1)} />
              <Field icon={<Satellite className="h-3.5 w-3.5" />} label="Satellite" value={String(anomaly.satellite ?? "—")} />
              <Field
                icon={<Satellite className="h-3.5 w-3.5" />}
                label="Confidence"
                value={`${anomaly.confidence ?? "—"} (${confidenceBand(anomaly.confidence)})`}
              />
              <Field icon={<MapPin className="h-3.5 w-3.5" />} label="Acquisition date" value={String(anomaly.acq_date ?? "—")} />
              <Field icon={<MapPin className="h-3.5 w-3.5" />} label="Acquisition time (UTC)" value={formatAcqTime(anomaly.acq_time)} />
            </dl>

            <section>
              <h3 className="mono-label mb-2">Risk assessment</h3>
              {risk.isLoading ? (
                <LoadingSkeleton rows={3} />
              ) : risk.isError ? (
                <ErrorState
                  title="Risk assessment unavailable"
                  description="The backend risk endpoint could not be reached for this event."
                  onRetry={() => void risk.refetch()}
                />
              ) : risk.data ? (
                <div className="space-y-3">
                  <RiskGauge level={normalizeRisk(risk.data.risk_level)} />
                  <div className="grid gap-2 text-xs text-muted-foreground">
                    <Row label="Reported level"><RiskBadge level={normalizeRisk(risk.data.risk_level)} /></Row>
                    <Row label="Nearby industrial facility">
                      {risk.data.nearby_industrial_facility ? "Yes" : "No"}
                    </Row>
                    <Row label="Nearest facility distance">
                      {fmt(risk.data.nearest_facility_distance_km, 2)} km
                    </Row>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Assessment is produced by the backend rule engine from FRP and industrial proximity. No AI
                    classification is applied yet.
                  </p>
                </div>
              ) : (
                <EmptyState title="No assessment returned for this event." />
              )}
            </section>

            <section>
              <div className="flex items-center justify-between">
                <h3 className="mono-label">Nearby facilities</h3>
                <span className="font-mono text-[11px] text-primary">{radius} km</span>
              </div>
              <Slider
                className="my-3"
                value={[radius]}
                min={1}
                max={50}
                step={1}
                onValueChange={(v) => setRadius(v[0] ?? 5)}
                aria-label="Search radius in kilometres"
              />
              {nearby.isLoading ? (
                <LoadingSkeleton rows={3} />
              ) : nearby.isError ? (
                <ErrorState
                  title="Proximity search failed"
                  description="Could not query industrial facilities near this event."
                  onRetry={() => void nearby.refetch()}
                />
              ) : (nearby.data ?? []).length === 0 ? (
                <EmptyState
                  title={`No industrial facilities within ${radius} km`}
                  description="Increase the radius or synchronize OpenStreetMap data."
                />
              ) : (
                <ul className="space-y-2">
                  {(nearby.data ?? []).map((f) => (
                    <li key={f.id} className="flex items-center gap-2 rounded-md border border-border bg-surface-2/50 p-2.5">
                      <Factory className="h-4 w-4 shrink-0 text-cyan" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm text-foreground">{f.name ?? "Unnamed facility"}</span>
                        <span className="mono-label block">{f.facility_type ?? "Unclassified"}</span>
                      </span>
                      <span className="font-mono text-[11px] text-muted-foreground">
                        {fmt(facilityDistance(f), 2)} km
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <p className="mono-label">
              Signal intensity {fmt(num(anomaly.frp), 1, "0")} MW · Data: NASA FIRMS
            </p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

function Field({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-surface-2/50 p-2.5">
      <dt className="mono-label flex items-center gap-1.5">
        <span className="text-primary">{icon}</span>
        {label}
      </dt>
      <dd className="mt-1 font-mono text-sm text-foreground">{value}</dd>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-1.5">
      <span>{label}</span>
      <span className="text-foreground">{children}</span>
    </div>
  );
}
