import { apiRequest, toArray } from "./api";
import type { IndustrialFacility } from "@/types/api";

export interface FacilityInput {
  name: string;
  facility_type?: string | null;
  latitude: number;
  longitude: number;
  source?: string | null;
}

export const industrialFacilitiesApi = {
  list: async (): Promise<IndustrialFacility[]> =>
    toArray<IndustrialFacility>(await apiRequest<unknown>("/industrial-facilities")),
  create: (payload: FacilityInput) =>
    apiRequest<IndustrialFacility>("/industrial-facilities", { method: "POST", body: payload }),
  remove: (id: number | string) =>
    apiRequest<unknown>(`/industrial-facilities/${id}`, { method: "DELETE" }),
};
