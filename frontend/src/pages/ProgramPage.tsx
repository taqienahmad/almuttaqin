import { useEffect, useMemo, useState } from "react";
import { contentItemsApi } from "../api/contentItems";
import { postsApi } from "../api/posts";
import { DailyScheduleTabs } from "../components/DailyScheduleTabs";
import { Footer } from "../components/Footer";
import { HighlightCard } from "../components/HighlightCard";
import { Icon } from "../components/Icon";
import { ImageWithFallback } from "../components/ImageWithFallback";
import { BermainIllustration } from "../components/illustrations";
import { PatternDivider } from "../components/PatternDivider";
import { PublicNav } from "../components/PublicNav";
import type { IconName } from "../components/Icon";
import { useSiteSettings } from "../context/SiteSettingsContext";
import type { ContentItem, Post } from "../types";
import { toDirectImageUrl } from "../utils/mediaUrl";

export function ProgramPage() {
  const settings = useSiteSettings();
  const [kelompokUsia, setKelompokUsia] = useState<ContentItem[]>([]);
  const [kompetensi, setKompetensi] = useState<ContentItem[]>([]);
  const [metode, setMetode] = useState<ContentItem[]>([]);
  const [jadwalHarian, setJadwalHarian] = useState<ContentItem[]>([]);
  const [galeriPosts, setGaleriPosts] = useState<Post[]>([]);

  useEffect(() => {
    contentItemsApi.list("kelompok_usia").then(setKelompokUsia).catch(() => setKelompokUsia([]));
    contentItemsApi.list("kompetensi").then(setKompetensi).catch(() => setKompetensi([]));
    contentItemsApi.list("metode").then(setMetode).catch(() => setMetode([]));
    contentItemsApi.list("jadwal_harian").then(setJadwalHarian).catch(() => setJadwalHarian([]));
    postsApi.list("galeri").then(setGaleriPosts).catch(() => setGaleriPosts([]));
  }, []);

  const featured = kompetensi.slice(0, 2);
  const coreFoundations = kompetensi.slice(2, 5);

  const showcasePhoto = useMemo(
    () => galeriPosts.find((p) => !p.video_url && p.image_url),
    [galeriPosts],
  );

  return (
    <div className="page">
      <PublicNav />
      <main className="main-content">
        {/* Hero */}
        <section className="landing-section">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-3xl font-extrabold text-[var(--color-text)] sm:text-4xl">
                {settings.program_hero_title}
              </h1>
              <p className="mt-4 text-base leading-relaxed text-[var(--color-text-muted)]">
                {settings.program_hero_description}
              </p>
            </div>
          </div>
          <div className="mt-10">
            <PatternDivider />
          </div>
        </section>

        {/* Kelompok Usia */}
        {kelompokUsia.length > 0 && (
          <section className="landing-section landing-section-alt">
            <div className="container">
              <div className="mx-auto max-w-xl text-center">
                <h2 className="text-2xl font-bold text-[var(--color-text)]">Kelompok Usia</h2>
                <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                  Pendekatan belajar kami menyesuaikan setiap tahap tumbuh kembang anak.
                </p>
              </div>
              <div className="mt-8 grid gap-5 sm:grid-cols-3">
                {kelompokUsia.map((item) => (
                  <div key={item.id} className="rounded-3xl bg-white p-6 text-center shadow-md">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary-dark)]">
                      <Icon name={(item.icon as IconName) ?? "leaf"} className="h-6 w-6" />
                    </div>
                    <h3 className="mt-4 text-base font-bold text-[var(--color-text)]">{item.title}</h3>
                    {item.subtitle && (
                      <span className="mt-2 inline-block rounded-full bg-[var(--color-accent-soft)] px-3 py-1 text-xs font-semibold text-[var(--color-accent)]">
                        {item.subtitle}
                      </span>
                    )}
                    {item.description && (
                      <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-muted)]">
                        {item.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 2 kartu unggulan */}
        {featured.length > 0 && (
          <section className="landing-section">
            <div className="container">
              <div className="mx-auto max-w-xl text-center">
                <h2 className="text-2xl font-bold text-[var(--color-text)]">Kompetensi Unggulan</h2>
                <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                  Dua fondasi utama yang membedakan pendekatan kami: adab islami dan kedekatan dengan
                  Al-Qur'an sejak usia dini.
                </p>
              </div>
              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                {featured.map((item) => (
                  <HighlightCard
                    key={item.id}
                    icon={(item.icon as IconName) ?? "heart"}
                    title={item.title}
                    rawDescription={item.description}
                    maxHighlights={4}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Core Academic Foundations */}
        {coreFoundations.length > 0 && (
          <section className="landing-section landing-section-alt">
            <div className="container">
              <div className="mx-auto max-w-xl text-center">
                <h2 className="text-2xl font-bold text-[var(--color-text)]">Fondasi Akademik Inti</h2>
                <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                  Dirancang selaras dengan tahapan tumbuh kembang anak usia dini dan standar kurikulum
                  nasional.
                </p>
              </div>
              <div className="mt-8 grid gap-5 sm:grid-cols-3">
                {coreFoundations.map((item) => (
                  <div key={item.id} className="rounded-3xl bg-white p-6 shadow-md">
                    <h3 className="text-base font-bold text-[var(--color-text)]">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-muted)]">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Metode Pembelajaran - showcase */}
        {metode.length > 0 && (
          <section className="landing-section">
            <div className="container">
              <div className="grid items-center gap-10 sm:grid-cols-2">
                <div className="relative">
                  {showcasePhoto?.image_url ? (
                    <ImageWithFallback
                      src={toDirectImageUrl(showcasePhoto.image_url)}
                      alt={showcasePhoto.title}
                      className="aspect-[4/3] w-full rounded-3xl object-cover shadow-md"
                      fallback={
                        <div className="flex aspect-[4/3] w-full items-center justify-center rounded-3xl bg-[var(--color-primary-soft)] shadow-md">
                          <BermainIllustration className="h-32 w-32" />
                        </div>
                      }
                    />
                  ) : (
                    <div className="flex aspect-[4/3] w-full items-center justify-center rounded-3xl bg-[var(--color-primary-soft)] shadow-md">
                      <BermainIllustration className="h-32 w-32" />
                    </div>
                  )}
                  {settings.program_methodology_quote && (
                    <div className="absolute -bottom-6 left-4 max-w-[75%] rounded-2xl bg-[var(--color-accent)] px-4 py-3 shadow-lg sm:left-6">
                      <p className="text-sm font-medium italic text-white">
                        &ldquo;{settings.program_methodology_quote}&rdquo;
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-primary-dark)]">
                    Metode Pembelajaran
                  </p>
                  <h2 className="mt-1 text-2xl font-bold text-[var(--color-text)]">
                    Belajar Melalui Bermain yang Menyenangkan
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-muted)]">
                    Kami percaya masa kanak-kanak bukanlah perlombaan. Model kami berpusat pada anak,
                    memberi ruang untuk bermain kooperatif, eksperimen sensorik, dan rutinitas positif
                    yang membangun regulasi diri.
                  </p>
                  <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {metode.map((item, index) => (
                      <div key={item.id}>
                        <p className="text-lg font-extrabold text-[var(--color-primary-soft)]">
                          {String(index + 1).padStart(2, "0")}
                        </p>
                        <p className="mt-1 text-sm font-semibold text-[var(--color-text)]">{item.title}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Rutinitas Harian Interaktif */}
        <section className="landing-section landing-section-alt">
          <div className="container">
            <div className="mx-auto max-w-xl text-center">
              <h2 className="text-2xl font-bold text-[var(--color-text)]">Rutinitas Harian Interaktif</h2>
              <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                Bagaimana keseharian anak-anak kami? Klik slot waktu di bawah untuk melihat keseimbangan
                fokus dan bermain sepanjang hari.
              </p>
            </div>
            <div className="mt-8">
              {jadwalHarian.length === 0 ? (
                <p className="empty-state">Belum ada jadwal.</p>
              ) : (
                <DailyScheduleTabs items={jadwalHarian} />
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
