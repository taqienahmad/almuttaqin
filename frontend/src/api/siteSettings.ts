import { api } from "./client";

export const siteSettingsApi = {
  get: () => api.get<Record<string, string>>("/site-settings"),
  update: (settings: Record<string, string>) => api.put<Record<string, string>>("/site-settings", settings),
};
