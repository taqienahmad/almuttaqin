import { useEffect, useState } from "react";
import { jadwalApi, nilaiApi, absensiApi } from "../api/academic";
import { usersApi } from "../api/users";
import { DashboardShell } from "../components/DashboardShell";
import type { Absensi, Jadwal, Nilai, StatusAbsensi, User } from "../types";

const ABSENSI_BADGE_CLASS: Record<StatusAbsensi, string> = {
  hadir: "badge-success",
  izin: "badge-warning",
  sakit: "badge-warning",
  alpa: "badge-danger",
};

export function SiswaDashboard() {
  const [me, setMe] = useState<User | null>(null);
  const [nilaiList, setNilaiList] = useState<Nilai[]>([]);
  const [absensiList, setAbsensiList] = useState<Absensi[]>([]);
  const [jadwal, setJadwal] = useState<Jadwal[]>([]);

  useEffect(() => {
    usersApi.me().then(async (user) => {
      setMe(user);
      setNilaiList(await nilaiApi.list());
      setAbsensiList(await absensiApi.list());
      if (user.kelas_id) setJadwal(await jadwalApi.list(user.kelas_id));
    });
  }, []);

  return (
    <DashboardShell role="siswa">
      <h1>Halo, {me?.full_name ?? me?.email} 👋</h1>
      <p className="section-desc">Berikut jadwal, nilai, dan absensimu.</p>

      <section className="card">
        <h2>Jadwal Kelas</h2>
        {jadwal.length === 0 && <p className="empty-state">Belum ada jadwal.</p>}
        <ul>
          {jadwal.map((j) => (
            <li key={j.id} className="list-row">
              <span className="list-row-title">{j.hari}</span>
              <span className="list-row-meta">
                {j.jam_mulai}-{j.jam_selesai} &middot; mapel #{j.mata_pelajaran_id}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="card">
        <h2>Nilai Saya</h2>
        {nilaiList.length === 0 && <p className="empty-state">Belum ada nilai.</p>}
        <ul>
          {nilaiList.map((n) => (
            <li key={n.id} className="list-row">
              <div className="list-row-main">
                <span className="list-row-title">{n.jenis}</span>
                <span className="list-row-meta">
                  mapel #{n.mata_pelajaran_id} &middot; semester {n.semester}/{n.tahun_ajaran}
                </span>
              </div>
              <span className="badge">{n.nilai}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="card">
        <h2>Absensi Saya</h2>
        {absensiList.length === 0 && <p className="empty-state">Belum ada catatan absensi.</p>}
        <ul>
          {absensiList.map((a) => (
            <li key={a.id} className="list-row">
              <span className="list-row-title">{a.tanggal}</span>
              <span className={`badge ${ABSENSI_BADGE_CLASS[a.status]}`}>{a.status}</span>
            </li>
          ))}
        </ul>
      </section>
    </DashboardShell>
  );
}
