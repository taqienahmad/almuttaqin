import { useEffect, useState } from "react";
import { absensiApi, nilaiApi } from "../api/academic";
import { usersApi } from "../api/users";
import { DashboardShell } from "../components/DashboardShell";
import type { Absensi, Nilai, StatusAbsensi, User } from "../types";

const ABSENSI_BADGE_CLASS: Record<StatusAbsensi, string> = {
  hadir: "badge-success",
  izin: "badge-warning",
  sakit: "badge-warning",
  alpa: "badge-danger",
};

export function OrangTuaDashboard() {
  const [me, setMe] = useState<User | null>(null);
  const [nilaiList, setNilaiList] = useState<Nilai[]>([]);
  const [absensiList, setAbsensiList] = useState<Absensi[]>([]);

  useEffect(() => {
    usersApi.me().then(setMe);
    nilaiApi.list().then(setNilaiList);
    absensiApi.list().then(setAbsensiList);
  }, []);

  return (
    <DashboardShell role="orang_tua">
      <h1>Assalamu'alaikum, {me?.full_name ?? me?.email}</h1>
      <p className="section-desc">Menampilkan nilai &amp; absensi ananda yang terhubung ke akun ini.</p>

      <section className="card">
        <h2>Nilai Ananda</h2>
        {nilaiList.length === 0 && <p className="empty-state">Belum ada nilai.</p>}
        <ul>
          {nilaiList.map((n) => (
            <li key={n.id} className="list-row">
              <div className="list-row-main">
                <span className="list-row-title">{n.jenis}</span>
                <span className="list-row-meta">mapel #{n.mata_pelajaran_id}</span>
              </div>
              <span className="badge">{n.nilai}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="card">
        <h2>Absensi Ananda</h2>
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
