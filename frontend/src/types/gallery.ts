export type GalleryCategory = "fasilitas" | "aktivitas" | "acara";

export interface GalleryPhoto {
  id: string;
  src: string;
  alt: string;
  title: string;
  description: string;
  category: GalleryCategory;
}
