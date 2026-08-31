import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { thermalAnomaliesApi, type AnomalyInput } from "@/services/thermalAnomalies";
import { industrialFacilitiesApi, type FacilityInput } from "@/services/industrialFacilities";
import { osmApi } from "@/services/osm";
import { healthApi } from "@/services/health";

export const qk = {
  anomalies: ["thermal-anomalies"] as const,
  anomaly: (id: string | number) => ["thermal-anomalies", String(id)] as const,
  risk: (id: string | number) => ["risk-assessment", String(id)] as const,
  nearby: (id: string | number, radius: number) => ["nearby-facilities", String(id), radius] as const,
  facilities: ["industrial-facilities"] as const,
  osmFacilities: ["osm-facilities"] as const,
  health: ["health"] as const,
};

export function useAnomalies(pollMs?: number) {
  return useQuery({
    queryKey: qk.anomalies,
    queryFn: () => thermalAnomaliesApi.list(),
    ...(pollMs ? { refetchInterval: pollMs } : {}),
    staleTime: 30_000,
    retry: 1,
  });
}

export function useAnomaly(id: string | number) {
  return useQuery({
    queryKey: qk.anomaly(id),
    queryFn: () => thermalAnomaliesApi.get(id),
    enabled: Boolean(id),
    retry: 1,
  });
}

export function useRiskAssessment(id: string | number, enabled = true) {
  return useQuery({
    queryKey: qk.risk(id),
    queryFn: () => thermalAnomaliesApi.riskAssessment(id),
    enabled: Boolean(id) && enabled,
    retry: 1,
  });
}

export function useNearbyFacilities(id: string | number, radiusKm: number, enabled = true) {
  return useQuery({
    queryKey: qk.nearby(id, radiusKm),
    queryFn: () => thermalAnomaliesApi.nearbyFacilities(id, radiusKm),
    enabled: Boolean(id) && enabled,
    retry: 1,
  });
}

export function useFacilities() {
  return useQuery({
    queryKey: qk.facilities,
    queryFn: () => industrialFacilitiesApi.list(),
    staleTime: 60_000,
    retry: 1,
  });
}

export function useOsmFacilities() {
  return useQuery({
    queryKey: qk.osmFacilities,
    queryFn: () => osmApi.facilities(),
    staleTime: 60_000,
    retry: 1,
  });
}

export function useSystemHealth() {
  const api = useQuery({
    queryKey: [...qk.health, "root"],
    queryFn: () => healthApi.root(),
    refetchInterval: 30_000,
    retry: 0,
  });
  const db = useQuery({
    queryKey: [...qk.health, "db"],
    queryFn: () => healthApi.dbTest(),
    refetchInterval: 60_000,
    retry: 0,
  });
  const osm = useQuery({
    queryKey: [...qk.health, "osm"],
    queryFn: () => healthApi.osmTest(),
    refetchInterval: 300_000,
    retry: 0,
  });
  return { api, db, osm };
}

export function useCreateAnomaly() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: AnomalyInput) => thermalAnomaliesApi.create(payload),
    onSuccess: () => {
      toast.success("Thermal event registered");
      void qc.invalidateQueries({ queryKey: qk.anomalies });
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useUpdateAnomaly() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number | string; payload: AnomalyInput }) =>
      thermalAnomaliesApi.update(id, payload),
    onSuccess: (_d, v) => {
      toast.success(`Thermal event #${v.id} updated`);
      void qc.invalidateQueries({ queryKey: qk.anomalies });
      void qc.invalidateQueries({ queryKey: qk.anomaly(v.id) });
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useDeleteAnomaly() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => thermalAnomaliesApi.remove(id),
    onSuccess: (_d, id) => {
      toast.success(`Thermal event #${id} deleted`);
      void qc.invalidateQueries({ queryKey: qk.anomalies });
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useCreateFacility() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: FacilityInput) => industrialFacilitiesApi.create(payload),
    onSuccess: () => {
      toast.success("Industrial facility added");
      void qc.invalidateQueries({ queryKey: qk.facilities });
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useDeleteFacility() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => industrialFacilitiesApi.remove(id),
    onSuccess: () => {
      toast.success("Facility removed");
      void qc.invalidateQueries({ queryKey: qk.facilities });
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useOsmImport() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => osmApi.import(),
    onSuccess: (result) => {
      const count = result?.imported ?? result?.count;
      toast.success(
        count !== undefined ? `OSM sync complete — ${count} facilities imported` : "OSM sync complete",
      );
      void qc.invalidateQueries({ queryKey: qk.facilities });
      void qc.invalidateQueries({ queryKey: qk.osmFacilities });
    },
    onError: () => toast.error("OpenStreetMap synchronization could not be completed."),
  });
}
