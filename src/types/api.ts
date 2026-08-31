export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";

export interface ThermalAnomaly {
  id: number;
  latitude: number;
  longitude: number;
  brightness: number | null;
  frp: number | null;
  confidence: string | number | null;
  satellite: string | null;
  acq_date: string | null;
  acq_time: string | null;
  [key: string]: unknown;
}

export interface IndustrialFacility {
  id: number;
  name: string | null;
  facility_type: string | null;
  latitude: number;
  longitude: number;
  source: string | null;
  [key: string]: unknown;
}

export interface NearbyFacility extends IndustrialFacility {
  distance_km?: number | null;
  distance?: number | null;
}

export interface RiskAssessment {
  anomaly_id?: number;
  risk_level: RiskLevel | string;
  frp?: number | null;
  confidence?: string | number | null;
  nearby_industrial_facility?: boolean | number | null;
  nearest_facility_distance_km?: number | null;
  [key: string]: unknown;
}

export interface HealthStatus {
  ok: boolean;
  detail?: string;
  raw?: unknown;
}

export interface OsmImportResult {
  imported?: number;
  count?: number;
  message?: string;
  [key: string]: unknown;
}

export interface ApiResponse<T> {
  data: T;
  ok: boolean;
}
