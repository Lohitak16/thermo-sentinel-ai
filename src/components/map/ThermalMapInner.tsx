import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { coord, estimateRisk, fmt, formatAcqTime, normalizeRisk } from "@/lib/thermal";
import type { IndustrialFacility, RiskLevel, ThermalAnomaly } from "@/types/api";

export interface ThermalMapProps {
  anomalies: ThermalAnomaly[];
  facilities?: IndustrialFacility[];
  selectedId?: number | string | null;
  onSelect?: (a: ThermalAnomaly) => void;
  showAnomalies?: boolean;
  showFacilities?: boolean;
  radiusKm?: number | null;
  baseLayer?: "satellite" | "terrain";
  riskById?: Record<string, RiskLevel>;
  center?: [number, number];
  zoom?: number;
}

const TILES = {
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution:
      'Imagery &copy; Esri, Maxar, Earthstar Geographics | Facility data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
  terrain: {
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
};

function anomalyIcon(risk: RiskLevel, selected: boolean) {
  return L.divIcon({
    className: "",
    html: `<span class="tg-marker ${risk.toLowerCase()} ${risk === "HIGH" || selected ? "pulse" : ""}"><i></i></span>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
}

const facilityIcon = L.divIcon({
  className: "",
  html: '<span class="tg-marker facility"><i></i></span>',
  iconSize: [12, 12],
  iconAnchor: [6, 6],
});

function MapFocus({ target, radiusKm }: { target: [number, number] | null; radiusKm?: number | null }) {
  const map = useMap();
  useEffect(() => {
    if (!target) return;
    const zoom = radiusKm ? Math.max(7, 13 - Math.log2(radiusKm)) : 9;
    map.flyTo(target, zoom, { duration: 1.1 });
  }, [target, radiusKm, map]);
  return null;
}

export default function ThermalMapInner({
  anomalies,
  facilities = [],
  selectedId = null,
  onSelect,
  showAnomalies = true,
  showFacilities = true,
  radiusKm = null,
  baseLayer = "satellite",
  riskById = {},
  center = [22.5, 79],
  zoom = 4,
}: ThermalMapProps) {
  const selected = useMemo(
    () => anomalies.find((a) => String(a.id) === String(selectedId)) ?? null,
    [anomalies, selectedId],
  );
  const target = selected ? ([Number(selected.latitude), Number(selected.longitude)] as [number, number]) : null;
  const tiles = TILES[baseLayer];

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      className="h-full w-full"
      scrollWheelZoom
      worldCopyJump
      attributionControl
    >
      <TileLayer url={tiles.url} attribution={tiles.attribution} />
      <MapFocus target={target} radiusKm={radiusKm} />

      {showAnomalies &&
        anomalies.map((a) => {
          const lat = Number(a.latitude);
          const lon = Number(a.longitude);
          if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
          const risk = riskById[String(a.id)] ?? estimateRisk(Number(a.frp));
          const isSelected = String(a.id) === String(selectedId);
          return (
            <Marker
              key={`a-${a.id}`}
              position={[lat, lon]}
              icon={anomalyIcon(normalizeRisk(risk), isSelected)}
              eventHandlers={{ click: () => onSelect?.(a) }}
            >
              <Popup>
                <div className="space-y-1 font-mono text-[11px]">
                  <p className="font-display text-xs font-semibold">THERMAL EVENT #{String(a.id)}</p>
                  <p>{coord(a.latitude, a.longitude)}</p>
                  <p>FRP: {fmt(a.frp, 1)} MW</p>
                  <p>Brightness: {fmt(a.brightness, 1)} K</p>
                  <p>Confidence: {String(a.confidence ?? "—")}</p>
                  <p>Satellite: {a.satellite ?? "—"}</p>
                  <p>
                    {a.acq_date ?? "—"} · {formatAcqTime(a.acq_time)}
                  </p>
                </div>
              </Popup>
            </Marker>
          );
        })}

      {showFacilities &&
        facilities.map((f) => {
          const lat = Number(f.latitude);
          const lon = Number(f.longitude);
          if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
          return (
            <Marker key={`f-${f.id}`} position={[lat, lon]} icon={facilityIcon}>
              <Popup>
                <div className="space-y-1 font-mono text-[11px]">
                  <p className="font-display text-xs font-semibold">{f.name || "Unnamed facility"}</p>
                  <p>Type: {f.facility_type ?? "—"}</p>
                  <p>Source: {f.source ?? "—"}</p>
                  <p>{coord(f.latitude, f.longitude)}</p>
                </div>
              </Popup>
            </Marker>
          );
        })}

      {target && radiusKm ? (
        <Circle
          center={target}
          radius={radiusKm * 1000}
          pathOptions={{ color: "var(--cyan)", weight: 1, fillOpacity: 0.06, dashArray: "6 6" }}
        />
      ) : null}
    </MapContainer>
  );
}
