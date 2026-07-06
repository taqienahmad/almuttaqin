import { useSiteSettings } from "./context/SiteSettingsContext";

export interface SchoolInfo {
  SCHOOL_NAME: string;
  ADDRESS: string;
  WHATSAPP_NUMBER: string;
  WHATSAPP_DISPLAY: string;
  INSTAGRAM_URL: string;
  MAPS_QUERY: string;
  MAPS_SEARCH_URL: string;
  MAPS_EMBED_URL: string;
  WHATSAPP_LINK: string;
}

export function useSchoolInfo(): SchoolInfo {
  const settings = useSiteSettings();

  const SCHOOL_NAME = settings.school_name ?? "";
  const ADDRESS = settings.address ?? "";
  const WHATSAPP_NUMBER = settings.whatsapp_number ?? "";
  const WHATSAPP_DISPLAY = settings.whatsapp_display ?? "";
  const INSTAGRAM_URL = settings.instagram_url ?? "";
  const MAPS_QUERY = encodeURIComponent(ADDRESS);

  return {
    SCHOOL_NAME,
    ADDRESS,
    WHATSAPP_NUMBER,
    WHATSAPP_DISPLAY,
    INSTAGRAM_URL,
    MAPS_QUERY,
    MAPS_SEARCH_URL: `https://www.google.com/maps/search/?api=1&query=${MAPS_QUERY}`,
    MAPS_EMBED_URL: `https://www.google.com/maps?q=${MAPS_QUERY}&output=embed`,
    WHATSAPP_LINK: `https://wa.me/${WHATSAPP_NUMBER}`,
  };
}
