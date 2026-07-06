# Arsitektur: Website Taman Asuh Anak Muslim (TAAM) Al Muttaqin

## Tujuan

Website TAAM (Taman Asuh Anak Muslim) dengan tiga bagian: situs publik (pengumuman, berita,
galeri, formulir PPDB — tanpa login), portal akademik (jadwal, nilai,
absensi) untuk 4 peran (admin, guru, siswa, orang tua), dan notifikasi
email otomatis ke orang tua.

Proyek ini awalnya di-scaffold sebagai tracker timeline pekerjaan; kerangka
arsitekturnya (layering `core/api/models/schemas/services/db`, FastAPI +
PostgreSQL + React) terbukti reusable dan dipertahankan — hanya domainnya
yang diganti total.

## Stack

| Layer     | Pilihan                                   |
|-----------|--------------------------------------------|
| Backend   | Python 3.12, FastAPI, SQLAlchemy 2.0 (async) |
| Database  | PostgreSQL 16, migrasi via Alembic          |
| Frontend  | React + TypeScript + Vite                   |
| Auth      | JWT + Role-Based Access Control (RBAC)      |
| Dev infra | Docker Compose (db + backend + frontend)    |

## Struktur Folder

```
backend/app/
├── main.py            entrypoint FastAPI, mount router v1, CORS, /health
├── core/
│   ├── config.py       Settings (pydantic-settings, baca dari .env)
│   └── security.py     hashing password (bcrypt), JWT
├── api/v1/
│   ├── router.py        gabungan semua route v1
│   ├── deps.py           get_current_user, require_roles(*roles) untuk RBAC
│   └── endpoints/
│       ├── auth.py          login
│       ├── users.py         admin membuat & list akun; GET /users/me
│       ├── kelas.py          CRUD kelas
│       ├── mata_pelajaran.py CRUD mata pelajaran
│       ├── jadwal.py         CRUD jadwal pelajaran
│       ├── nilai.py          input nilai (guru) + baca scoped (siswa/ortu)
│       ├── absensi.py        input absensi (guru) + baca scoped (siswa/ortu)
│       ├── posts.py          pengumuman/berita/galeri (publik untuk baca)
│       └── ppdb.py           submit publik + admin terima/tolak pendaftaran
├── models/            SQLAlchemy ORM: User, Kelas, MataPelajaran, Jadwal,
│                        Nilai, Absensi, Post, ParentChild, PPDBRegistration
├── schemas/            Pydantic request/response models
├── services/            business logic, termasuk `scoping.py` (pola akses
│                        baca bersama untuk Nilai & Absensi) dan
│                        `notification_service.py` (kirim email via SMTP)
└── db/
    ├── base.py          declarative Base
    └── session.py        async engine + session factory

frontend/src/
├── api/                 client fetch ke backend
├── styles/theme.css      design tokens (warna, font) + utility class bersama
├── components/
│   ├── PublicNav, Footer, PatternDivider, DashboardShell
│   └── illustrations/    5 ilustrasi SVG flat (pengganti foto asli untuk galeri dummy)
├── pages/
│   ├── HomePage / GaleriPage / PostDetailPage / PPDBPage   halaman publik
│   ├── LoginPage
│   └── AdminDashboard / GuruDashboard / SiswaDashboard / OrangTuaDashboard
└── App.tsx (routing + RequireRole), main.tsx
```

## Desain UI

Tema putih-hijau (hijau zamrud `#0E6E4F` + aksen emas `#C79A3D`) khas identitas
TAAM Islami, font `Poppins` (heading) + `Nunito Sans` (body) via Google Fonts.
Token warna/tipografi/komponen (card, badge, button, form) dipusatkan di
`styles/theme.css` — halaman baru tinggal pakai class yang sudah ada, bukan
menulis CSS ulang. Ilustrasi galeri/hero pakai SVG buatan sendiri
(`components/illustrations/`), bukan foto stok, supaya tetap jalan tanpa
dependency gambar eksternal dan tidak mismatch dengan tema TAAM Islami.
Data dummy realistis (kelas, siswa, guru, nilai, absensi, posts, PPDB) diisi
lewat `backend/scripts/seed_dummy.py` — lihat README untuk cara pakai.

## Role & Alur Autentikasi

- **User.role**: `admin` | `guru` | `siswa` | `orang_tua`.
- Login (`POST /api/v1/auth/login`) menghasilkan JWT — sama untuk semua role.
- **Tidak ada self-register.** Akun guru/siswa/orang tua hanya bisa dibuat
  admin lewat `POST /api/v1/users`. Akun admin pertama dibuat lewat script
  `backend/scripts/create_admin.py` (lihat README).
