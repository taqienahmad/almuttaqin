import { useEffect, useState } from "react";
import { contentItemsApi } from "../api/contentItems";
import { postsApi } from "../api/posts";
import { Footer } from "../components/Footer";
import { Icon } from "../components/Icon";
import {
  AnakMengajiIllustration,
  AnakSholatIllustration,
  BelajarIllustration,
  BermainIllustration,
  WisudaIllustration,
} from "../components/illustrations";
import { ImageWithFallback } from "../components/ImageWithFallback";
import { PublicNav } from "../components/PublicNav";
import { VideoEmbed } from "../components/VideoEmbed";
import type { ContentItem, Post } from "../types";
import { toDirectImageUrl } from "../utils/mediaUrl";

const FALLBACK_ILLUSTRATIONS = [
  AnakMengajiIllustration,
  BermainIllustration,
  BelajarIllustration,
  AnakSholatIllustration,
  WisudaIllustration,
];

export function GaleriPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [fotoSekolah, setFotoSekolah] = useState<ContentItem[]>([]);

  useEffect(() => {
    postsApi.list("galeri").then(setPosts).catch(() => setPosts([]));
    contentItemsApi.list("foto_sekolah").then(setFotoSekolah).catch(() => setFotoSekolah([]));
  }, []);

  const videoPosts = posts.filter((p) => p.video_url);
  const photoPosts = posts.filter((p) => !p.video_url);

  return (
    <div className="page">
      <PublicNav />
      <main className="main-content">
        <div className="container">
          <p className="eyebrow">Dokumentasi</p>
          <h1>Galeri</h1>
        </div>

        {/* Foto Sekolah */}
        <section className="landing-section">
          <div className="container">
            <div className="landing-section-header">
              <p className="eyebrow">Lingkungan Sekolah</p>
              <h2>Foto Sekolah</h2>
            </div>
            <div className="gallery-grid">
              {fotoSekolah.map((item, index) => {
                const Illustration = FALLBACK_ILLUSTRATIONS[index % FALLBACK_ILLUSTRATIONS.length];
                return (
                  <figure className="gallery-card" key={item.id}>
                    <div className="gallery-card-media">
                      {item.image_url ? (
                        <ImageWithFallback
                          src={toDirectImageUrl(item.image_url)}
                          alt={item.title}
                          fallback={<Illustration className="gallery-illustration" />}
                        />
                      ) : (
                        <Illustration className="gallery-illustration" />
                      )}
                    </div>
                    <figcaption className="gallery-card-caption">{item.title}</figcaption>
                  </figure>
                );
              })}
            </div>
          </div>
        </section>

        {/* Kegiatan Siswa */}
        <section className="landing-section landing-section-alt">
          <div className="container">
            <div className="landing-section-header">
              <p className="eyebrow">Momen Keseharian</p>
              <h2>Kegiatan Siswa</h2>
            </div>
            {photoPosts.length === 0 && <p className="empty-state">Belum ada foto.</p>}
            <div className="gallery-grid">
              {photoPosts.map((post, index) => {
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
          </div>
        </section>

        {/* Video Dokumentasi */}
        <section className="landing-section">
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
              <div className="grid">
                {videoPosts.map((post) => (
                  <div className="card" key={post.id}>
                    <VideoEmbed url={post.video_url as string} />
                    <h3 className="post-card-title">{post.title}</h3>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
