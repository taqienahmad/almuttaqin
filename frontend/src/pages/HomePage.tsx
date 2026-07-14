import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Footer } from "../components/Footer";
import { Icon, type IconName } from "../components/Icon";
import { PatternDivider } from "../components/PatternDivider";
import { PostList } from "../components/PostList";
import { PublicNav } from "../components/PublicNav";
import { postsApi } from "../api/posts";
import { contentItemsApi } from "../api/contentItems";
import { useSiteSettings } from "../context/SiteSettingsContext";
import { staggerContainer, staggerItem } from "../motionVariants";
import type { ContentItem, Post } from "../types";

export function HomePage() {
  const settings = useSiteSettings();
  const [posts, setPosts] = useState<Post[]>([]);
  const [keunggulan, setKeunggulan] = useState<ContentItem[]>([]);

  useEffect(() => {
    postsApi.list().then(setPosts).catch(() => setPosts([]));
    contentItemsApi.list("keunggulan").then(setKeunggulan).catch(() => setKeunggulan([]));
  }, []);

  const pengumuman = posts.filter((p) => p.type === "pengumuman");
  const berita = posts.filter((p) => p.type === "berita");

  return (
    <div className="page">
      <PublicNav />

      {/* Hero banner */}
      <section className="hero">
        <div className="container">
          <div>
            <p className="hero-eyebrow">{settings.hero_eyebrow}</p>
            <h1>{settings.hero_title}</h1>
            <p>{settings.hero_description}</p>
            <div className="form-row">
              <Link to="/ppdb" className="btn">
                Daftar Sekarang
              </Link>
              <Link to="/kontak" className="btn">
                Hubungi Kami
              </Link>
            </div>
          </div>
          <div className="hero-illustration">
            <img src="/logo_muttaqin.png" alt="Logo TAAM Al Muttaqin" className="float-animation" />
            <p className="hero-license-note">
              <Icon name="shield" /> {settings.hero_license_text}
            </p>
          </div>
        </div>
        <PatternDivider />
      </section>

      <main>
        {/* Sambutan Singkat */}
        <section className="landing-section">
          <div className="container">
            <div className="landing-section-header">
              <p className="eyebrow">Sambutan</p>
              <h2>Assalamu'alaikum, Wali Calon Santri</h2>
              <p>&ldquo;{settings.sambutan_quote}&rdquo;</p>
              <p className="testimonial-name">{settings.sambutan_author}</p>
            </div>
          </div>
        </section>

        {/* Pengumuman & Berita */}
        <section className="landing-section landing-section-alt">
          <div className="container stack">
            <section>
              <div className="section-title">
                <span className="eyebrow">Informasi Terbaru</span>
              </div>
              <h2>Pengumuman</h2>
              <PostList posts={pengumuman} />
            </section>
            <section>
              <h2>Berita &amp; Kegiatan</h2>
              <PostList posts={berita} />
            </section>
          </div>
        </section>

        {/* Keunggulan */}
        <section className="landing-section">
          <div className="container">
            <div className="landing-section-header">
              <p className="eyebrow">Kenapa Memilih Kami</p>
              <h2>Keunggulan TAAM Al Muttaqin</h2>
            </div>
            <motion.div
              className="grid"
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
            >
              {keunggulan.map((item) => (
                <motion.div className="card feature-card" key={item.id} variants={staggerItem}>
                  <div className="icon-circle">
                    <Icon name={(item.icon ?? "sparkles") as IconName} />
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className="landing-section landing-section-alt">
          <div className="container">
            <div className="cta-banner">
              <h2>{settings.cta_title}</h2>
              <p>{settings.cta_description}</p>
              <div className="form-row">
                <Link to="/ppdb" className="btn">
                  Daftar PPDB Sekarang
                </Link>
                <Link to="/kontak" className="btn btn-outline">
                  Hubungi Kami
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
