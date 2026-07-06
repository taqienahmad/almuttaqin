import { FormEvent, useState } from "react";
import { contactApi } from "../api/contact";
import { Footer } from "../components/Footer";
import { Icon } from "../components/Icon";
import { PublicNav } from "../components/PublicNav";
import { useSchoolInfo } from "../schoolInfo";

const initialForm = { nama: "", email: "", whatsapp: "", pesan: "" };

export function KontakPage() {
  const { ADDRESS, MAPS_EMBED_URL, WHATSAPP_DISPLAY, WHATSAPP_LINK } = useSchoolInfo();
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await contactApi.submit({
        nama: form.nama,
        email: form.email,
        whatsapp: form.whatsapp || undefined,
        pesan: form.pesan,
      });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengirim pesan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <PublicNav />
      <main className="main-content">
        <div className="container">
          <p className="eyebrow">Hubungi Kami</p>
          <h1>Kontak</h1>
        </div>

        <section className="landing-section">
          <div className="container">
            <div className="about-section">
              <div className="stack">
                <div className="card">
                  <div className="icon-circle">
                    <Icon name="map-pin" />
                  </div>
                  <h3>Alamat</h3>
                  <p>{ADDRESS}</p>
                </div>
                <div className="card">
                  <div className="icon-circle">
                    <Icon name="message" />
                  </div>
                  <h3>WhatsApp</h3>
                  <p>
                    <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">
                      {WHATSAPP_DISPLAY}
                    </a>
                  </p>
                </div>
                <iframe
                  title="Lokasi TAAM Al Muttaqin"
                  src={MAPS_EMBED_URL}
                  className="contact-map"
                  loading="lazy"
                />
              </div>

              <div className="card">
                <h2>Ada Pertanyaan?</h2>
                <p className="section-desc">Kirim pesan, admin kami akan segera membalas.</p>

                {submitted ? (
                  <p className="message">
                    Terima kasih, pesan Anda sudah kami terima. Admin akan segera menghubungi
                    Anda.
                  </p>
                ) : (
                  <form onSubmit={handleSubmit} className="stack">
                    <div className="field">
                      <label htmlFor="kontak-nama">Nama</label>
                      <input
                        id="kontak-nama"
                        className="input"
                        value={form.nama}
                        onChange={(e) => update("nama", e.target.value)}
                        required
                      />
                    </div>
                    <div className="field">
                      <label htmlFor="kontak-email">Email</label>
                      <input
                        id="kontak-email"
                        className="input"
                        type="email"
                        value={form.email}
                        onChange={(e) => update("email", e.target.value)}
                        required
                      />
                    </div>
                    <div className="field">
                      <label htmlFor="kontak-whatsapp">Nomor WhatsApp (opsional)</label>
                      <input
                        id="kontak-whatsapp"
                        className="input"
                        value={form.whatsapp}
                        onChange={(e) => update("whatsapp", e.target.value)}
                        placeholder="6281234567890"
                      />
                    </div>
                    <div className="field">
                      <label htmlFor="kontak-pesan">Pesan</label>
                      <textarea
                        id="kontak-pesan"
                        className="input"
                        rows={4}
                        value={form.pesan}
                        onChange={(e) => update("pesan", e.target.value)}
                        required
                      />
                    </div>
                    <button type="submit" className="btn" disabled={loading}>
                      {loading ? "Mengirim..." : "Kirim Pesan"}
                    </button>
                    {error && <p className="message message-error">{error}</p>}
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