- Dependency `require_roles(*roles)` di `app/api/v1/deps.py` membatasi
  endpoint per role. Endpoint publik (`GET /posts`, `GET /posts/{id}`) tidak
  memakai dependency auth sama sekali.
- **Scoping baca** untuk Nilai & Absensi (siapa boleh lihat data siapa):
  admin & guru lihat semua; siswa hanya lihat miliknya sendiri; orang tua
  hanya lihat milik anak yang terhubung lewat tabel `parent_child`. Logika
  ini dipusatkan di `app/services/scoping.py` supaya tidak diduplikasi antara
  endpoint nilai dan absensi.

## Model Data Inti

- **User**: email, password (hashed), role, plus field opsional per role:
  `nis` (siswa), `nip` (guru), `kelas_id` (kelas siswa saat ini). Field
  `email` yang sudah ada juga dipakai sebagai tujuan notifikasi untuk akun
  `orang_tua` — tidak ada field kontak terpisah.
- **Kelas**: name, wali_kelas_id (referensi ke User guru — disimpan tanpa FK
  constraint untuk menghindari circular FK dengan `users.kelas_id`).
- **MataPelajaran**: name, code.
- **Jadwal**: kelas, mata pelajaran, guru, hari, jam mulai/selesai.
- **Nilai**: siswa, mata pelajaran, jenis (tugas/uh/uts/uas), nilai, semester,
  tahun ajaran, guru pencatat.
- **Absensi**: siswa, kelas, tanggal, status (hadir/izin/sakit/alpa), guru
  pencatat.
- **Post**: satu model untuk pengumuman, berita, dan galeri (dibedakan field
  `type`), `is_published` + `published_at` untuk kontrol publikasi.
- **ParentChild**: tabel asosiasi many-to-many antara orang tua dan siswa —
  juga dipakai `notification_service` untuk cari email tujuan.
- **PPDBRegistration**: data calon siswa (nama, tempat/tanggal lahir, nama
  orang tua, `email_orang_tua`, kelompok yang dipilih — kelompok bermain/
  TK A/TK B, tahun ajaran), `status` (pending/diterima/ditolak). Tidak
  terhubung ke `User` — submission publik tidak butuh akun; setelah
  diterima, admin tetap membuat akun siswa/orang tua secara manual lewat
  `POST /api/v1/users`.

## Notifikasi Email

- **Kirim lewat SMTP biasa** (bukan layanan pihak ketiga berbayar — bisa pakai
  Gmail App Password gratis atau provider transaksional gratis lain),
  dipanggil di `app/services/notification_service.py`. Kalau `SMTP_HOST`
  kosong, `send_email()` cuma log & skip — fitur lain tetap jalan normal.
  `smtplib` itu blocking, jadi pengiriman sungguhan dijalankan di thread
  terpisah lewat `asyncio.to_thread()` supaya tidak memblokir event loop.
- **Trigger**: absensi baru, nilai baru, pengumuman/berita yang di-*publish*,
  dan perubahan status PPDB. Dipanggil dari endpoint (bukan service layer)
  lewat FastAPI `BackgroundTasks`, supaya request utama tidak menunggu
  proses kirim email.
- **Gotcha penting**: query DB (cari email orang tua lewat `parent_child`)
  harus selesai *sebelum* request selesai, karena sesi DB (`get_db`
  dependency) sudah ditutup FastAPI begitu response dikirim — sebelum
  background task sempat jalan. Karena itu `notification_service` dipecah
  jadi dua tahap: fungsi `get_parent_emails()` (query DB, dipanggil sinkron
  di endpoint) dan `send_email()` (SMTP call murni, aman dijadwalkan via
  `background_tasks.add_task()`).
- Orang tua & siswa harus dihubungkan dulu lewat
  `POST /api/v1/users/{parent_id}/children/{student_id}` (admin only) supaya
  notifikasi tahu email tujuan. Notifikasi dikirim ke `User.email` yang sama
  dengan yang dipakai orang tua untuk login — tidak ada field kontak
  terpisah.

## Versioning API

Semua endpoint di bawah `/api/v1/...`, dokumentasi otomatis di `/docs` dan
`/redoc`. Struktur ini dipertahankan dari desain awal meskipun fokus proyek
sudah bergeser dari "integrasi API pihak ketiga" ke website sekolah — tetap
best practice untuk evolusi API ke depan.

## Menjalankan Secara Lokal

Lihat [README.md](../README.md) di root repo.
