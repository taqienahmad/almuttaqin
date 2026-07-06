"""Seeds rich dummy content for demoing the UI: kelas, mata pelajaran, guru,
siswa, orang tua (with some parent-child links), jadwal, nilai, absensi,
posts (pengumuman/berita/galeri), and PPDB registrations.

Safe to re-run: if "Kelompok Bermain" already exists, the whole seed is
skipped so it never creates duplicates (avoids the same duplicate-name 500
bug that was previously fixed for POST /kelas).

Usage (from backend/): python -m scripts.seed_dummy
"""

import asyncio
from datetime import date, datetime, time, timezone

from sqlalchemy import select

from app.core.security import hash_password
from app.db.session import async_session_maker
from app.models.absensi import Absensi, StatusAbsensiEnum
from app.models.jadwal import HariEnum, Jadwal
from app.models.kelas import Kelas
from app.models.mata_pelajaran import MataPelajaran
from app.models.nilai import JenisNilaiEnum, Nilai
from app.models.parent_child import ParentChild
from app.models.post import Post, PostType
from app.models.ppdb import KelompokEnum, PPDBRegistration, PPDBStatus
from app.models.user import User, UserRole

DUMMY_PASSWORD = "Sekolah123!"


async def main() -> None:
    async with async_session_maker() as db:
        existing = await db.execute(select(Kelas).where(Kelas.name == "Kelompok Bermain"))
        if existing.scalar_one_or_none() is not None:
            print("Data dummy sudah pernah dibuat sebelumnya - dilewati (tidak ada duplikat).")
            return

        # --- Kelas ---
        kelompok_bermain = Kelas(name="Kelompok Bermain")
        tk_a = Kelas(name="TK A - Al-Fatihah")
        tk_b = Kelas(name="TK B - Al-Ikhlas")
        db.add_all([kelompok_bermain, tk_a, tk_b])
        await db.flush()

        # --- Mata Pelajaran ---
        mapel_tahsin = MataPelajaran(name="Tahsin & Tahfidz Qur'an", code="TQ")
        mapel_aqidah = MataPelajaran(name="Aqidah Akhlak", code="AA")
        mapel_calistung = MataPelajaran(name="Calistung", code="CT")
        mapel_motorik = MataPelajaran(name="Motorik & Seni", code="MS")
        mapel_inggris = MataPelajaran(name="Bahasa Inggris", code="BI")
        db.add_all([mapel_tahsin, mapel_aqidah, mapel_calistung, mapel_motorik, mapel_inggris])
        await db.flush()

        # --- Guru ---
        guru_fatimah = User(
            email="ustadzah.fatimah@almuttaqin.sch.id",
            full_name="Ustadzah Fatimah Azzahra",
            hashed_password=hash_password(DUMMY_PASSWORD),
            role=UserRole.GURU,
            nip="G001",
        )
        guru_abdullah = User(
            email="ustadz.abdullah@almuttaqin.sch.id",
            full_name="Ustadz Abdullah Hakim",
            hashed_password=hash_password(DUMMY_PASSWORD),
            role=UserRole.GURU,
            nip="G002",
        )
        guru_khadijah = User(
            email="ustadzah.khadijah@almuttaqin.sch.id",
            full_name="Ustadzah Khadijah Nur",
            hashed_password=hash_password(DUMMY_PASSWORD),
            role=UserRole.GURU,
            nip="G003",
        )
        db.add_all([guru_fatimah, guru_abdullah, guru_khadijah])
        await db.flush()

        kelompok_bermain.wali_kelas_id = guru_fatimah.id
        tk_a.wali_kelas_id = guru_abdullah.id
        tk_b.wali_kelas_id = guru_khadijah.id

        # --- Siswa ---
        siswa_data = [
            ("Ahmad Zaki Ramadhan", "S001", kelompok_bermain.id),
            ("Aisyah Putri Nur", "S002", kelompok_bermain.id),
            ("Muhammad Fathir Al Ghazali", "S003", tk_a.id),
            ("Siti Nur Aini", "S004", tk_a.id),
            ("Yusuf Ibrahim Maulana", "S005", tk_a.id),
            ("Khadijah Salsabila", "S006", tk_b.id),
            ("Umar Faruq Setiawan", "S007", tk_b.id),
            ("Fatimah Az-Zahra Putri", "S008", tk_b.id),
        ]
        siswa_list = [
            User(
                email=f"{nis.lower()}@siswa.almuttaqin.sch.id",
                full_name=nama,
                hashed_password=hash_password(DUMMY_PASSWORD),
                role=UserRole.SISWA,
                nis=nis,
                kelas_id=kelas_id,
            )
            for nama, nis, kelas_id in siswa_data
        ]
        db.add_all(siswa_list)
        await db.flush()

        # --- Orang tua (sebagian ditautkan ke siswa) ---
        orang_tua_data = [
            ("Bapak Ridwan Hidayat", "ortu.ridwan@example.com", [siswa_list[0]]),
            ("Ibu Siti Maryam", "ortu.maryam@example.com", [siswa_list[1]]),
            ("Bapak Hendra Gunawan", "ortu.hendra@example.com", [siswa_list[2], siswa_list[3]]),
            ("Ibu Wulan Sari", "ortu.wulan@example.com", [siswa_list[4]]),
            ("Bapak Agus Salim", "ortu.agus@example.com", [siswa_list[5]]),
        ]
        for nama, email, _ in orang_tua_data:
            db.add(
                User(
                    email=email,
                    full_name=nama,
                    hashed_password=hash_password(DUMMY_PASSWORD),
                    role=UserRole.ORANG_TUA,
                )
            )
        await db.flush()

        for nama, email, children in orang_tua_data:
            result = await db.execute(select(User).where(User.email == email))
            parent = result.scalar_one()
            for child in children:
                db.add(ParentChild(parent_user_id=parent.id, student_user_id=child.id))

        # --- Jadwal ---
        jadwal_rows = [
            (kelompok_bermain.id, mapel_tahsin.id, guru_fatimah.id, HariEnum.SENIN, time(8, 0), time(9, 0)),
            (kelompok_bermain.id, mapel_motorik.id, guru_fatimah.id, HariEnum.RABU, time(8, 0), time(9, 0)),
            (tk_a.id, mapel_tahsin.id, guru_abdullah.id, HariEnum.SENIN, time(8, 0), time(9, 0)),
            (tk_a.id, mapel_calistung.id, guru_abdullah.id, HariEnum.SELASA, time(9, 0), time(10, 0)),
            (tk_b.id, mapel_aqidah.id, guru_khadijah.id, HariEnum.KAMIS, time(8, 0), time(9, 0)),
            (tk_b.id, mapel_inggris.id, guru_khadijah.id, HariEnum.JUMAT, time(9, 0), time(10, 0)),
        ]
        for kelas_id, mapel_id, guru_id, hari, mulai, selesai in jadwal_rows:
            db.add(
                Jadwal(
                    kelas_id=kelas_id,
                    mata_pelajaran_id=mapel_id,
                    guru_id=guru_id,
                    hari=hari,
                    jam_mulai=mulai,
                    jam_selesai=selesai,
                )
            )

        # --- Nilai (2 per siswa) ---
        guru_by_kelas = {
            kelompok_bermain.id: guru_fatimah.id,
            tk_a.id: guru_abdullah.id,
            tk_b.id: guru_khadijah.id,
        }
        for nama, nis, kelas_id in siswa_data:
            siswa = next(s for s in siswa_list if s.nis == nis)
            guru_id = guru_by_kelas[kelas_id]
            db.add(
                Nilai(
                    siswa_id=siswa.id,
                    mata_pelajaran_id=mapel_tahsin.id,
                    guru_id=guru_id,
                    jenis=JenisNilaiEnum.UH,
                    nilai=88.0,
                    semester=1,
                    tahun_ajaran="2025/2026",
                )
            )
            db.add(
                Nilai(
                    siswa_id=siswa.id,
                    mata_pelajaran_id=mapel_calistung.id,
                    guru_id=guru_id,
                    jenis=JenisNilaiEnum.TUGAS,
                    nilai=90.0,
                    semester=1,
                    tahun_ajaran="2025/2026",
                )
            )

        # --- Absensi (beberapa tanggal per siswa) ---
        tanggal_list = [date(2026, 7, 1), date(2026, 7, 2), date(2026, 7, 3)]
        status_cycle = [StatusAbsensiEnum.HADIR, StatusAbsensiEnum.HADIR, StatusAbsensiEnum.SAKIT]
        for nama, nis, kelas_id in siswa_data:
            siswa = next(s for s in siswa_list if s.nis == nis)
            guru_id = guru_by_kelas[kelas_id]
            for tanggal, status in zip(tanggal_list, status_cycle):
                db.add(
                    Absensi(
                        siswa_id=siswa.id,
                        kelas_id=kelas_id,
                        guru_id=guru_id,
                        tanggal=tanggal,
                        status=status,
                    )
                )

        # --- Posts (pengumuman, berita, galeri) ---
        now = datetime.now(timezone.utc)
        posts = [
            Post(
                author_id=guru_fatimah.id,
                type=PostType.PENGUMUMAN,
                title="Libur Semester Ganjil 2025/2026",
                content="Assalamu'alaikum, kegiatan belajar mengajar libur mulai 20 Desember hingga 4 Januari. Masuk kembali 5 Januari 2026.",
                is_published=True,
                published_at=now,
            ),
            Post(
                author_id=guru_fatimah.id,
                type=PostType.PENGUMUMAN,
                title="Jadwal Manasik Haji Mini",
                content="Kegiatan manasik haji mini untuk seluruh siswa akan dilaksanakan di halaman sekolah, mohon anak menggunakan pakaian ihram sederhana.",
                is_published=True,
                published_at=now,
            ),
            Post(
                author_id=guru_fatimah.id,
                type=PostType.PENGUMUMAN,
                title="Pembagian Rapor Semester Ganjil",
                content="Rapor semester ganjil dapat diambil orang tua/wali pada hari Sabtu, 10 Januari 2026 pukul 08.00-12.00.",
                is_published=True,
                published_at=now,
            ),
            Post(
                author_id=guru_abdullah.id,
                type=PostType.BERITA,
                title="Wisuda Tahfidz Angkatan 2026 Berjalan Khidmat",
                content="Alhamdulillah, wisuda tahfidz juz 30 angkatan 2026 berjalan lancar dan khidmat, dihadiri seluruh wali murid.",
                is_published=True,
                published_at=now,
            ),
            Post(
                author_id=guru_khadijah.id,
                type=PostType.BERITA,
                title="Kunjungan Edukasi ke Masjid Raya",
                content="Anak-anak TK A dan TK B berkunjung ke Masjid Raya untuk belajar adab dan sejarah masjid.",
                is_published=True,
                published_at=now,
            ),
            Post(
                author_id=guru_fatimah.id,
                type=PostType.GALERI,
                title="Kegiatan Mengaji Pagi",
                is_published=True,
                published_at=now,
            ),
            Post(
                author_id=guru_fatimah.id,
                type=PostType.GALERI,
                title="Praktik Sholat Dhuha Berjamaah",
                is_published=True,
                published_at=now,
            ),
            Post(
                author_id=guru_abdullah.id,
                type=PostType.GALERI,
                title="Outbound & Bermain Bersama",
                is_published=True,
                published_at=now,
            ),
            Post(
                author_id=guru_khadijah.id,
                type=PostType.GALERI,
                title="Wisuda Tahfidz Angkatan 2026",
                is_published=True,
                published_at=now,
            ),
        ]
        db.add_all(posts)

        # --- PPDB ---
        db.add_all(
            [
                PPDBRegistration(
                    nama_anak="Muhammad Rizky Ramadhan",
                    tempat_lahir="Tangerang",
                    tanggal_lahir=date(2022, 3, 14),
                    jenis_kelamin="L",
                    nama_ayah="Bapak Rahmat Ramadhan",
                    nama_ibu="Ibu Dewi Ramadhan",
                    email_orang_tua="calon.rizky@example.com",
                    alamat="Jl. Melati No. 12, Tangerang",
                    kelompok_dipilih=KelompokEnum.KELOMPOK_BERMAIN,
                    tahun_ajaran="2026/2027",
                    status=PPDBStatus.PENDING,
                ),
                PPDBRegistration(
                    nama_anak="Nabila Putri Ayu",
                    tempat_lahir="Jakarta",
                    tanggal_lahir=date(2021, 8, 2),
                    jenis_kelamin="P",
                    nama_ayah="Bapak Yanto Putra",
                    nama_ibu="Ibu Rina Ayu",
                    email_orang_tua="calon.nabila@example.com",
                    alamat="Jl. Kenanga No. 5, Jakarta",
                    kelompok_dipilih=KelompokEnum.TK_A,
                    tahun_ajaran="2026/2027",
                    status=PPDBStatus.DITERIMA,
                    catatan_admin="Dokumen lengkap, diterima.",
                ),
                PPDBRegistration(
                    nama_anak="Bintang Al Fatih",
                    tempat_lahir="Bekasi",
                    tanggal_lahir=date(2022, 1, 20),
                    jenis_kelamin="L",
                    nama_ayah="Bapak Fauzi Al Fatih",
                    nama_ibu="Ibu Nita Sari",
                    email_orang_tua="calon.bintang@example.com",
                    alamat="Jl. Anggrek No. 8, Bekasi",
                    kelompok_dipilih=KelompokEnum.KELOMPOK_BERMAIN,
                    tahun_ajaran="2026/2027",
                    status=PPDBStatus.DITOLAK,
                    catatan_admin="Kuota kelompok bermain tahun ini sudah penuh.",
                ),
            ]
        )

        await db.commit()

    print("Data dummy berhasil dibuat:")
    print("- 3 kelas, 5 mata pelajaran, 3 guru, 8 siswa, 5 orang tua (sebagian tertaut)")
    print("- Jadwal, nilai, dan absensi contoh untuk tiap siswa")
    print("- 3 pengumuman, 2 berita, 4 galeri (memakai ilustrasi bawaan, tanpa foto asli)")
    print("- 3 pendaftaran PPDB (pending/diterima/ditolak)")
    print(f"Semua akun dummy (guru/siswa/orang tua) pakai password: {DUMMY_PASSWORD}")


if __name__ == "__main__":
    asyncio.run(main())
