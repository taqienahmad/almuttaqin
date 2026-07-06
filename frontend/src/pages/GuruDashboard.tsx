import { FormEvent, useEffect, useState } from "react";
import { absensiApi, jadwalApi, mataPelajaranApi, nilaiApi } from "../api/academic";
import { usersApi } from "../api/users";
import { DashboardShell } from "../components/DashboardShell";
import type { Absensi, Jadwal, JenisNilai, MataPelajaran, Nilai, StatusAbsensi, User } from "../types";

const ABSENSI_BADGE_CLASS: Record<StatusAbsensi, string> = {
  hadir: "badge-success",
  izin: "badge-warning",
  sakit: "badge-warning",
  alpa: "badge-danger",
};

export function GuruDashboard() {
  const [me, setMe] = useState<User | null>(null);
  const [jadwal, setJadwal] = useState<Jadwal[]>([]);
  const [nilaiList, setNilaiList] = useState<Nilai[]>([]);
  const [absensiList, setAbsensiList] = useState<Absensi[]>([]);
  const [mapelList, setMapelList] = useState<MataPelajaran[]>([]);

  const [siswaId, setSiswaId] = useState("");
  const [mapelId, setMapelId] = useState("");
  const [jenis, setJenis] = useState<JenisNilai>("tugas");
  const [nilaiValue, setNilaiValue] = useState("");
  const [semester, setSemester] = useState("1");
  const [tahunAjaran, setTahunAjaran] = useState("2025/2026");

  const [absensiSiswaId, setAbsensiSiswaId] = useState("");
  const [absensiKelasId, setAbsensiKelasId] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [status, setStatus] = useState<StatusAbsensi>("hadir");

  async function refresh() {
    setNilaiList(await nilaiApi.list());
    setAbsensiList(await absensiApi.list());
    setMapelList(await mataPelajaranApi.list());
    setJadwal(await jadwalApi.list());
  }

  useEffect(() => {
    usersApi.me().then(setMe);
    refresh();
  }, []);

  async function handleCreateNilai(e: FormEvent) {
    e.preventDefault();
    await nilaiApi.create({
      siswa_id: Number(siswaId),
      mata_pelajaran_id: Number(mapelId),
      jenis,
      nilai: Number(nilaiValue),
      semester: Number(semester),
      tahun_ajaran: tahunAjaran,
    });
    setSiswaId("");
    setNilaiValue("");
    refresh();
  }

  async function handleCreateAbsensi(e: FormEvent) {
    e.preventDefault();
    await absensiApi.create({
      siswa_id: Number(absensiSiswaId),
      kelas_id: Number(absensiKelasId),
      tanggal,
      status,
    });
    setAbsensiSiswaId("");
    setTanggal("");
    refresh();
  }

  const jadwalMengajar = me ? jadwal.filter((j) => j.guru_id === me.id) : [];

  return (
    <DashboardShell role="guru">
      <h1>Dashboard Guru</h1>
      <p className="section-desc">Kelola nilai, absensi, dan lihat jadwal mengajar Anda.</p>

      <section className="card">
        <h2>Jadwal Mengajar</h2>
        {jadwalMengajar.length === 0 && <p className="empty-state">Belum ada jadwal.</p>}
        <ul>
          {jadwalMengajar.map((j) => (
            <li key={j.id} className="list-row">
              <span className="list-row-title">{j.hari}</span>
              <span className="list-row-meta">
                {j.jam_mulai}-{j.jam_selesai} &middot; kelas #{j.kelas_id}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="card">
        <h2>Input Nilai</h2>
        <form onSubmit={handleCreateNilai} className="form-row">
          <div className="field">
            <label htmlFor="guru-nilai-siswa">ID Siswa</label>
            <input
              id="guru-nilai-siswa"
              className="input"
              value={siswaId}
              onChange={(e) => setSiswaId(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="guru-nilai-mapel">Mata pelajaran</label>
            <select
              id="guru-nilai-mapel"
              className="input"
              value={mapelId}
              onChange={(e) => setMapelId(e.target.value)}
              required
            >
              <option value="">Pilih mapel</option>
              {mapelList.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="guru-nilai-jenis">Jenis</label>
            <select
              id="guru-nilai-jenis"
              className="input"
              value={jenis}
              onChange={(e) => setJenis(e.target.value as JenisNilai)}
            >
              <option value="tugas">Tugas</option>
              <option value="uh">UH</option>
              <option value="uts">UTS</option>
              <option value="uas">UAS</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="guru-nilai-value">Nilai</label>
            <input
              id="guru-nilai-value"
              className="input"
              type="number"
              value={nilaiValue}
              onChange={(e) => setNilaiValue(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="guru-nilai-semester">Semester</label>
            <input
              id="guru-nilai-semester"
              className="input"
              type="number"
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="guru-nilai-tahun">Tahun ajaran</label>
            <input
              id="guru-nilai-tahun"
              className="input"
              value={tahunAjaran}
              onChange={(e) => setTahunAjaran(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn">
            Simpan Nilai
          </button>
        </form>
        {nilaiList.length === 0 && <p className="empty-state">Belum ada nilai.</p>}
        <ul>
          {nilaiList.map((n) => (
            <li key={n.id} className="list-row">
              <div className="list-row-main">
                <span className="list-row-title">Siswa #{n.siswa_id}</span>
                <span className="list-row-meta">
                  {n.jenis} &middot; semester {n.semester} / {n.tahun_ajaran}
                </span>
              </div>
              <span className="badge">{n.nilai}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="card">
        <h2>Input Absensi</h2>
        <form onSubmit={handleCreateAbsensi} className="form-row">
          <div className="field">
            <label htmlFor="guru-absensi-siswa">ID Siswa</label>
            <input
              id="guru-absensi-siswa"
              className="input"
              value={absensiSiswaId}
              onChange={(e) => setAbsensiSiswaId(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="guru-absensi-kelas">ID Kelas</label>
            <input
              id="guru-absensi-kelas"
              className="input"
              value={absensiKelasId}
              onChange={(e) => setAbsensiKelasId(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="guru-absensi-tanggal">Tanggal</label>
            <input
              id="guru-absensi-tanggal"
              className="input"
              type="date"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="guru-absensi-status">Status</label>
            <select
              id="guru-absensi-status"
              className="input"
              value={status}
              onChange={(e) => setStatus(e.target.value as StatusAbsensi)}
            >
              <option value="hadir">Hadir</option>
              <option value="izin">Izin</option>
              <option value="sakit">Sakit</option>
              <option value="alpa">Alpa</option>
            </select>
          </div>
          <button type="submit" className="btn">
            Simpan Absensi
          </button>
        </form>
        {absensiList.length === 0 && <p className="empty-state">Belum ada catatan absensi.</p>}
        <ul>
          {absensiList.map((a) => (
            <li key={a.id} className="list-row">
              <div className="list-row-main">
                <span className="list-row-title">Siswa #{a.siswa_id}</span>
                <span className="list-row-meta">{a.tanggal}</span>
              </div>
              <span className={`badge ${ABSENSI_BADGE_CLASS[a.status]}`}>{a.status}</span>
            </li>
          ))}
        </ul>
      </section>
    </DashboardShell>
  );
}
