import { api } from "./client";
import type { ContentItem } from "../types";

interface ContentItemInput {
  section: string;
  sort_order?: number;
  icon?: string | null;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  image_url?: string | null;
}

export const contentItemsApi = {
  list: (section: string) => api.get<ContentItem[]>(`/content-items?section=${section}`),
  create: (item: ContentItemInput) => api.post<ContentItem>("/content-items", item),
  update: (id: number, item: Partial<ContentItemInput>) => api.put<ContentItem>(`/content-items/${id}`, item),
  remove: (id: number) => api.delete<void>(`/content-items/${id}`),
};
