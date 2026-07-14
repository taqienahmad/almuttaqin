import { FormEvent, useEffect, useMemo, useState } from "react";
import { kelasApi, mataPelajaranApi } from "../api/academic";
import { contactApi } from "../api/contact";
import { contentItemsApi } from "../api/contentItems";
import { postsApi } from "../api/posts";
import { ppdbApi } from "../api/ppdb";
import { siteSettingsApi } from "../api/siteSettings";
import { usersApi } from "../api/users";
import { DashboardShell } from "../components/DashboardShell";
import type { IconName } from "../components/Icon";
import type {
  ContactMessage,
  ContentItem,
  Kelas,
  MataPelajaran,
  PostType,
  PPDBRegistration,
  Post,
  User,
  UserRole,
} from "../types";

const ICON_OPTIONS: IconName[] = [
  "book",
  "heart",
  "shield",
  "users",
  "palette",
  "moon-star",
  "home",
  "message",
  "map-pin",
  "sparkles",
  "sun",
  "leaf",
];

interface SiteSettingField {
  key: string;
  label: string;
  group: string;
  multiline?: boolean;
}

const SITE_SETTING_FIELDS: SiteSettingField[] = [
  { key: "hero_eyebrow", label: "Label di atas judul hero (mis. \"Bismillahirrahmanirrahim\")", group: "Beranda" },
  { key: "hero_title", label: "Judul utama hero", group: "Beranda" },
  { key: "hero_description", label: "Deskripsi hero", group: "Beranda", multiline: true },
  { key: "hero_license_text", label: "Teks info izin (di bawah logo hero)", group: "Beranda" },
  { key: "sambutan_quote", label: "Kutipan sambutan", group: "Beranda", multiline: true },
  { key: "sambutan_author", label: "Nama/jabatan penutup sambutan", group: "Beranda" },
  { key: "cta_title", label: "Judul banner ajakan daftar (CTA)", group: "Beranda" },
  { key: "cta_description", label: "Deskripsi banner CTA", group: "Beranda", multiline: true },
  { key: "sejarah", label: "Sejarah singkat", group: "Profil Sekolah", multiline: true },
  { key: "visi", label: "Visi sekolah", group: "Profil Sekolah", multiline: true },
  { key: "program_hero_title", label: "Judul utama halaman Program", group: "Program" },
  { key: "program_hero_description", label: "Deskripsi hero halaman Program", group: "Program", multiline: true },
  {
    key: "program_methodology_quote",
    label: "Kutipan motivasi di bagian metode pembelajaran",
    group: "Program",
  },
  { key: "school_name", label: "Nama sekolah lengkap", group: "Umum & Kontak" },
  { key: "footer_tagline", label: "Tagline singkat di footer", group: "Umum & Kontak" },
  { key: "address", label: "Alamat", group: "Umum & Kontak", multiline: true },
  { key: "whatsapp_number", label: "Nomor WhatsApp (format angka, mis. 6281234567890)", group: "Umum & Kontak" },
  { key: "whatsapp_display", label: "Nomor WhatsApp (format tampilan, mis. 0812-3456-7890)", group: "Umum & Kontak" },
  { key: "instagram_url", label: "Link Instagram", group: "Umum & Kontak" },
];

const SITE_SETTING_GROUPS = Array.from(new Set(SITE_SETTING_FIELDS.map((f) => f.group)));

interface ContentSectionConfig {
  value: string;
  label: string;
  group: string;
  titleLabel?: string;
  hasIcon?: boolean;
  hasSubtitle?: boolean;
  subtitleLabel?: string;
  hasDescription?: boolean;
  descriptionLabel?: string;
  hasImage?: boolean;
}

const CONTENT_SECTIONS: ContentSectionConfig[] = [
  { value: "keunggulan", label: "Keunggulan", group: "Beranda", hasIcon: true, hasDescription: true },
  { value: "foto_sekolah", label: "Foto Sekolah", group: "Galeri", hasImage: true },
  { value: "misi", label: "Misi", group: "Profil Sekolah" },
  { value: "nilai", label: "Nilai-Nilai Sekolah", group: "Profil Sekolah", hasIcon: true, hasDescription: true },
  { value: "fasilitas", label: "Fasilitas", group: "Profil Sekolah", hasIcon: true, hasDescription: true },
  {
    value: "tenaga_pendidik",
    label: "Tenaga Pendidik",
    group: "Profil Sekolah",
    titleLabel: "Nama",
    hasSubtitle: true,
    subtitleLabel: "Peran/Jabatan",
  },
  {
    value: "kelompok_usia",
    label: "Kelompok Usia",
    group: "Program",
    titleLabel: "Nama Kelompok",
    hasIcon: true,
    hasSubtitle: true,
    subtitleLabel: "Rentang Usia",
    hasDescription: true,
  },
  {
    value: "kompetensi",
    label: "Kompetensi Pembelajaran",
    group: "Program",
    hasIcon: true,
    hasDescription: true,
    descriptionLabel:
      "Deskripsi & Highlight (baris pertama = penjelasan, hingga 4 baris berikutnya = poin highlight — 2 item pertama tampil sebagai kartu unggulan di halaman Program)",
  },
  { value: "metode", label: "Metode Pembelajaran", group: "Program" },
  {
    value: "jadwal_harian",
    label: "Jadwal Harian",
    group: "Program",
    titleLabel: "Waktu",
    hasSubtitle: true,
    subtitleLabel: "Kegiatan",
    hasDescription: true,
    descriptionLabel:
      "Deskripsi & Highlight (baris pertama = penjelasan, hingga 3 baris berikutnya = poin highlight)",
  },
  { value: "syarat_ppdb", label: "Syarat Pendaftaran", group: "PPDB" },
  { value: "alur_ppdb", label: "Alur Pendaftaran", group: "PPDB", hasDescription: true },
  { value: "biaya_ppdb", label: "Kategori Biaya", group: "PPDB" },
];

