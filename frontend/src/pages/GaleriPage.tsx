import { motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { contentItemsApi } from "../api/contentItems";
import { postsApi } from "../api/posts";
import { BentoPhotoCard } from "../components/BentoPhotoCard";
import { Footer } from "../components/Footer";
import { Icon } from "../components/Icon";
import { PhotoLightbox } from "../components/PhotoLightbox";
import { PublicNav } from "../components/PublicNav";
import { VideoEmbed } from "../components/VideoEmbed";
import { staggerContainer, staggerItem } from "../motionVariants";
import type { GalleryCategory, GalleryPhoto } from "../types/gallery";
import type { Post } from "../types";
import { toDirectImageUrl } from "../utils/mediaUrl";

const CATEGORIES: { value: "semua" | GalleryCategory; label: string }[] = [
  { value: "semua", label: "Semua" },
  { value: "fasilitas", label: "Fasilitas" },
  { value: "aktivitas", label: "Aktivitas" },
  { value: "acara", label: "Acara" },
];

const BENTO_PATTERN = ["sm:col-span-2", "", "", "", ""];

function getSpanClass(index: number) {
  return BENTO_PATTERN[index % BENTO_PATTERN.length];
}

function excerpt(text: string, maxLength = 160): string {
  return text.length > maxLength ? `${text.slice(0, maxLength).trim()}…` : text;
}

export function GaleriPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [beritaPosts, setBeritaPosts] = useState<Post[]>([]);
  const [fotoSekolah, setFotoSekolah] = useState<GalleryPhoto[]>([]);
  const [activeCategory, setActiveCategory] = useState<"semua" | GalleryCategory>("semua");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    postsApi.list("galeri").then(setPosts).catch(() => setPosts([]));
    postsApi.list("berita").then(setBeritaPosts).catch(() => setBeritaPosts([]));
    contentItemsApi
      .list("foto_sekolah")
      .then((items) =>
        setFotoSekolah(
          items
            .filter((item) => item.image_url)
            .map((item) => ({
              id: `foto-${item.id}`,
              src: toDirectImageUrl(item.image_url as string),
              alt: item.title,
              title: item.title,
              description: excerpt(item.description ?? ""),
              category: "fasilitas" as const,
            })),
        ),
      )
      .catch(() => setFotoSekolah([]));
  }, []);

  const videoPosts = posts.filter((p) => p.video_url);

  const aktivitasPhotos: GalleryPhoto[] = useMemo(
    () =>
      posts
        .filter((p) => !p.video_url && p.image_url)
        .map((p) => ({
          id: `aktivitas-${p.id}`,
          src: toDirectImageUrl(p.image_url as string),
          alt: p.title,
          title: p.title,
          description: excerpt(p.content ?? ""),
          category: "aktivitas" as const,
        })),
    [posts],
  );

  const acaraPhotos: GalleryPhoto[] = useMemo(
    () =>
      beritaPosts
        .filter((p) => p.image_url)
        .map((p) => ({
          id: `acara-${p.id}`,
          src: toDirectImageUrl(p.image_url as string),
          alt: p.title,
          title: p.title,
          description: excerpt(p.content ?? ""),
          category: "acara" as const,
        })),
    [beritaPosts],
  );

  const allPhotos = useMemo(
    () => [...fotoSekolah, ...aktivitasPhotos, ...acaraPhotos],
    [fotoSekolah, aktivitasPhotos, acaraPhotos],
  );

  const filteredPhotos =
    activeCategory === "semua" ? allPhotos : allPhotos.filter((p) => p.category === activeCategory);

  return (
    <div className="page">
      <PublicNav />
      <main className="main-content">
        {/* Galeri Foto - Bento grid */}
        <section className="landing-section">
          <div className="container">
            <div className="landing-section-header">
              <p className="eyebrow">Momen di TAAM Al Muttaqin</p>
              <h2>Galeri Foto</h2>
            </div>

            <div className="mb-8 flex flex-wrap justify-center gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setActiveCategory(cat.value)}
                  className={`appearance-none rounded-full px-5 py-2 text-sm font-medium outline-none transition-all duration-200 ease-out hover:scale-105 active:scale-95 focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 ${
                    activeCategory === cat.value
                      ? "border-0 bg-[var(--color-primary)] text-white shadow-sm"
                      : "border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {filteredPhotos.length === 0 ? (
              <p className="empty-state">Belum ada foto di kategori ini.</p>
            ) : (
              <motion.div layout className="grid grid-cols-1 items-start gap-5 sm:grid-cols-2 md:grid-cols-3">
                {filteredPhotos.map((photo, index) => (
                  <BentoPhotoCard
                    key={photo.id}
                    photo={photo}
                    spanClassName={getSpanClass(index)}
                    onOpen={() => setLightboxIndex(index)}
                  />
                ))}
              </motion.div>
            )}
          </div>
        </section>

        {/* Video Dokumentasi */}
        <section className="landing-section landing-section-alt">
          <div className="container">
            <div className="landing-section-header">
              <p className="eyebrow">Rekam Jejak</p>
              <h2>Video Dokumentasi</h2>
            </div>
            {videoPosts.length === 0 ? (
              <div className="card coming-soon">
                <div className="icon-circle icon-circle-gold">
                  <Icon name="sparkles" />
                </div>
                <h3>Segera Hadir</h3>
                <p>Video dokumentasi kegiatan sedang kami siapkan. Nantikan pembaruannya di sini.</p>
              </div>
            ) : (
              <motion.div
                className="grid"
                variants={staggerContainer}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
              >
                {videoPosts.map((post) => (
                  <motion.div className="card" key={post.id} variants={staggerItem}>
                    <VideoEmbed url={post.video_url as string} />
                    <h3 className="post-card-title">{post.title}</h3>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </section>
      </main>
      <Footer />

      {lightboxIndex !== null && (
        <PhotoLightbox
          photos={filteredPhotos}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </div>
  );
}
