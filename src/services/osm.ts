import { apiRequest, toArray } from "./api";
import type { IndustrialFacility, OsmImportResult } from "@/types/api";

export const osmApi = {
  test: () => apiRequest<unknown>("/osm-test"),
  facilities: async (): Promise<IndustrialFacility[]> =>
    toArray<IndustrialFacility>(await apiRequest<unknown>("/osm-facilities")),
  import: () => apiRequest<OsmImportResult>("/osm-facilities/import", { method: "POST" }),
};
