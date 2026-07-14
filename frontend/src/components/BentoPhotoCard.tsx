import { motion } from "motion/react";
import { Eye, ImageOff } from "lucide-react";
import { useState } from "react";
import type { GalleryCategory, GalleryPhoto } from "../types/gallery";

interface Props {
  photo: GalleryPhoto;
  spanClassName: string;
  onOpen: () => void;
}

const CATEGORY_META: Record<GalleryCategory, { label: string; badgeClass: string }> = {
  fasilitas: { label: "Fasilitas", badgeClass: "text-[var(--color-primary-dark)]" },
  aktivitas: { label: "Aktivitas", badgeClass: "text-sky-700" },
  acara: { label: "Acara", badgeClass: "text-rose-700" },
};

export function BentoPhotoCard({ photo, spanClassName, onOpen }: Props) {
  const [failed, setFailed] = useState(false);
  const meta = CATEGORY_META[photo.category];

  return (
    <motion.button
      type="button"
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 200, damping: 22 }}
      onClick={onOpen}
      className={`group flex appearance-none flex-col overflow-hidden rounded-3xl border-0 bg-[var(--color-surface)] p-0 text-left shadow-md outline-none transition-shadow duration-300 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 ${spanClassName}`}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {failed ? (
          <div className="flex h-full w-full items-center justify-center bg-[var(--color-primary-soft)] text-[var(--color-text-muted)]">
            <ImageOff size={28} />
          </div>
        ) : (
          <img
            src={photo.src}
            alt={photo.alt}
            referrerPolicy="no-referrer"
            onError={() => setFailed(true)}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
          />
        )}
        <span
          className={`absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wide ${meta.badgeClass}`}
        >
          {meta.label}
        </span>
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/40">
          <div className="flex translate-y-4 items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-sm font-medium text-neutral-800 opacity-0 shadow-lg transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
            <Eye size={16} />
            Lihat Detail
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="text-sm font-semibold text-[var(--color-text)]">{photo.title}</h3>
        {photo.description && (
          <p className="line-clamp-2 text-xs text-[var(--color-text-muted)]">{photo.description}</p>
        )}
      </div>
    </motion.button>
  );
}
