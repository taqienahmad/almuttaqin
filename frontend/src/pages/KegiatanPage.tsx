import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { contentItemsApi } from "../api/contentItems";
import { postsApi } from "../api/posts";
import { Footer } from "../components/Footer";
import { ImageWithFallback } from "../components/ImageWithFallback";
import {
  AnakSholatIllustration,
  BermainIllustration,
  WisudaIllustration,
} from "../components/illustrations";
import { PublicNav } from "../components/PublicNav";
import type { ContentItem, Post } from "../types";
import { toDirectImageUrl } from "../utils/mediaUrl";

const FALLBACK_ILLUSTRATIONS = [AnakSholatIllustration, BermainIllustration, WisudaIllustration];

export function KegiatanPage() {
  const [galeriPreview, setGaleriPreview] = useState<Post[]>([]);
  const [jadwalHarian, setJadwalHarian] = useState<ContentItem[]>([]);
  const [tematik, setTematik] = useState<ContentItem[]>([]);
  const [event, setEvent] = useState<ContentItem[]>([]);

  useEffect(() => {
    postsApi
      .list("galeri")
      .then((items) => setGaleriPreview(items.filter((p) => !p.video_url).slice(0, 3)))
      .catch(() => setGaleriPreview([]));
    contentItemsApi.list("jadwal_harian").then(setJadwalHarian).catch(() => setJadwalHarian([]));
    contentItemsApi.list("tematik").then(setTematik).catch(() => setTematik([]));
    contentItemsApi.list("event").then(setEvent).catch(() => setEvent([]));
  }, []);

  return (
    <div className="page">
      <PublicNav />
      <main className="main-content">
        <div className="container">
          <p className="eyebrow">Aktivitas</p>
          <h1>Kegiatan</h1>
        </div>

        {/* Kegiatan Harian */}
        <section className="landing-section">
          <div className="container">
            <div className="landing-section-header">
              <p className="eyebrow">Rutinitas</p>
              <h2>Kegiatan Harian</h2>
            </div>
            <div className="card">
              <table className="schedule-table">
                <tbody>
                  {jadwalHarian.map((row) => (
                    <tr key={row.id}>
                      <td>{row.title}</td>
                      <td>{row.subtitle}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Kegiatan Tematik */}
        <section className="landing-section landing-section-alt">
          <div className="container">
            <div className="landing-section-header">
              <p className="eyebrow">Belajar Sambil Bertema</p>
              <h2>Kegiatan Tematik</h2>
            </div>
            <div className="grid">
              {tematik.map((tema) => (
                <div className="card feature-card" key={tema.id}>
                  <h3>{tema.title}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Outing / Parenting / Event */}
        <section className="landing-section">
          <div className="container">
            <div className="landing-section-header">
              <p className="eyebrow">Di Luar Kelas</p>
              <h2>Outing, Parenting &amp; Event Sekolah</h2>
            </div>
            <div className="card">
              <ul className="info-list">
                {event.map((e) => (
                  <li key={e.id}>{e.title}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Galeri Foto Kegiatan */}
        <section className="landing-section landing-section-alt">
          <div className="container">
            <div className="landing-section-header">
              <p className="eyebrow">Dokumentasi</p>
              <h2>Galeri Foto Kegiatan</h2>
            </div>
            <div className="gallery-grid">
              {galeriPreview.map((post, index) => {
                const Illustration = FALLBACK_ILLUSTRATIONS[index % FALLBACK_ILLUSTRATIONS.length];
                return (
                  <figure key={post.id} className="gallery-card">
                    <div className="gallery-card-media">
                      {post.image_url ? (
                        <ImageWithFallback
                          src={toDirectImageUrl(post.image_url)}
                          alt={post.title}
                          fallback={<Illustration className="gallery-illustration" />}
                        />
                      ) : (
                        <Illustration className="gallery-illustration" />
                      )}
                    </div>
                    <figcaption className="gallery-card-caption">{post.title}</figcaption>
                  </figure>
                );
              })}
            </div>
            <div className="gallery-preview-footer">
              <Link to="/galeri" className="btn btn-outline">
                Lihat Semua Galeri
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
