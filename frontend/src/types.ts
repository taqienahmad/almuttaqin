export type UserRole = "admin" | "guru" | "siswa" | "orang_tua";

export interface User {
  id: number;
  email: string;
  full_name: string | null;
  role: UserRole;
  nis: string | null;
  nip: string | null;
  kelas_id: number | null;
  is_active: boolean;
  created_at: string;
}

export interface UserCreateInput {
  email: string;
  password: string;
  full_name?: string;
  role: UserRole;
  nis?: string;
  nip?: string;
  kelas_id?: number;
}

export interface Kelas {
  id: number;
  name: string;
  wali_kelas_id: number | null;
}

export interface MataPelajaran {
  id: number;
  name: string;
  code: string;
}

export type Hari = "senin" | "selasa" | "rabu" | "kamis" | "jumat" | "sabtu";

export interface Jadwal {
  id: number;
  kelas_id: number;
  mata_pelajaran_id: number;
  guru_id: number;
  hari: Hari;
  jam_mulai: string;
  jam_selesai: string;
}

export type JenisNilai = "tugas" | "uh" | "uts" | "uas";

export interface Nilai {
  id: number;
  siswa_id: number;
  mata_pelajaran_id: number;
  guru_id: number;
  jenis: JenisNilai;
  nilai: number;
  semester: number;
  tahun_ajaran: string;
}

export type StatusAbsensi = "hadir" | "izin" | "sakit" | "alpa";

export interface Absensi {
  id: number;
  siswa_id: number;
  kelas_id: number;
  guru_id: number;
  tanggal: string;
  status: StatusAbsensi;
}

export type PostType = "pengumuman" | "berita" | "galeri";

export interface Post {
  id: number;
  author_id: number;
  type: PostType;
  title: string;
  content: string | null;
  image_url: string | null;
  video_url: string | null;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
}

export type Kelompok = "kelompok_bermain" | "tk_a" | "tk_b";
export type PPDBStatus = "pending" | "diterima" | "ditolak";

export interface PPDBRegistration {
  id: number;
  nama_anak: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  jenis_kelamin: string;
  nama_ayah: string | null;
  nama_ibu: string | null;
  email_orang_tua: string;
  alamat: string | null;
  kelompok_dipilih: Kelompok;
  tahun_ajaran: string;
  status: PPDBStatus;
  catatan_admin: string | null;
  created_at: string;
}

export interface PPDBInput {
  nama_anak: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  jenis_kelamin: string;
  nama_ayah?: string;
  nama_ibu?: string;
  email_orang_tua: string;
  alamat?: string;
  kelompok_dipilih: Kelompok;
  tahun_ajaran: string;
}

export interface ContactMessage {
  id: number;
  nama: string;
  email: string;
  whatsapp: string | null;
  pesan: string;
  is_read: boolean;
  created_at: string;
}

export interface ContactMessageInput {
  nama: string;
  email: string;
  whatsapp?: string;
  pesan: string;
}

export interface ContentItem {
  id: number;
  section: string;
  sort_order: number;
  icon: string | null;
  title: string;
  subtitle: string | null;
  description: string | null;
  image_url: string | null;
}
