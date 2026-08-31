import { apiRequest } from "./api";

export const healthApi = {
  root: () => apiRequest<unknown>("/", { timeoutMs: 8000 }),
  dbTest: () => apiRequest<unknown>("/db-test", { timeoutMs: 10000 }),
  osmTest: () => apiRequest<unknown>("/osm-test", { timeoutMs: 15000 }),
};
