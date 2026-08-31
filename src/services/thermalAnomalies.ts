import { apiRequest, toArray } from "./api";
import type { NearbyFacility, RiskAssessment, ThermalAnomaly } from "@/types/api";

export interface AnomalyInput {
  latitude: number;
  longitude: number;
  brightness?: number | null;
  frp?: number | null;
  confidence?: string | null;
  satellite?: string | null;
  acq_date?: string | null;
  acq_time?: string | null;
}

export const thermalAnomaliesApi = {
  list: async (): Promise<ThermalAnomaly[]> =>
    toArray<ThermalAnomaly>(await apiRequest<unknown>("/thermal-anomalies")),
  get: (id: number | string) => apiRequest<ThermalAnomaly>(`/thermal-anomalies/${id}`),
  create: (payload: AnomalyInput) =>
    apiRequest<ThermalAnomaly>("/thermal-anomalies", { method: "POST", body: payload }),
  update: (id: number | string, payload: AnomalyInput) =>
    apiRequest<ThermalAnomaly>(`/thermal-anomalies/${id}`, { method: "PUT", body: payload }),
  remove: (id: number | string) =>
    apiRequest<unknown>(`/thermal-anomalies/${id}`, { method: "DELETE" }),
  nearbyFacilities: async (id: number | string, radiusKm?: number): Promise<NearbyFacility[]> => {
    const qs = radiusKm ? `?radius_km=${radiusKm}` : "";
    return toArray<NearbyFacility>(
      await apiRequest<unknown>(`/thermal-anomalies/${id}/nearby-facilities${qs}`),
    );
  },
  riskAssessment: (id: number | string) =>
    apiRequest<RiskAssessment>(`/thermal-anomalies/${id}/risk-assessment`),
};
