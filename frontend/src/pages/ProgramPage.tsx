import { useEffect, useState } from "react";
import { contentItemsApi } from "../api/contentItems";
import { Footer } from "../components/Footer";
import { Icon, type IconName } from "../components/Icon";
import { PublicNav } from "../components/PublicNav";
import type { ContentItem } from "../types";

export function ProgramPage() {
  const [kelompokUsia, setKelompokUsia] = useState<ContentItem[]>([]);
  const [pengembangan, setPengembangan] = useState<ContentItem[]>([]);
  const [kompetensi, setKompetensi] = useState<ContentItem[]>([]);
  const [alokasiWaktu, setAlokasiWaktu] = useState<ContentItem[]>([]);
  const [metode, setMetode] = useState<ContentItem[]>([]);
  const [pembiasaan, setPembiasaan] = useState<ContentItem[]>([]);

  useEffect(() => {
    contentItemsApi.list("kelompok_usia").then(setKelompokUsia).catch(() => setKelompokUsia([]));
    contentItemsApi.list("pengembangan").then(setPengembangan).catch(() => setPengembangan([]));
    contentItemsApi.list("kompetensi").then(setKompetensi).catch(() => setKompetensi([]));
    contentItemsApi.list("alokasi_waktu").then(setAlokasiWaktu).catch(() => setAlokasiWaktu([]));
    contentItemsApi.list("metode").then(setMetode).catch(() => setMetode([]));
    contentItemsApi.list("pembiasaan").then(setPembiasaan).catch(() => setPembiasaan([]));
  }, []);

  return (
    <div className="page">
      <PublicNav />
      <main className="main-content">
        <div className="container">
          <p className="eyebrow">Kurikulum</p>
          <h1>Program &amp; Kurikulum</h1>
        </div>

        {/* Kelompok Usia */}
        <section className="landing-section">
          <div className="container">
            <div className="landing-section-header">
              <p className="eyebrow">Jenjang</p>
              <h2>Kelompok Usia</h2>
            </div>
            <div className="grid">
              {kelompokUsia.map((k) => (
                <div className="card feature-card" key={k.id}>
                  <span className="badge">{k.subtitle}</span>
                  <h3>{k.title}</h3>
                  <p>{k.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Program Pengembangan */}
        <section className="landing-section landing-section-alt">
          <div className="container">
            <div className="landing-section-header">
              <p className="eyebrow">6 Aspek Perkembangan</p>
              <h2>Program Pengembangan</h2>
            </div>
            <div className="grid">
              {pengembangan.map((item) => (
                <div className="card feature-card" key={item.id}>
                  <div className="icon-circle">
                    <Icon name={(item.icon ?? "sparkles") as IconName} />
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Kompetensi Pembelajaran */}
        <section className="landing-section">
          <div className="container">
            <div className="landing-section-header">
              <p className="eyebrow">Mata Kegiatan</p>
              <h2>Kompetensi Pembelajaran</h2>
            </div>
            <div className="grid">
              {kompetensi.map((item) => (
                <div className="card program-card" key={item.id}>
                  <div className="icon-circle icon-circle-gold">
                    <Icon name={(item.icon ?? "sparkles") as IconName} />
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Alokasi Waktu & Metode */}
        <section className="landing-section landing-section-alt">
          <div className="container">
            <div className="grid">
              <div className="card">
                <h3>Alokasi Waktu Belajar</h3>
                <table className="schedule-table">
                  <tbody>
                    {alokasiWaktu.map((row) => (
                      <tr key={row.id}>
                        <td>{row.title}</td>
                        <td>{row.subtitle}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="card">
                <h3>Metode Pembelajaran</h3>
                <ul className="info-list">
                  {metode.map((m) => (
                    <li key={m.id}>{m.title}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Kegiatan Islami & Pembiasaan */}
        <section className="landing-section">
          <div className="container">
            <div className="landing-section-header">
              <p className="eyebrow">Habituasi Harian</p>
              <h2>Kegiatan Islami &amp; Pembiasaan</h2>
            </div>
            <div className="card">
              <ul className="info-list">
                {pembiasaan.map((p) => (
                  <li key={p.id}>{p.title}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
