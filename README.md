# Website Taman Asuh Anak Muslim (TAAM) Al Muttaqin

Situs Taman Asuh Anak Muslim (TAAM) Al Muttaqin dengan bagian publik (pengumuman, berita, galeri, formulir
PPDB) dan portal akademik (jadwal, nilai, absensi) untuk 4 peran: admin,
guru, siswa, orang tua. Absensi, nilai, pengumuman, dan status PPDB otomatis
dikirim ke orang tua lewat email. Detail desain ada di
[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Menjalankan dengan Docker Compose (disarankan)

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
docker compose up --build
```

- Backend: http://localhost:8000 (docs interaktif di `/docs`)
- Frontend: http://localhost:5173

Setelah container `db` up, jalankan migrasi dan buat akun admin pertama:

```bash
docker compose exec backend alembic revision --autogenerate -m "init"
docker compose exec backend alembic upgrade head
docker compose exec backend python -m scripts.create_admin
```

Tidak ada halaman self-register — login dengan akun admin di atas, lalu buat
akun guru/siswa/orang tua lewat dashboard admin (`/dashboard/admin` di
frontend, atau `POST /api/v1/users`).

### Aktifkan notifikasi Email (opsional)

Notifikasi (absensi, nilai, pengumuman, status PPDB) dikirim lewat SMTP biasa
— bisa pakai akun Gmail gratis (dengan App Password) atau provider transaksional
gratis lain (Brevo, Mailtrap, dst). Tanpa `SMTP_HOST`, sistem tetap jalan
normal — kirim email cukup di-skip dan dicatat di log.

1. Siapkan akun SMTP (mis. Gmail: aktifkan 2FA, buat App Password khusus).
2. Isi `backend/.env`: `SMTP_HOST`, `SMTP_PORT` (biasanya 587), `SMTP_USERNAME`,
   `SMTP_PASSWORD`, `SMTP_FROM_EMAIL`.
3. Orang tua menerima notifikasi di email akun mereka sendiri (field `email`
   yang sudah ada — tidak perlu field kontak tambahan). Hubungkan dulu akun
   orang tua ke akun siswanya lewat
   `POST /api/v1/users/{parent_id}/children/{student_id}` (admin only, atau
   lewat dashboard admin bagian "Hubungkan Orang Tua ↔ Siswa"). Tanpa
   tautan ini, notifikasi tidak tahu harus dikirim ke email siapa.

## Menjalankan Manual (tanpa Docker)

### Backend

```bash
cd backend
python -m venv .venv
./.venv/Scripts/activate        # Windows
pip install -r requirements.txt
cp .env.example .env             # sesuaikan DATABASE_URL ke Postgres lokal Anda
alembic revision --autogenerate -m "init"
alembic upgrade head
python -m scripts.create_admin   # buat akun admin pertama
uvicorn app.main:app --reload
```

Menjalankan test (memakai SQLite in-memory, tidak butuh Postgres):

```bash
pytest
```

### Isi data dummy untuk demo tampilan (opsional)

Setelah `create_admin`, jalankan ini untuk mengisi 3 kelas, 5 mata pelajaran, guru,
siswa, orang tua, nilai, absensi, pengumuman/berita/galeri, dan 3 pendaftaran
PPDB contoh — supaya tampilan tidak kosong saat demo:

```bash
python -m scripts.seed_dummy
```

Aman dijalankan berkali-kali (di-skip otomatis kalau data dummy sudah ada).
Semua akun dummy (guru/siswa/orang tua) memakai password `Sekolah123!`.

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## Endpoint Utama

| Method | Path                       | Akses                        | Keterangan                              |
|--------|-----------------------------|-------------------------------|-------------------------------------------|
| POST   | `/api/v1/auth/login`        | -                             | Login, dapat JWT                          |
| GET    | `/api/v1/users/me`          | login                         | Profil sendiri                            |
| POST   | `/api/v1/users`             | admin                         | Buat akun guru/siswa/orang tua            |
| GET    | `/api/v1/users`             | admin                         | List akun (filter `?role=`)               |
| PUT    | `/api/v1/users/{id}/password` | admin                       | Reset password akun mana pun (tidak ada "lupa password" self-service) |
| POST   | `/api/v1/users/{parent_id}/children/{student_id}` | admin   | Hubungkan akun orang tua ke akun siswa (untuk scoping baca & notifikasi email) |
| CRUD   | `/api/v1/kelas`             | admin (tulis), login (baca)   |                                            |
| CRUD   | `/api/v1/mata-pelajaran`    | admin (tulis), login (baca)   |                                            |
| CRUD   | `/api/v1/jadwal`            | admin (tulis), login (baca)   | filter `?kelas_id=`                       |
| CRUD   | `/api/v1/nilai`             | guru/admin (tulis)            | siswa/orang tua baca terbatas ke diri sendiri/anak; trigger notifikasi email |
| CRUD   | `/api/v1/absensi`           | guru/admin (tulis)            | pola akses sama seperti nilai; trigger notifikasi email |
| GET    | `/api/v1/posts`             | publik                        | hanya post yang `is_published`            |
| POST/PUT/DELETE | `/api/v1/posts`    | admin/guru                    | pengumuman, berita, galeri (`type`); publish memicu notifikasi email ke semua orang tua |
| POST   | `/api/v1/ppdb`              | publik                        | Formulir pendaftaran siswa baru, tanpa login |
| GET    | `/api/v1/ppdb`              | admin                         | List pendaftar (filter `?ppdb_status=`)   |
| PUT    | `/api/v1/ppdb/{id}/status`  | admin                         | Terima/tolak pendaftaran; trigger notifikasi email ke calon orang tua |
| POST   | `/api/v1/contact`           | publik                        | Form pertanyaan di halaman Kontak; trigger notifikasi email ke semua admin |
| GET    | `/api/v1/contact`           | admin                         | List pesan masuk (dashboard admin bagian "Pesan Masuk") |

## Struktur Menu Website (Frontend)

7 halaman publik: **Beranda** (`/`), **Profil Sekolah** (`/profil`), **Program/Kurikulum**
(`/program`), **Kegiatan** (`/kegiatan`), **PPDB** (`/ppdb`), **Galeri** (`/galeri`),
**Kontak** (`/kontak`) — sesuai struktur situs sekolah standar. Detail konten tiap
halaman ada di `docs/ARCHITECTURE.md`.

Akun pertama (admin) dibuat lewat `python -m scripts.create_admin` — bukan
lewat API, karena sengaja tidak ada endpoint self-register.

Kalau **admin sendiri** lupa password (jadi tidak bisa login sama sekali untuk
pakai endpoint `PUT /api/v1/users/{id}/password`), pakai
`python -m scripts.reset_password` dari terminal sebagai jalan pintas darurat.
