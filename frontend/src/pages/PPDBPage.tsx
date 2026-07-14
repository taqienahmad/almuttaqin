import { motion } from "motion/react";
import { FormEvent, useEffect, useState } from "react";
import { contentItemsApi } from "../api/contentItems";
import { ppdbApi } from "../api/ppdb";
import { Footer } from "../components/Footer";
import { BermainIllustration } from "../components/illustrations";
import { PublicNav } from "../components/PublicNav";
import { staggerContainer, staggerItem } from "../motionVariants";
import { useSchoolInfo } from "../schoolInfo";
import type { ContentItem, Kelompok, PPDBInput } from "../types";

const initialForm: PPDBInput = {
  nama_anak: "",
  tempat_lahir: "",
  tanggal_lahir: "",
  jenis_kelamin: "L",
  nama_ayah: "",
  nama_ibu: "",
  email_orang_tua: "",
  alamat: "",
  kelompok_dipilih: "kelompok_bermain",
  tahun_ajaran: "2026/2027",
};

export function PPDBPage() {
  const { WHATSAPP_LINK } = useSchoolInfo();
  const [form, setForm] = useState<PPDBInput>(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [syarat, setSyarat] = useState<ContentItem[]>([]);
  const [alur, setAlur] = useState<ContentItem[]>([]);
  const [biaya, setBiaya] = useState<ContentItem[]>([]);

  useEffect(() => {
    contentItemsApi.list("syarat_ppdb").then(setSyarat).catch(() => setSyarat([]));
    contentItemsApi.list("alur_ppdb").then(setAlur).catch(() => setAlur([]));
    contentItemsApi.list("biaya_ppdb").then(setBiaya).catch(() => setBiaya([]));
  }, []);

  function update<K extends keyof PPDBInput>(key: K, value: PPDBInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await ppdbApi.submit(form);
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengirim pendaftaran");
    }
  }

  return (
    <div className="page">
      <PublicNav />

      <div className="container">
        <p className="eyebrow">Penerimaan Peserta Didik Baru</p>
        <h1>PPDB / Pendaftaran</h1>
      </div>

      {/* Syarat Pendaftaran */}
      <section className="landing-section">
        <div className="container">
          <div className="landing-section-header">
            <p className="eyebrow">Yang Perlu Disiapkan</p>
            <h2>Syarat Pendaftaran</h2>
          </div>
          <div className="card">
            <ul className="info-list">
              {syarat.map((s) => (
                <li key={s.id}>{s.title}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Alur Pendaftaran */}
      <section className="landing-section landing-section-alt">
        <div className="container">
          <div className="landing-section-header">
            <p className="eyebrow">Langkah Demi Langkah</p>
            <h2>Alur Pendaftaran</h2>
          </div>
          <motion.div
            className="card numbered-steps"
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            {alur.map((step, index) => (
              <motion.div className="numbered-step" key={step.id} variants={staggerItem}>
                <div className="numbered-step-index">{index + 1}</div>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Biaya */}
      <section className="landing-section">
        <div className="container">
          <div className="landing-section-header">
            <p className="eyebrow">Investasi Pendidikan</p>
            <h2>Biaya Pendaftaran</h2>
          </div>
          <div className="card">
            <ul className="info-list">
              {biaya.map((b) => (
                <li key={b.id}>{b.title} &mdash; hubungi admin untuk info nominal terbaru</li>
              ))}
            </ul>
            <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="btn biaya-cta">
              Tanya Biaya via WhatsApp
            </a>
          </div>
        </div>
      </section>

      <main className="main-content">
        <div className="container">
          {submitted ? (
            <div className="card ppdb-success">
              <BermainIllustration className="gallery-illustration" />
              <h1>Pendaftaran Terkirim</h1>
              <p>
                Terima kasih, pendaftaran <strong>{form.nama_anak}</strong> sudah kami terima. Admin
                akan menghubungi Anda lewat email (<strong>{form.email_orang_tua}</strong>) setelah
                pendaftaran diverifikasi.
              </p>
            </div>
          ) : (
            <div className="card ppdb-form-card">
              <p className="eyebrow">Tahun Ajaran {form.tahun_ajaran}</p>
              <h1>Formulir Pendaftaran Peserta Didik Baru</h1>
              <p className="section-desc">
                Isi data calon peserta didik dengan lengkap. Tim kami akan menghubungi Anda lewat
                email setelah pendaftaran ditinjau.
              </p>

              <form onSubmit={handleSubmit} className="stack">
                <div className="form-grid">
                  <div className="field">
                    <label htmlFor="ppdb-nama-anak">Nama Anak</label>
                    <input
                      id="ppdb-nama-anak"
                      className="input"
                      value={form.nama_anak}
                      onChange={(e) => update("nama_anak", e.target.value)}
                      required
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="ppdb-jenis-kelamin">Jenis Kelamin</label>
                    <select
                      id="ppdb-jenis-kelamin"
                      className="input"
                      value={form.jenis_kelamin}
                      onChange={(e) => update("jenis_kelamin", e.target.value)}
                    >
                      <option value="L">Laki-laki</option>
                      <option value="P">Perempuan</option>
                    </select>
                  </div>
                  <div className="field">
                    <label htmlFor="ppdb-tempat-lahir">Tempat Lahir</label>
                    <input
                      id="ppdb-tempat-lahir"
                      className="input"
                      value={form.tempat_lahir}
                      onChange={(e) => update("tempat_lahir", e.target.value)}
                      required
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="ppdb-tanggal-lahir">Tanggal Lahir</label>
                    <input
                      id="ppdb-tanggal-lahir"
                      className="input"
                      type="date"
                      value={form.tanggal_lahir}
                      onChange={(e) => update("tanggal_lahir", e.target.value)}
                      required
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="ppdb-nama-ayah">Nama Ayah</label>
                    <input
                      id="ppdb-nama-ayah"
                      className="input"
                      value={form.nama_ayah}
                      onChange={(e) => update("nama_ayah", e.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="ppdb-nama-ibu">Nama Ibu</label>
                    <input
                      id="ppdb-nama-ibu"
                      className="input"
                      value={form.nama_ibu}
                      onChange={(e) => update("nama_ibu", e.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="ppdb-email-orang-tua">Email Orang Tua</label>
                    <input
                      id="ppdb-email-orang-tua"
                      className="input"
                      type="email"
                      value={form.email_orang_tua}
                      onChange={(e) => update("email_orang_tua", e.target.value)}
                      placeholder="ortu@email.com"
                      required
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="ppdb-kelompok">Kelompok yang Dipilih</label>
                    <select
                      id="ppdb-kelompok"
                      className="input"
                      value={form.kelompok_dipilih}
                      onChange={(e) => update("kelompok_dipilih", e.target.value as Kelompok)}
                    >
                      <option value="kelompok_bermain">Kelompok Bermain</option>
                      <option value="tk_a">TK A</option>
                      <option value="tk_b">TK B</option>
                    </select>
                  </div>
                  <div className="field">
                    <label htmlFor="ppdb-tahun-ajaran">Tahun Ajaran</label>
                    <input
                      id="ppdb-tahun-ajaran"
                      className="input"
                      value={form.tahun_ajaran}
                      onChange={(e) => update("tahun_ajaran", e.target.value)}
                      required
                    />
                  </div>
                  <div className="field field-full">
                    <label htmlFor="ppdb-alamat">Alamat</label>
                    <input
                      id="ppdb-alamat"
                      className="input"
                      value={form.alamat}
                      onChange={(e) => update("alamat", e.target.value)}
                    />
                  </div>
                </div>
                <button type="submit" className="btn">
                  Daftar Sekarang
                </button>
                {error && <p className="message message-error">{error}</p>}
              </form>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
