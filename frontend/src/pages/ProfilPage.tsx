import { useEffect, useState } from "react";
import { contentItemsApi } from "../api/contentItems";
import { Icon, type IconName } from "../components/Icon";
import { Footer } from "../components/Footer";
import { PublicNav } from "../components/PublicNav";
import { useSiteSettings } from "../context/SiteSettingsContext";
import type { ContentItem } from "../types";

export function ProfilPage() {
  const settings = useSiteSettings();
  const [misi, setMisi] = useState<ContentItem[]>([]);
  const [nilai, setNilai] = useState<ContentItem[]>([]);
  const [fasilitas, setFasilitas] = useState<ContentItem[]>([]);
  const [tenagaPendidik, setTenagaPendidik] = useState<ContentItem[]>([]);

  useEffect(() => {
    contentItemsApi.list("misi").then(setMisi).catch(() => setMisi([]));
    contentItemsApi.list("nilai").then(setNilai).catch(() => setNilai([]));
    contentItemsApi.list("fasilitas").then(setFasilitas).catch(() => setFasilitas([]));
    contentItemsApi.list("tenaga_pendidik").then(setTenagaPendidik).catch(() => setTenagaPendidik([]));
  }, []);

  return (
    <div className="page">
      <PublicNav />
      <main className="main-content">
        <div className="container">
          <p className="eyebrow">Tentang Kami</p>
          <h1>Profil Sekolah</h1>
        </div>

        {/* Sejarah Singkat */}
        <section className="landing-section">
          <div className="container">
            <div className="landing-section-header-left">
              <h2>Sejarah Singkat</h2>
              <p>{settings.sejarah}</p>
            </div>
          </div>
        </section>

        {/* Visi Misi */}
        <section className="landing-section landing-section-alt">
          <div className="container">
            <div className="grid">
              <div className="card">
                <div className="icon-circle">
                  <Icon name="sparkles" />
                </div>
                <h3>Visi</h3>
                <p>{settings.visi}</p>
              </div>
              <div className="card">
                <div className="icon-circle icon-circle-gold">
                  <Icon name="book" />
                </div>
                <h3>Misi</h3>
                <ul className="stack misi-list">
                  {misi.map((item, index) => (
                    <li key={item.id}>
                      {index + 1}. {item.title}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Nilai-nilai Sekolah */}
        <section className="landing-section">
          <div className="container">
            <div className="landing-section-header">
              <p className="eyebrow">Yang Kami Pegang Teguh</p>
              <h2>Nilai-Nilai Sekolah</h2>
            </div>
            <div className="grid">
              {nilai.map((item) => (
                <div className="card feature-card" key={item.id}>
                  <div className="icon-circle">
                    <Icon name={(item.icon ?? "heart") as IconName} />
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Fasilitas */}
        <section className="landing-section landing-section-alt">
          <div className="container">
            <div className="landing-section-header">
              <p className="eyebrow">Sarana &amp; Prasarana</p>
              <h2>Fasilitas</h2>
            </div>
            <div className="grid">
              {fasilitas.map((item) => (
                <div className="card facility-card" key={item.id}>
                  <div className="icon-circle">
                    <Icon name={(item.icon ?? "home") as IconName} />
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tenaga Pendidik */}
        <section className="landing-section">
          <div className="container">
            <div className="landing-section-header">
              <p className="eyebrow">Dibimbing Langsung Oleh</p>
              <h2>Tenaga Pendidik</h2>
            </div>
            <div className="grid">
              {tenagaPendidik.map((t) => (
                <div className="card teacher-card" key={t.id}>
                  <div className="teacher-avatar">{t.title.charAt(t.title.indexOf(" ") + 1)}</div>
                  <h3>{t.title}</h3>
                  <p className="testimonial-role">{t.subtitle}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