const CONTENT_GROUPS = Array.from(new Set(CONTENT_SECTIONS.map((s) => s.group)));

const POST_TYPE_LABEL: Record<PostType, string> = {
  pengumuman: "Pengumuman",
  berita: "Berita",
  galeri: "Galeri",
};

interface PostTemplate {
  label: string;
  titlePattern: string;
  contentGuide: string;
}

const POST_TEMPLATES: Record<PostType, PostTemplate[]> = {
  pengumuman: [
    {
      label: "Bebas / Umum",
      titlePattern: "",
      contentGuide: "Tulis informasi penting secara singkat dan jelas: apa, kapan, di mana, untuk siapa.",
    },
    {
      label: "Libur / Cuti Bersama",
      titlePattern: "Libur [Nama Libur] Tahun Ajaran 2025/2026",
      contentGuide: "Sertakan: tanggal mulai & selesai libur, tanggal masuk kembali, dan imbauan untuk orang tua bila ada.",
    },
    {
      label: "Jadwal Kegiatan / Acara",
      titlePattern: "Jadwal [Nama Kegiatan]",
      contentGuide: "Sertakan: nama kegiatan, tanggal & waktu, tempat, dan perlengkapan yang perlu dibawa anak.",
    },
    {
      label: "Pembagian Rapor / Info Akademik",
      titlePattern: "Pembagian Rapor Semester [Ganjil/Genap] 2025/2026",
      contentGuide: "Sertakan: tanggal & waktu pengambilan, siapa yang mengambil (orang tua/wali), dan lokasi.",
    },
    {
      label: "Info Pembayaran / SPP",
      titlePattern: "Informasi Pembayaran [Jenis] Bulan [Bulan]",
      contentGuide: "Sertakan: jenis pembayaran, nominal, batas waktu, dan cara pembayaran.",
    },
  ],
  berita: [
    {
      label: "Bebas / Umum",
      titlePattern: "",
      contentGuide: "Ceritakan kegiatan/berita secara singkat, jelas, dan positif.",
    },
    {
      label: "Laporan Kegiatan Selesai",
      titlePattern: "[Nama Kegiatan] Berjalan Lancar",
      contentGuide: "Ceritakan: apa yang terjadi, kapan, siapa yang terlibat, dan kesan/hasil kegiatan.",
    },
    {
      label: "Prestasi Siswa",
      titlePattern: "Selamat! [Nama/Kelompok] Meraih [Prestasi]",
      contentGuide: "Sertakan: nama siswa/kelompok, prestasi yang diraih, nama event/lomba, dan tanggal.",
    },
    {
      label: "Kunjungan / Kegiatan Edukasi",
      titlePattern: "Kunjungan Edukasi ke [Tempat]",
      contentGuide: "Jelaskan: tujuan kunjungan, apa yang dipelajari anak-anak, dan kesan kegiatan.",
    },
  ],
  galeri: [
    {
      label: "Bebas / Umum",
      titlePattern: "",
      contentGuide: "Beri judul singkat yang menjelaskan momen dalam foto/video ini.",
    },
    {
      label: "Dokumentasi Kegiatan Harian",
      titlePattern: "Kegiatan [Nama Aktivitas]",
      contentGuide: "Beri judul singkat yang menjelaskan momen, mis. 'Praktik Sholat Dhuha Berjamaah'.",
    },
    {
      label: "Dokumentasi Acara Khusus",
      titlePattern: "[Nama Acara] [Tahun]",
      contentGuide: "Sebutkan nama acara & tanggal jika relevan.",
    },
  ],
};

const PPDB_BADGE_CLASS: Record<PPDBRegistration["status"], string> = {
  pending: "badge-neutral",
  diterima: "badge-success",
  ditolak: "badge-danger",
};

