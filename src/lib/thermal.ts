import type { NearbyFacility, RiskLevel, ThermalAnomaly } from "@/types/api";

export const HIGH_FRP_THRESHOLD = 40;
export const MEDIUM_FRP_THRESHOLD = 20;

/**
 * Mirrors the backend's rule-based geospatial risk engine so the UI can render
 * indicative risk for list views without an N+1 request per row.
 * Authoritative risk always comes from GET /thermal-anomalies/{id}/risk-assessment.
 */
export function estimateRisk(frp: number | null | undefined, nearFacility = false): RiskLevel {
  const value = typeof frp === "number" ? frp : 0;
  if (value >= HIGH_FRP_THRESHOLD && nearFacility) return "HIGH";
  if (value >= MEDIUM_FRP_THRESHOLD || nearFacility) return "MEDIUM";
  return "LOW";
}

export function normalizeRisk(value: unknown): RiskLevel {
  const s = String(value ?? "").toUpperCase();
  if (s.includes("HIGH")) return "HIGH";
  if (s.includes("MED")) return "MEDIUM";
  return "LOW";
}

export function confidenceBand(confidence: unknown): "High" | "Medium" | "Low" {
  if (typeof confidence === "number") {
    if (confidence >= 80) return "High";
    if (confidence >= 40) return "Medium";
    return "Low";
  }
  const s = String(confidence ?? "").toLowerCase();
  if (s.startsWith("h") || s === "n") return s.startsWith("h") ? "High" : "Medium";
  if (s.startsWith("l")) return "Low";
  if (s.startsWith("n") || s.startsWith("m")) return "Medium";
  const n = Number(s);
  if (!Number.isNaN(n) && s !== "") return confidenceBand(n);
  return "Medium";
}

export function num(value: unknown): number | null {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : null;
}

export function fmt(value: unknown, digits = 2, fallback = "—"): string {
  const n = num(value);
  return n === null ? fallback : n.toFixed(digits);
}

export function coord(lat: unknown, lon: unknown): string {
  const a = num(lat);
  const b = num(lon);
  if (a === null || b === null) return "—";
  return `${a.toFixed(4)}°, ${b.toFixed(4)}°`;
}

export function formatAcqTime(time: unknown): string {
  if (time === null || time === undefined || time === "") return "—";
  const raw = String(time).replace(":", "").padStart(4, "0");
  if (!/^\d{4}$/.test(raw)) return String(time);
  return `${raw.slice(0, 2)}:${raw.slice(2)} UTC`;
}

export function facilityDistance(f: NearbyFacility): number | null {
  return num(f.distance_km ?? f.distance);
}

export function anomalyTimestamp(a: ThermalAnomaly): number | null {
  if (!a.acq_date) return null;
  const raw = String(a.acq_time ?? "0000").replace(":", "").padStart(4, "0");
  const iso = `${String(a.acq_date).slice(0, 10)}T${raw.slice(0, 2)}:${raw.slice(2)}:00Z`;
  const t = Date.parse(iso);
  return Number.isNaN(t) ? null : t;
}

export const FRP_BUCKETS = [
  { label: "0–10", min: 0, max: 10 },
  { label: "10–20", min: 10, max: 20 },
  { label: "20–40", min: 20, max: 40 },
  { label: "40–60", min: 40, max: 60 },
  { label: "60+", min: 60, max: Infinity },
];

export function bucketFrp(anomalies: ThermalAnomaly[]) {
  return FRP_BUCKETS.map((b) => ({
    label: b.label,
    count: anomalies.filter((a) => {
      const v = num(a.frp);
      return v !== null && v >= b.min && v < b.max;
    }).length,
  }));
}

export function groupBy<T>(items: T[], key: (item: T) => string) {
  const map = new Map<string, number>();
  for (const item of items) {
    const k = key(item) || "Unknown";
    map.set(k, (map.get(k) ?? 0) + 1);
  }
  return [...map.entries()].map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
}

/** Groups anomalies whose coordinates round to the same ~1km cell (persistence signal). */
export function coordinateClusters(anomalies: ThermalAnomaly[]) {
  const map = new Map<string, ThermalAnomaly[]>();
  for (const a of anomalies) {
    const lat = num(a.latitude);
    const lon = num(a.longitude);
    if (lat === null || lon === null) continue;
    const key = `${lat.toFixed(2)}|${lon.toFixed(2)}`;
    map.set(key, [...(map.get(key) ?? []), a]);
  }
  return [...map.entries()]
    .map(([key, items]) => ({
      key,
      items: items.sort((x, y) => (anomalyTimestamp(x) ?? 0) - (anomalyTimestamp(y) ?? 0)),
      detections: items.length,
      lat: num(items[0]?.latitude) ?? 0,
      lon: num(items[0]?.longitude) ?? 0,
      maxFrp: Math.max(...items.map((i) => num(i.frp) ?? 0)),
    }))
    .sort((a, b) => b.detections - a.detections);
}

export function haversineKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}
