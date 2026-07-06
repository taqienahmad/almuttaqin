import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { siteSettingsApi } from "../api/siteSettings";

const SiteSettingsContext = createContext<Record<string, string>>({});

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    siteSettingsApi.get().then(setSettings).catch(() => setSettings({}));
  }, []);

  return <SiteSettingsContext.Provider value={settings}>{children}</SiteSettingsContext.Provider>;
}

export function useSiteSettings(): Record<string, string> {
  return useContext(SiteSettingsContext);
}