export function AdminDashboard() {
  const [kelasList, setKelasList] = useState<Kelas[]>([]);
  const [mapelList, setMapelList] = useState<MataPelajaran[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [ppdbList, setPpdbList] = useState<PPDBRegistration[]>([]);
  const [userList, setUserList] = useState<User[]>([]);
  const orangTuaUsers = useMemo(() => userList.filter((u) => u.role === "orang_tua"), [userList]);
  const siswaUsers = useMemo(() => userList.filter((u) => u.role === "siswa"), [userList]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);

  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userRole, setUserRole] = useState<UserRole>("siswa");
  const [userFullName, setUserFullName] = useState("");
  const [userNis, setUserNis] = useState("");
  const [userNip, setUserNip] = useState("");
  const [userKelasId, setUserKelasId] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [editUserFullName, setEditUserFullName] = useState("");
  const [editUserNis, setEditUserNis] = useState("");
  const [editUserNip, setEditUserNip] = useState("");
  const [editUserKelasId, setEditUserKelasId] = useState("");

  const [kelasName, setKelasName] = useState("");
  const [mapelName, setMapelName] = useState("");
  const [mapelCode, setMapelCode] = useState("");
  const [postType, setPostType] = useState<PostType>("pengumuman");
  const [postTemplateIndex, setPostTemplateIndex] = useState(0);
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postImageUrl, setPostImageUrl] = useState("");
  const [postVideoUrl, setPostVideoUrl] = useState("");

  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [editType, setEditType] = useState<PostType>("pengumuman");
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");
  const [editVideoUrl, setEditVideoUrl] = useState("");

  const [parentId, setParentId] = useState("");
  const [studentId, setStudentId] = useState("");
  const [linkMessage, setLinkMessage] = useState<string | null>(null);

  const [resetUserId, setResetUserId] = useState("");
  const [resetNewPassword, setResetNewPassword] = useState("");
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  const [settingsForm, setSettingsForm] = useState<Record<string, string>>({});
  const [settingsMessage, setSettingsMessage] = useState<string | null>(null);

  const [contentSection, setContentSection] = useState(CONTENT_SECTIONS[0].value);
  const [contentList, setContentList] = useState<ContentItem[]>([]);
  const [contentTitle, setContentTitle] = useState("");
  const [contentSubtitle, setContentSubtitle] = useState("");
  const [contentDescription, setContentDescription] = useState("");
  const [contentIcon, setContentIcon] = useState<IconName>("sparkles");
  const [contentImageUrl, setContentImageUrl] = useState("");

  const [editingContentId, setEditingContentId] = useState<number | null>(null);
  const [editContentTitle, setEditContentTitle] = useState("");
  const [editContentSubtitle, setEditContentSubtitle] = useState("");
  const [editContentDescription, setEditContentDescription] = useState("");
  const [editContentIcon, setEditContentIcon] = useState<IconName>("sparkles");
  const [editContentImageUrl, setEditContentImageUrl] = useState("");

  const contentSectionConfig = CONTENT_SECTIONS.find((s) => s.value === contentSection)!;

  async function refresh() {
    setKelasList(await kelasApi.list());
    setMapelList(await mataPelajaranApi.list());
    setPosts(await postsApi.list());
    setPpdbList(await ppdbApi.list());
    setUserList(await usersApi.list());
    setContactMessages(await contactApi.list());
    setSettingsForm(await siteSettingsApi.get());
  }

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    contentItemsApi.list(contentSection).then(setContentList).catch(() => setContentList([]));
    setEditingContentId(null);
  }, [contentSection]);

  function updateSettingField(key: string, value: string) {
    setSettingsForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSaveSettings(e: FormEvent) {
    e.preventDefault();
    setSettingsMessage(null);
    try {
      await siteSettingsApi.update(settingsForm);
      setSettingsMessage("Pengaturan berhasil disimpan.");
    } catch (err) {
      setSettingsMessage(err instanceof Error ? err.message : "Gagal menyimpan pengaturan");
    }
  }

  async function refreshContentList() {
    setContentList(await contentItemsApi.list(contentSection));
  }

  async function handleCreateContentItem(e: FormEvent) {
    e.preventDefault();
    if (!contentTitle) return;
    await contentItemsApi.create({
      section: contentSection,
      sort_order: contentList.length + 1,
      icon: contentSectionConfig.hasIcon ? contentIcon : null,
      title: contentTitle,
      subtitle: contentSectionConfig.hasSubtitle ? contentSubtitle : null,
      description: contentSectionConfig.hasDescription ? contentDescription : null,
      image_url: contentSectionConfig.hasImage ? contentImageUrl || null : null,
    });
    setContentTitle("");
    setContentSubtitle("");
    setContentDescription("");
    setContentImageUrl("");
    refreshContentList();
  }

  function handleStartEditContentItem(item: ContentItem) {
    setEditingContentId(item.id);
    setEditContentTitle(item.title);
    setEditContentSubtitle(item.subtitle ?? "");
    setEditContentDescription(item.description ?? "");
    setEditContentIcon((item.icon ?? "sparkles") as IconName);
    setEditContentImageUrl(item.image_url ?? "");
  }

  function handleCancelEditContentItem() {
    setEditingContentId(null);
    setEditContentTitle("");
    setEditContentSubtitle("");
    setEditContentDescription("");
    setEditContentImageUrl("");
  }

  async function handleUpdateContentItem(e: FormEvent) {
    e.preventDefault();
    if (editingContentId === null || !editContentTitle) return;
    await contentItemsApi.update(editingContentId, {
      icon: contentSectionConfig.hasIcon ? editContentIcon : null,
      title: editContentTitle,
      subtitle: contentSectionConfig.hasSubtitle ? editContentSubtitle : null,
      description: contentSectionConfig.hasDescription ? editContentDescription : null,
      image_url: contentSectionConfig.hasImage ? editContentImageUrl.trim() || null : null,
    });
    handleCancelEditContentItem();
    refreshContentList();
  }

  async function handleDeleteContentItem(id: number) {
    if (!window.confirm("Hapus item ini? Tindakan ini tidak bisa dibatalkan.")) return;
    await contentItemsApi.remove(id);
    refreshContentList();
  }

  async function handleCreateUser(e: FormEvent) {
    e.preventDefault();
    setMessage(null);
    try {
      await usersApi.create({
        email: userEmail,
        password: userPassword,
        role: userRole,
        full_name: userFullName.trim() || undefined,
        nis: userRole === "siswa" ? userNis.trim() || undefined : undefined,
        nip: userRole === "guru" ? userNip.trim() || undefined : undefined,
        kelas_id: userRole === "siswa" && userKelasId ? Number(userKelasId) : undefined,
      });
      setMessage(`Akun ${userEmail} (${userRole}) berhasil dibuat.`);
      setUserEmail("");
      setUserPassword("");
      setUserFullName("");
      setUserNis("");
      setUserNip("");
      setUserKelasId("");
      refresh();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Gagal membuat akun");
    }
  }

  async function handleCreateKelas(e: FormEvent) {
    e.preventDefault();
    if (!kelasName) return;
    await kelasApi.create({ name: kelasName });
    setKelasName("");
    refresh();
  }

  async function handleCreateMapel(e: FormEvent) {
    e.preventDefault();
    if (!mapelName || !mapelCode) return;
    await mataPelajaranApi.create({ name: mapelName, code: mapelCode });
    setMapelName("");
    setMapelCode("");
    refresh();
  }

  function handleChangePostType(type: PostType) {
    setPostType(type);
    setPostTemplateIndex(0);
  }

  function handleChangePostTemplate(index: number) {
    setPostTemplateIndex(index);
    const template = POST_TEMPLATES[postType][index];
    if (template.titlePattern) setPostTitle(template.titlePattern);
  }

  async function handleCreatePost(e: FormEvent) {
    e.preventDefault();
    if (!postTitle) return;
    await postsApi.create({
      type: postType,
      title: postTitle,
      content: postContent,
      image_url: postImageUrl || undefined,
      video_url: postVideoUrl || undefined,
      is_published: true,
    });
    setPostTitle("");
    setPostContent("");
    setPostImageUrl("");
    setPostVideoUrl("");
    setPostTemplateIndex(0);
    refresh();
  }

  function handleStartEditPost(p: Post) {
    setEditingPostId(p.id);
    setEditType(p.type);
    setEditTitle(p.title);
    setEditContent(p.content ?? "");
    setEditImageUrl(p.image_url ?? "");
    setEditVideoUrl(p.video_url ?? "");
  }

  function handleCancelEditPost() {
    setEditingPostId(null);
    setEditType("pengumuman");
    setEditTitle("");
    setEditContent("");
    setEditImageUrl("");
    setEditVideoUrl("");
  }

  async function handleUpdatePost(e: FormEvent) {
    e.preventDefault();
    if (editingPostId === null || !editTitle) return;
    await postsApi.update(editingPostId, {
      type: editType,
      title: editTitle,
      content: editContent,
      image_url: editImageUrl.trim() || null,
      video_url: editVideoUrl.trim() || null,
    });
    handleCancelEditPost();
    refresh();
  }

  async function handleDeletePost(id: number) {
    if (!window.confirm("Hapus post ini? Tindakan ini tidak bisa dibatalkan.")) return;
    await postsApi.remove(id);
    refresh();
  }

  async function handlePpdbDecision(id: number, status: "diterima" | "ditolak") {
    await ppdbApi.updateStatus(id, status);
    refresh();
  }

  function handleStartEditUser(u: User) {
    setEditingUserId(u.id);
    setEditUserFullName(u.full_name ?? "");
    setEditUserNis(u.nis ?? "");
    setEditUserNip(u.nip ?? "");
    setEditUserKelasId(u.kelas_id ? String(u.kelas_id) : "");
  }

  function handleCancelEditUser() {
    setEditingUserId(null);
    setEditUserFullName("");
    setEditUserNis("");
    setEditUserNip("");
    setEditUserKelasId("");
  }

  async function handleUpdateUser(e: FormEvent) {
    e.preventDefault();
    if (editingUserId === null) return;
    await usersApi.update(editingUserId, {
      full_name: editUserFullName.trim() || null,
      nis: editUserNis.trim() || null,
      nip: editUserNip.trim() || null,
      kelas_id: editUserKelasId ? Number(editUserKelasId) : null,
    });
    handleCancelEditUser();
    refresh();
  }

  async function handleToggleActive(u: User) {
    const action = u.is_active ? "nonaktifkan" : "aktifkan kembali";
    if (!window.confirm(`Yakin ${action} akun ${u.email}?`)) return;
    await usersApi.update(u.id, { is_active: !u.is_active });
    refresh();
  }

  async function handleLinkChild(e: FormEvent) {
    e.preventDefault();
    setLinkMessage(null);
    try {
      await usersApi.linkChild(Number(parentId), Number(studentId));
      setLinkMessage(`Orang tua #${parentId} terhubung ke siswa #${studentId}.`);
      setParentId("");
      setStudentId("");
    } catch (err) {
      setLinkMessage(err instanceof Error ? err.message : "Gagal menghubungkan");
    }
  }

  async function handleResetPassword(e: FormEvent) {
    e.preventDefault();
    setResetMessage(null);
    try {
      const updated = await usersApi.resetPassword(Number(resetUserId), resetNewPassword);
      setResetMessage(`Password untuk ${updated.email} berhasil direset.`);
      setResetUserId("");
      setResetNewPassword("");
    } catch (err) {
      setResetMessage(err instanceof Error ? err.message : "Gagal reset password");
    }
  }

  return (
    <DashboardShell role="admin">
      <h1>Dashboard Admin</h1>
      <p className="section-desc">Kelola akun, kelas, mata pelajaran, pengumuman, dan pendaftaran PPDB.</p>

      <section className="card">
        <h2>Buat Akun</h2>
        <form onSubmit={handleCreateUser} className="form-row">
          <div className="field">
            <label htmlFor="admin-user-email">Email</label>
            <input
              id="admin-user-email"
              className="input"
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="admin-user-password">Password (minimal 8 karakter)</label>
            <input
              id="admin-user-password"
              className="input"
              type="password"
              minLength={8}
              value={userPassword}
              onChange={(e) => setUserPassword(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="admin-user-role">Role</label>
            <select
              id="admin-user-role"
              className="input"
              value={userRole}
              onChange={(e) => setUserRole(e.target.value as UserRole)}
            >
              <option value="guru">Guru</option>
              <option value="siswa">Siswa</option>
              <option value="orang_tua">Orang Tua</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="admin-user-fullname">Nama Lengkap</label>
            <input
              id="admin-user-fullname"
              className="input"
              value={userFullName}
              onChange={(e) => setUserFullName(e.target.value)}
            />
          </div>
          {userRole === "siswa" && (
            <div className="field">
              <label htmlFor="admin-user-nis">NIS</label>
              <input
                id="admin-user-nis"
                className="input"
                value={userNis}
                onChange={(e) => setUserNis(e.target.value)}
              />
            </div>
          )}
          {userRole === "siswa" && (
            <div className="field">
              <label htmlFor="admin-user-kelas">Kelas</label>
              <select
                id="admin-user-kelas"
                className="input"
                value={userKelasId}
                onChange={(e) => setUserKelasId(e.target.value)}
              >
                <option value="">Belum ada kelas</option>
                {kelasList.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          {userRole === "guru" && (
            <div className="field">
              <label htmlFor="admin-user-nip">NIP</label>
              <input
                id="admin-user-nip"
                className="input"
                value={userNip}
                onChange={(e) => setUserNip(e.target.value)}
              />
            </div>
          )}
          <button type="submit" className="btn">
            Buat Akun
          </button>
        </form>
        {message && <p className="message">{message}</p>}
      </section>

      <section className="card">
        <h2>Semua Akun</h2>
        {userList.length === 0 && <p className="empty-state">Belum ada akun.</p>}
        <ul>
          {userList.map((u) =>
            editingUserId === u.id ? (
              <li key={u.id} className="list-row">
                <form onSubmit={handleUpdateUser} className="form-row">
                  <div className="field">
                    <label htmlFor="admin-user-edit-fullname">Nama Lengkap</label>
                    <input
                      id="admin-user-edit-fullname"
                      className="input"
                      value={editUserFullName}
                      onChange={(e) => setEditUserFullName(e.target.value)}
                    />
                  </div>
                  {u.role === "siswa" && (
                    <div className="field">
                      <label htmlFor="admin-user-edit-nis">NIS</label>
                      <input
                        id="admin-user-edit-nis"
                        className="input"
                        value={editUserNis}
                        onChange={(e) => setEditUserNis(e.target.value)}
                      />
                    </div>
                  )}
                  {u.role === "siswa" && (
                    <div className="field">
                      <label htmlFor="admin-user-edit-kelas">Kelas</label>
                      <select
                        id="admin-user-edit-kelas"
                        className="input"
                        value={editUserKelasId}
                        onChange={(e) => setEditUserKelasId(e.target.value)}
                      >
                        <option value="">Belum ada kelas</option>
                        {kelasList.map((k) => (
                          <option key={k.id} value={k.id}>
                            {k.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {u.role === "guru" && (
                    <div className="field">
                      <label htmlFor="admin-user-edit-nip">NIP</label>
                      <input
                        id="admin-user-edit-nip"
                        className="input"
                        value={editUserNip}
                        onChange={(e) => setEditUserNip(e.target.value)}
                      />
                    </div>
                  )}
                  <button type="submit" className="btn btn-sm">
                    Simpan
                  </button>
                  <button type="button" className="btn btn-sm btn-outline" onClick={handleCancelEditUser}>
                    Batal
                  </button>
                </form>
              </li>
            ) : (
              <li key={u.id} className="list-row">
                <div className="list-row-main">
                  <span className="list-row-title">
                    #{u.id} &middot; {u.email}
                  </span>
                  <span className="list-row-meta">
                    {u.full_name ?? "-"}
                    {u.nis && ` · NIS ${u.nis}`}
                    {u.nip && ` · NIP ${u.nip}`}
                    {u.kelas_id && ` · ${kelasList.find((k) => k.id === u.kelas_id)?.name ?? "kelas #" + u.kelas_id}`}
                  </span>
                </div>
                <span className="badge">{u.role}</span>
                <span className={u.is_active ? "badge badge-success" : "badge badge-danger"}>
                  {u.is_active ? "Aktif" : "Nonaktif"}
                </span>
                <button type="button" className="btn btn-sm btn-outline" onClick={() => handleStartEditUser(u)}>
                  Edit
                </button>
                <button type="button" className="btn btn-sm btn-danger" onClick={() => handleToggleActive(u)}>
                  {u.is_active ? "Nonaktifkan" : "Aktifkan"}
                </button>
              </li>
            ),
          )}
        </ul>
      </section>

      <section className="card">
        <h2>Reset Password</h2>
        <form onSubmit={handleResetPassword} className="form-row">
          <div className="field">
            <label htmlFor="admin-reset-user">Akun</label>
            <select
              id="admin-reset-user"
              className="input"
              value={resetUserId}
              onChange={(e) => setResetUserId(e.target.value)}
              required
            >
              <option value="">Pilih akun</option>
              {userList.map((u) => (
                <option key={u.id} value={u.id}>
                  #{u.id} &mdash; {u.email} ({u.role})
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="admin-reset-password">Password baru (minimal 8 karakter)</label>
            <input
              id="admin-reset-password"
              className="input"
              type="password"
              minLength={8}
              value={resetNewPassword}
              onChange={(e) => setResetNewPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn">
            Reset Password
          </button>
        </form>
        {resetMessage && <p className="message">{resetMessage}</p>}
      </section>

      <section className="card">
        <h2>Hubungkan Orang Tua &harr; Siswa</h2>
        <p className="section-desc">
          Dibutuhkan supaya orang tua bisa lihat nilai/absensi anak &amp; dapat notifikasi email.
        </p>
        <form onSubmit={handleLinkChild} className="form-row">
          <div className="field">
            <label htmlFor="admin-link-parent">Orang Tua</label>
            <select
              id="admin-link-parent"
              className="input"
              value={parentId}
              onChange={(e) => setParentId(e.target.value)}
              required
            >
              <option value="">Pilih orang tua</option>
              {orangTuaUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.full_name ?? u.email} (#{u.id})
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="admin-link-student">Siswa</label>
            <select
              id="admin-link-student"
              className="input"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              required
            >
              <option value="">Pilih siswa</option>
              {siswaUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.full_name ?? u.email} (#{u.id})
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn">
            Hubungkan
          </button>
        </form>
        {linkMessage && <p className="message">{linkMessage}</p>}
      </section>

      <section className="card">
        <h2>Pesan Masuk</h2>
        {contactMessages.length === 0 && <p className="empty-state">Belum ada pesan.</p>}
        <ul>
          {contactMessages.map((m) => (
            <li key={m.id} className="list-row">
              <div className="list-row-main">
                <span className="list-row-title">
                  {m.nama} &middot; {m.email}
                </span>
                <span className="list-row-meta">{m.pesan}</span>
              </div>
              {m.whatsapp && (
                <a
                  href={`https://wa.me/${m.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-outline"
                >
                  Balas WA
                </a>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="card">
        <h2>PPDB &mdash; Pendaftar Baru</h2>
        {ppdbList.length === 0 && <p className="empty-state">Belum ada pendaftar.</p>}
        <ul>
          {ppdbList.map((p) => (
            <li key={p.id} className="list-row">
              <div className="list-row-main">
                <span className="list-row-title">{p.nama_anak}</span>
                <span className="list-row-meta">
                  {p.kelompok_dipilih} &middot; {p.tahun_ajaran}
                </span>
              </div>
              <div className="ppdb-actions">
                <span className={`badge ${PPDB_BADGE_CLASS[p.status]}`}>{p.status}</span>
                {p.status === "pending" && (
                  <>
                    <button type="button" className="btn btn-sm" onClick={() => handlePpdbDecision(p.id, "diterima")}>
                      Terima
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-danger"
                      onClick={() => handlePpdbDecision(p.id, "ditolak")}
                    >
                      Tolak
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="card">
        <h2>Kelas</h2>
        <form onSubmit={handleCreateKelas} className="form-row">
          <div className="field">
            <label htmlFor="admin-kelas-name">Nama kelas</label>
            <input
              id="admin-kelas-name"
              className="input"
              placeholder="mis. TK A - Al-Fatihah"
              value={kelasName}
              onChange={(e) => setKelasName(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn">
            Tambah Kelas
          </button>
        </form>
        <ul>
          {kelasList.map((k) => (
            <li key={k.id} className="list-row">
              <span className="list-row-title">{k.name}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="card">
        <h2>Mata Pelajaran</h2>
        <form onSubmit={handleCreateMapel} className="form-row">
          <div className="field">
            <label htmlFor="admin-mapel-name">Nama</label>
            <input
              id="admin-mapel-name"
              className="input"
              value={mapelName}
              onChange={(e) => setMapelName(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="admin-mapel-code">Kode</label>
            <input
              id="admin-mapel-code"
              className="input"
              value={mapelCode}
              onChange={(e) => setMapelCode(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn">
            Tambah Mapel
          </button>
        </form>
        <ul>
          {mapelList.map((m) => (
            <li key={m.id} className="list-row">
              <span className="list-row-title">{m.name}</span>
              <span className="badge">{m.code}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="card">
        <h2>Pengumuman, Berita &amp; Galeri</h2>
        <p className="section-desc">
          Pilih jenis lalu tema di bawah ini untuk mendapatkan contoh judul dan panduan isi &mdash; keduanya tetap
          bisa diedit bebas sebelum diterbitkan.
        </p>
        <form onSubmit={handleCreatePost} className="form-row">
          <div className="field">
            <label htmlFor="admin-post-type">Jenis</label>
            <select
              id="admin-post-type"
              className="input"
              value={postType}
              onChange={(e) => handleChangePostType(e.target.value as PostType)}
            >
              <option value="pengumuman">Pengumuman</option>
              <option value="berita">Berita</option>
              <option value="galeri">Galeri</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="admin-post-template">Tema</label>
            <select
              id="admin-post-template"
              className="input"
              value={postTemplateIndex}
              onChange={(e) => handleChangePostTemplate(Number(e.target.value))}
            >
              {POST_TEMPLATES[postType].map((template, index) => (
                <option key={template.label} value={index}>
                  {template.label}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="admin-post-title">Judul</label>
            <input
              id="admin-post-title"
              className="input"
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="admin-post-content">Isi</label>
            <textarea
              id="admin-post-content"
              className="input"
              rows={3}
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="admin-post-image">URL Gambar (opsional)</label>
            <input
              id="admin-post-image"
              className="input"
              type="url"
              placeholder="https://..."
              value={postImageUrl}
              onChange={(e) => setPostImageUrl(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="admin-post-video">URL Video (opsional)</label>
            <input
              id="admin-post-video"
              className="input"
              type="url"
              placeholder="Link YouTube atau file .mp4"
              value={postVideoUrl}
              onChange={(e) => setPostVideoUrl(e.target.value)}
            />
          </div>
          <button type="submit" className="btn">
            Terbitkan
          </button>
          <p className="field-hint">
            <strong>Panduan isi:</strong> {POST_TEMPLATES[postType][postTemplateIndex].contentGuide}
          </p>
        </form>
        <ul>
          {posts.map((p) =>
            editingPostId === p.id ? (
              <li key={p.id} className="list-row">
                <form onSubmit={handleUpdatePost} className="form-row">
                  <div className="field">
                    <label htmlFor="admin-post-edit-type">Jenis</label>
                    <select
                      id="admin-post-edit-type"
                      className="input"
                      value={editType}
                      onChange={(e) => setEditType(e.target.value as PostType)}
                    >
                      <option value="pengumuman">Pengumuman</option>
                      <option value="berita">Berita</option>
                      <option value="galeri">Galeri</option>
                    </select>
                  </div>
                  <div className="field">
                    <label htmlFor="admin-post-edit-title">Judul</label>
                    <input
                      id="admin-post-edit-title"
                      className="input"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="admin-post-edit-content">Isi</label>
                    <textarea
                      id="admin-post-edit-content"
                      className="input"
                      rows={3}
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="admin-post-edit-image">URL Gambar (opsional)</label>
                    <input
                      id="admin-post-edit-image"
                      className="input"
                      type="url"
                      placeholder="https://..."
                      value={editImageUrl}
                      onChange={(e) => setEditImageUrl(e.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="admin-post-edit-video">URL Video (opsional)</label>
                    <input
                      id="admin-post-edit-video"
                      className="input"
                      type="url"
                      placeholder="Link YouTube atau file .mp4"
                      value={editVideoUrl}
                      onChange={(e) => setEditVideoUrl(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="btn btn-sm">
                    Simpan
                  </button>
                  <button type="button" className="btn btn-sm btn-outline" onClick={handleCancelEditPost}>
                    Batal
                  </button>
                </form>
              </li>
            ) : (
              <li key={p.id} className="list-row">
                <div className="list-row-main">
                  <span className="list-row-title">{p.title}</span>
                  <span className="list-row-meta">{p.content}</span>
                </div>
                <span className="badge badge-gold">{POST_TYPE_LABEL[p.type]}</span>
                <button type="button" className="btn btn-sm btn-outline" onClick={() => handleStartEditPost(p)}>
                  Edit
                </button>
                <button type="button" className="btn btn-sm btn-danger" onClick={() => handleDeletePost(p.id)}>
                  Hapus
                </button>
              </li>
            ),
          )}
        </ul>
      </section>

      <section className="card">
        <h2>Pengaturan Umum</h2>
        <p className="section-desc">
          Teks yang tampil di halaman publik (hero, sambutan, alamat, WhatsApp, dll). Ubah lalu simpan &mdash;
          perubahan langsung tampil di website tanpa perlu ubah kode.
        </p>
        <form onSubmit={handleSaveSettings} className="stack">
          {SITE_SETTING_GROUPS.map((group) => (
            <div key={group}>
              <h3>{group}</h3>
              <div className="form-grid">
                {SITE_SETTING_FIELDS.filter((f) => f.group === group).map((field) => (
                  <div className="field field-full" key={field.key}>
                    <label htmlFor={`setting-${field.key}`}>{field.label}</label>
                    {field.multiline ? (
                      <textarea
                        id={`setting-${field.key}`}
                        className="input"
                        rows={3}
                        value={settingsForm[field.key] ?? ""}
                        onChange={(e) => updateSettingField(field.key, e.target.value)}
                      />
                    ) : (
                      <input
                        id={`setting-${field.key}`}
                        className="input"
                        value={settingsForm[field.key] ?? ""}
                        onChange={(e) => updateSettingField(field.key, e.target.value)}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
          <button type="submit" className="btn">
            Simpan Pengaturan
          </button>
          {settingsMessage && <p className="message">{settingsMessage}</p>}
        </form>
      </section>

      <section className="card">
        <h2>Kelola Konten Halaman</h2>
        <p className="section-desc">
          Kelola daftar/card yang tampil di halaman Beranda, Profil, Program, Kegiatan, dan PPDB &mdash; pilih
          bagian di bawah untuk melihat dan mengubah isinya.
        </p>
        <div className="field field-full">
          <label htmlFor="admin-content-section">Bagian</label>
          <select
            id="admin-content-section"
            className="input"
            value={contentSection}
            onChange={(e) => setContentSection(e.target.value)}
          >
            {CONTENT_GROUPS.map((group) => (
              <optgroup label={group} key={group}>
                {CONTENT_SECTIONS.filter((s) => s.group === group).map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        <form onSubmit={handleCreateContentItem} className="form-row">
          {contentSectionConfig.hasIcon && (
            <div className="field">
              <label htmlFor="admin-content-icon">Ikon</label>
              <select
                id="admin-content-icon"
                className="input"
                value={contentIcon}
                onChange={(e) => setContentIcon(e.target.value as IconName)}
              >
                {ICON_OPTIONS.map((icon) => (
                  <option key={icon} value={icon}>
                    {icon}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="field">
            <label htmlFor="admin-content-title">{contentSectionConfig.titleLabel ?? "Judul"}</label>
            <input
              id="admin-content-title"
              className="input"
              value={contentTitle}
              onChange={(e) => setContentTitle(e.target.value)}
              required
            />
          </div>
          {contentSectionConfig.hasSubtitle && (
            <div className="field">
              <label htmlFor="admin-content-subtitle">{contentSectionConfig.subtitleLabel ?? "Subjudul"}</label>
              <input
                id="admin-content-subtitle"
                className="input"
                value={contentSubtitle}
                onChange={(e) => setContentSubtitle(e.target.value)}
              />
            </div>
          )}
          {contentSectionConfig.hasDescription && (
            <div className="field">
              <label htmlFor="admin-content-description">{contentSectionConfig.descriptionLabel ?? "Deskripsi"}</label>
              <textarea
                id="admin-content-description"
                className="input"
                rows={4}
                value={contentDescription}
                onChange={(e) => setContentDescription(e.target.value)}
              />
            </div>
          )}
          {contentSectionConfig.hasImage && (
            <div className="field">
              <label htmlFor="admin-content-image">URL Gambar</label>
              <input
                id="admin-content-image"
                className="input"
                type="url"
                placeholder="https://..."
                value={contentImageUrl}
                onChange={(e) => setContentImageUrl(e.target.value)}
              />
            </div>
          )}
          <button type="submit" className="btn">
            Tambah Item
          </button>
        </form>

        {contentList.length === 0 && <p className="empty-state">Belum ada item di bagian ini.</p>}
        <ul>
          {contentList.map((item) =>
            editingContentId === item.id ? (
              <li key={item.id} className="list-row">
                <form onSubmit={handleUpdateContentItem} className="form-row">
                  {contentSectionConfig.hasIcon && (
                    <div className="field">
                      <label htmlFor="admin-content-edit-icon">Ikon</label>
                      <select
                        id="admin-content-edit-icon"
                        className="input"
                        value={editContentIcon}
                        onChange={(e) => setEditContentIcon(e.target.value as IconName)}
                      >
                        {ICON_OPTIONS.map((icon) => (
                          <option key={icon} value={icon}>
                            {icon}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div className="field">
                    <label htmlFor="admin-content-edit-title">{contentSectionConfig.titleLabel ?? "Judul"}</label>
                    <input
                      id="admin-content-edit-title"
                      className="input"
                      value={editContentTitle}
                      onChange={(e) => setEditContentTitle(e.target.value)}
                      required
                    />
                  </div>
                  {contentSectionConfig.hasSubtitle && (
                    <div className="field">
                      <label htmlFor="admin-content-edit-subtitle">
                        {contentSectionConfig.subtitleLabel ?? "Subjudul"}
                      </label>
                      <input
                        id="admin-content-edit-subtitle"
                        className="input"
                        value={editContentSubtitle}
                        onChange={(e) => setEditContentSubtitle(e.target.value)}
                      />
                    </div>
                  )}
                  {contentSectionConfig.hasDescription && (
                    <div className="field">
                      <label htmlFor="admin-content-edit-description">
                        {contentSectionConfig.descriptionLabel ?? "Deskripsi"}
                      </label>
                      <textarea
                        id="admin-content-edit-description"
                        className="input"
                        rows={4}
                        value={editContentDescription}
                        onChange={(e) => setEditContentDescription(e.target.value)}
                      />
                    </div>
                  )}
                  {contentSectionConfig.hasImage && (
                    <div className="field">
                      <label htmlFor="admin-content-edit-image">URL Gambar</label>
                      <input
                        id="admin-content-edit-image"
                        className="input"
                        type="url"
                        placeholder="https://..."
                        value={editContentImageUrl}
                        onChange={(e) => setEditContentImageUrl(e.target.value)}
                      />
                    </div>
                  )}
                  <button type="submit" className="btn btn-sm">
                    Simpan
                  </button>
                  <button type="button" className="btn btn-sm btn-outline" onClick={handleCancelEditContentItem}>
                    Batal
                  </button>
                </form>
              </li>
            ) : (
              <li key={item.id} className="list-row">
                <div className="list-row-main">
                  <span className="list-row-title">{item.title}</span>
                  <span className="list-row-meta">{item.subtitle ?? item.description}</span>
                </div>
                <button type="button" className="btn btn-sm btn-outline" onClick={() => handleStartEditContentItem(item)}>
                  Edit
                </button>
                <button type="button" className="btn btn-sm btn-danger" onClick={() => handleDeleteContentItem(item.id)}>
                  Hapus
                </button>
              </li>
            ),
          )}
        </ul>
      </section>
    </DashboardShell>
  );
}
