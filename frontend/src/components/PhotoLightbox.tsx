import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import type { GalleryPhoto } from "../types/gallery";

interface Props {
  photos: GalleryPhoto[];
  index: number;
  onClose: () => void;
  onNavigate: (nextIndex: number) => void;
}

export function PhotoLightbox({ photos, index, onClose, onNavigate }: Props) {
  const [zoomed, setZoomed] = useState(false);
  const photo = photos[index];

  useEffect(() => {
    setZoomed(false);
  }, [index]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onNavigate((index - 1 + photos.length) % photos.length);
      if (e.key === "ArrowRight") onNavigate((index + 1) % photos.length);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [index, photos.length, onClose, onNavigate]);

  if (!photo) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/90 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
      >
        <button
          type="button"
          aria-label="Tutup"
          onClick={onClose}
          className="absolute right-4 top-4 appearance-none rounded-full border-0 bg-white/10 p-2 text-white outline-none transition hover:scale-110 hover:bg-white/20 active:scale-90"
        >
          <X size={24} />
        </button>

        <button
          type="button"
          aria-label="Foto sebelumnya"
          onClick={(e) => {
            e.stopPropagation();
            onNavigate((index - 1 + photos.length) % photos.length);
          }}
          className="absolute left-2 top-1/2 -translate-y-1/2 appearance-none rounded-full border-0 bg-white/10 p-2 text-white outline-none transition hover:scale-110 hover:bg-white/20 active:scale-90 md:left-6"
        >
          <ChevronLeft size={28} />
        </button>
        <button
          type="button"
          aria-label="Foto berikutnya"
          onClick={(e) => {
            e.stopPropagation();
            onNavigate((index + 1) % photos.length);
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 appearance-none rounded-full border-0 bg-white/10 p-2 text-white outline-none transition hover:scale-110 hover:bg-white/20 active:scale-90 md:right-6"
        >
          <ChevronRight size={28} />
        </button>

        <motion.div
          key={photo.id}
          className="my-8 flex max-w-4xl flex-col items-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative flex-shrink-0 overflow-hidden rounded-2xl">
            <motion.img
              src={photo.src}
              alt={photo.alt}
              referrerPolicy="no-referrer"
              className="max-h-[60vh] w-auto cursor-zoom-in select-none rounded-2xl object-contain"
              animate={{ scale: zoomed ? 1.6 : 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
              onClick={() => setZoomed((z) => !z)}
            />
            <button
              type="button"
              aria-label="Perbesar foto"
              onClick={() => setZoomed((z) => !z)}
              className="absolute bottom-3 right-3 appearance-none rounded-full border-0 bg-white/90 p-2 text-neutral-800 shadow-lg outline-none transition hover:scale-110 hover:bg-white active:scale-90"
            >
              <ZoomIn size={20} />
            </button>
          </div>

          <div className="mt-4 max-w-xl text-center">
            <h3 className="text-lg font-semibold text-white">{photo.title}</h3>
            {photo.description && <p className="mt-1 text-sm text-white/70">{photo.description}</p>}
            <p className="mt-2 text-xs uppercase tracking-wide text-white/50">
              {index + 1} dari {photos.length}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
