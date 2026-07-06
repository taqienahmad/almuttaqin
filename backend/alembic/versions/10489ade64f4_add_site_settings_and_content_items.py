"""add site_settings and content_items

Revision ID: 10489ade64f4
Revises: 8f47f51f1b2c
Create Date: 2026-07-05 19:24:59.304676

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '10489ade64f4'
down_revision: Union[str, None] = '8f47f51f1b2c'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


site_settings_table = sa.table(
    "site_settings",
    sa.column("key", sa.String),
    sa.column("value", sa.Text),
)

content_items_table = sa.table(
    "content_items",
    sa.column("section", sa.String),
    sa.column("sort_order", sa.Integer),
    sa.column("icon", sa.String),
    sa.column("title", sa.String),
    sa.column("subtitle", sa.String),
    sa.column("description", sa.Text),
)

# Seed data mirrors exactly what was hardcoded in the React pages before this
# migration, so the public site looks unchanged the moment this runs - admin
# can then edit any of it via the new dashboard sections.
SITE_SETTINGS: dict[str, str] = {
    "hero_eyebrow": "Bismillahirrahmanirrahim",
    "hero_title": "Menumbuhkan Generasi Qur'ani Sejak Usia Dini",
    "hero_description": (
        "Taman Asuh Anak Muslim (TAAM) Al Muttaqin memadukan pengasuhan bernuansa Islami "
        "dengan pembiasaan akhlak, tahsin, dan tahfidz Al-Qur'an untuk putra-putri Anda."
    ),
    "hero_license_text": "Izin: 421.1/1023/DISDIK-2024, 22 Jan 2025",
    "sambutan_quote": (
        "Selamat datang di Taman Asuh Anak Muslim (TAAM) Al Muttaqin. Kami percaya setiap "
        "anak adalah amanah yang harus dijaga dan dididik dengan penuh cinta serta "
        "nilai-nilai Islam. Bersama, mari kita bimbing putra-putri kita menjadi generasi "
        "yang cinta Al-Qur'an, berakhlak mulia, dan siap menghadapi masa depan."
    ),
    "sambutan_author": "Kepala TAAM Al Muttaqin",
    "cta_title": "Pendaftaran Peserta Didik Baru Dibuka!",
    "cta_description": (
        "Daftarkan putra-putri Anda sekarang untuk tahun ajaran 2026/2027, atau hubungi "
        "kami untuk informasi lebih lanjut."
    ),
    "sejarah": (
        "Taman Asuh Anak Muslim (TAAM) Al Muttaqin berdiri atas semangat para orang tua dan "
        "tokoh masyarakat di lingkungan Tanah Baru, Depok, yang ingin menghadirkan tempat "
        "pengasuhan anak usia dini yang mengedepankan nilai-nilai Islam. Berawal dari "
        "kelompok kecil pengajian anak, TAAM Al Muttaqin tumbuh menjadi tempat pengasuhan "
        "tepercaya bagi keluarga muslim di sekitar wilayah Depok."
    ),
    "visi": (
        "Terwujudnya Peserta Didik Yang Memiliki Iman dan Taqwa, Berakhlak Mulia, Berbudi "
        "Pekerti Luhur, Sehat, Cerdas Kreatif, Mandiri dan Berbudaya."
    ),
    "footer_tagline": "Mendidik generasi Qur'ani sejak dini dengan pengasuhan penuh cinta dan nilai-nilai Islam.",
    "school_name": "Taman Asuh Anak Muslim (TAAM) Al Muttaqin",
    "address": "Jl. Raden Sanim Gang Achmad Family, RT 05 RW 01 No. 71, Tanah Baru, Depok 16426",
    "whatsapp_number": "6288986188340",
    "whatsapp_display": "0889-8618-8340",
    "instagram_url": "https://www.instagram.com/taam_al_muttaqin/",
}

CONTENT_ITEMS: list[dict] = [
    # keunggulan (Beranda)
    {"section": "keunggulan", "sort_order": 1, "icon": "moon-star", "title": "Kurikulum Islami Terpadu", "subtitle": None, "description": "Pembiasaan akhlak dan ibadah sehari-hari, bukan sekadar teori."},
    {"section": "keunggulan", "sort_order": 2, "icon": "book", "title": "Tahfidz & Tahsin Qur'an", "subtitle": None, "description": "Bimbingan mengaji langsung oleh ustadz/ustadzah berpengalaman."},
    {"section": "keunggulan", "sort_order": 3, "icon": "heart", "title": "Pengasuhan Penuh Kasih Sayang", "subtitle": None, "description": "Rasio pengasuh-anak terjaga, seperti di rumah sendiri."},
    {"section": "keunggulan", "sort_order": 4, "icon": "shield", "title": "Lingkungan Aman & Nyaman", "subtitle": None, "description": "Pengawasan penuh sepanjang kegiatan berlangsung."},
    {"section": "keunggulan", "sort_order": 5, "icon": "palette", "title": "Kreativitas & Motorik", "subtitle": None, "description": "Kegiatan seni, bermain, dan eksplorasi setiap minggu."},
    {"section": "keunggulan", "sort_order": 6, "icon": "message", "title": "Orang Tua Selalu Update", "subtitle": None, "description": "Laporan nilai, absensi, dan info sekolah dikirim lewat email."},
    # misi (Profil)
    {"section": "misi", "sort_order": 1, "icon": None, "title": "Menumbuhkan iman dan taqwa kepada Allah SWT dan mencintai Nabi Muhammad SAW.", "subtitle": None, "description": None},
    {"section": "misi", "sort_order": 2, "icon": None, "title": "Menanamkan pembiasaan perilaku baik, sopan dan santun sebagai cerminan akhlak mulia dalam kehidupan sehari-hari.", "subtitle": None, "description": None},
    {"section": "misi", "sort_order": 3, "icon": None, "title": "Menumbuhkan sikap berbudi pekerti luhur.", "subtitle": None, "description": None},
    {"section": "misi", "sort_order": 4, "icon": None, "title": "Menumbuhkan sikap berpikir kritis, cepat tanggap, peduli dan gotong royong pada peserta didik dengan menyajikan pembelajaran yang kreatif dan inovatif.", "subtitle": None, "description": None},
    {"section": "misi", "sort_order": 5, "icon": None, "title": "Membangun pembiasaan perilaku hidup bersih dan sehat secara mandiri. Menerapkan pembelajaran yang berbasis kearifan lokal.", "subtitle": None, "description": None},
    # nilai (Profil)
    {"section": "nilai", "sort_order": 1, "icon": "heart", "title": "Iman", "subtitle": None, "description": "Menanamkan keimanan dan kecintaan pada Allah sejak usia dini."},
    {"section": "nilai", "sort_order": 2, "icon": "heart", "title": "Ihsan", "subtitle": None, "description": "Berbuat baik, penuh kasih sayang, dan lemah lembut kepada anak."},
    {"section": "nilai", "sort_order": 3, "icon": "heart", "title": "Ilmu", "subtitle": None, "description": "Semangat belajar dan mengenal dunia dengan cara yang menyenangkan."},
    {"section": "nilai", "sort_order": 4, "icon": "heart", "title": "Istiqomah", "subtitle": None, "description": "Konsisten dalam kebaikan dan pembiasaan akhlak setiap hari."},
    # fasilitas (Profil)
    {"section": "fasilitas", "sort_order": 1, "icon": "home", "title": "Ruang Kelas Nyaman", "subtitle": None, "description": "Ber-AC, pencahayaan cukup, dan tertata rapi."},
    {"section": "fasilitas", "sort_order": 2, "icon": "moon-star", "title": "Mushola Mini", "subtitle": None, "description": "Tempat praktik sholat dan mengaji sehari-hari."},
    {"section": "fasilitas", "sort_order": 3, "icon": "leaf", "title": "Area Bermain Outdoor", "subtitle": None, "description": "Playground aman untuk motorik kasar anak."},
    {"section": "fasilitas", "sort_order": 4, "icon": "book", "title": "Sudut Baca & Perpustakaan Mini", "subtitle": None, "description": "Koleksi buku cerita islami dan umum."},
    {"section": "fasilitas", "sort_order": 5, "icon": "shield", "title": "Ruang Kesehatan (UKS)", "subtitle": None, "description": "Penanganan pertama bila anak kurang sehat."},
    {"section": "fasilitas", "sort_order": 6, "icon": "sun", "title": "Dapur Sehat & Snack Time", "subtitle": None, "description": "Camilan bergizi terjadwal setiap hari."},
    # tenaga_pendidik (Profil)
    {"section": "tenaga_pendidik", "sort_order": 1, "icon": None, "title": "Ustadzah Fatimah Azzahra", "subtitle": "Kepala TAAM & Pengasuh Kelompok Bermain", "description": None},
    {"section": "tenaga_pendidik", "sort_order": 2, "icon": None, "title": "Ustadz Abdullah Hakim", "subtitle": "Pengasuh TK A - Al-Fatihah", "description": None},
    {"section": "tenaga_pendidik", "sort_order": 3, "icon": None, "title": "Ustadzah Khadijah Nur", "subtitle": "Pengasuh TK B - Al-Ikhlas", "description": None},
    # kelompok_usia (Program)
    {"section": "kelompok_usia", "sort_order": 1, "icon": None, "title": "Kelompok Bermain", "subtitle": "2 - 3 tahun", "description": "Pengenalan rutinitas, motorik dasar, dan sosialisasi awal."},
    {"section": "kelompok_usia", "sort_order": 2, "icon": None, "title": "TK A - Al-Fatihah", "subtitle": "4 - 5 tahun", "description": "Pengembangan kemandirian dan dasar calistung."},
    {"section": "kelompok_usia", "sort_order": 3, "icon": None, "title": "TK B - Al-Ikhlas", "subtitle": "5 - 6 tahun", "description": "Kesiapan masuk sekolah dasar dan penguatan akhlak."},
    # pengembangan (Program)
    {"section": "pengembangan", "sort_order": 1, "icon": "moon-star", "title": "Nilai Agama & Moral", "subtitle": None, "description": "Rukun iman/islam, doa harian, adab sehari-hari."},
    {"section": "pengembangan", "sort_order": 2, "icon": "leaf", "title": "Fisik Motorik", "subtitle": None, "description": "Motorik kasar & halus lewat permainan dan olah tubuh."},
    {"section": "pengembangan", "sort_order": 3, "icon": "sparkles", "title": "Kognitif", "subtitle": None, "description": "Mengenal warna, bentuk, angka, dan sebab-akibat."},
    {"section": "pengembangan", "sort_order": 4, "icon": "message", "title": "Bahasa", "subtitle": None, "description": "Kosakata, bercerita, dan kemampuan mendengarkan."},
    {"section": "pengembangan", "sort_order": 5, "icon": "heart", "title": "Sosial-Emosional", "subtitle": None, "description": "Berbagi, bersabar, dan percaya diri."},
    {"section": "pengembangan", "sort_order": 6, "icon": "palette", "title": "Seni", "subtitle": None, "description": "Menggambar, musik, dan kerajinan tangan."},
    # kompetensi (Program)
    {"section": "kompetensi", "sort_order": 1, "icon": "book", "title": "Tahfidz & Tahsin Al-Qur'an", "subtitle": None, "description": "Menghafal & memperbaiki bacaan Al-Qur'an sejak dini."},
    {"section": "kompetensi", "sort_order": 2, "icon": "moon-star", "title": "Aqidah & Adab Islami", "subtitle": None, "description": "Pembiasaan akhlak, doa harian, dan adab bermuamalah."},
    {"section": "kompetensi", "sort_order": 3, "icon": "sparkles", "title": "Calistung", "subtitle": None, "description": "Baca, tulis, dan berhitung dasar dengan cara menyenangkan."},
    {"section": "kompetensi", "sort_order": 4, "icon": "palette", "title": "Kreativitas & Seni", "subtitle": None, "description": "Menggambar, mewarnai, dan bermain peran."},
    {"section": "kompetensi", "sort_order": 5, "icon": "sun", "title": "Bahasa Inggris Dasar", "subtitle": None, "description": "Pengenalan kosakata sehari-hari lewat lagu dan permainan."},
    # alokasi_waktu (Program)
    {"section": "alokasi_waktu", "sort_order": 1, "icon": None, "title": "Senin - Jumat", "subtitle": "07.30 - 11.00 WIB (Kelompok Bermain)", "description": None},
    {"section": "alokasi_waktu", "sort_order": 2, "icon": None, "title": "", "subtitle": "07.30 - 12.00 WIB (TK A & TK B)", "description": None},
    {"section": "alokasi_waktu", "sort_order": 3, "icon": None, "title": "Sabtu", "subtitle": "Kegiatan tambahan / parenting (2x sebulan)", "description": None},
    # metode (Program)
    {"section": "metode", "sort_order": 1, "icon": None, "title": "Bermain sambil belajar (learning by playing)", "subtitle": None, "description": None},
    {"section": "metode", "sort_order": 2, "icon": None, "title": "Pembelajaran sentra/area minat", "subtitle": None, "description": None},
    {"section": "metode", "sort_order": 3, "icon": None, "title": "Keteladanan dan pembiasaan harian", "subtitle": None, "description": None},
    {"section": "metode", "sort_order": 4, "icon": None, "title": "Storytelling dan media audio visual islami", "subtitle": None, "description": None},
    # pembiasaan (Program)
    {"section": "pembiasaan", "sort_order": 1, "icon": None, "title": "Sholat Dhuha berjamaah", "subtitle": None, "description": None},
    {"section": "pembiasaan", "sort_order": 2, "icon": None, "title": "Murojaah & tahfidz pagi", "subtitle": None, "description": None},
    {"section": "pembiasaan", "sort_order": 3, "icon": None, "title": "Doa sebelum dan sesudah kegiatan", "subtitle": None, "description": None},
    {"section": "pembiasaan", "sort_order": 4, "icon": None, "title": "Infaq setiap hari Jumat", "subtitle": None, "description": None},
    {"section": "pembiasaan", "sort_order": 5, "icon": None, "title": "Praktik wudhu dan adab masuk masjid/mushola", "subtitle": None, "description": None},
    # jadwal_harian (Kegiatan)
    {"section": "jadwal_harian", "sort_order": 1, "icon": None, "title": "07.00 - 07.30", "subtitle": "Penyambutan anak", "description": None},
    {"section": "jadwal_harian", "sort_order": 2, "icon": None, "title": "07.30 - 08.00", "subtitle": "Sholat Dhuha & Murojaah", "description": None},
    {"section": "jadwal_harian", "sort_order": 3, "icon": None, "title": "08.00 - 08.30", "subtitle": "Sarapan / snack sehat", "description": None},
    {"section": "jadwal_harian", "sort_order": 4, "icon": None, "title": "08.30 - 09.30", "subtitle": "Kegiatan inti (sentra / tema)", "description": None},
    {"section": "jadwal_harian", "sort_order": 5, "icon": None, "title": "09.30 - 10.00", "subtitle": "Istirahat & bermain bebas", "description": None},
    {"section": "jadwal_harian", "sort_order": 6, "icon": None, "title": "10.00 - 10.30", "subtitle": "Makan siang", "description": None},
    {"section": "jadwal_harian", "sort_order": 7, "icon": None, "title": "10.30 - 11.00", "subtitle": "Persiapan pulang & doa penutup", "description": None},
    # tematik (Kegiatan)
    {"section": "tematik", "sort_order": 1, "icon": None, "title": "Ramadhan Ceria", "subtitle": None, "description": None},
    {"section": "tematik", "sort_order": 2, "icon": None, "title": "Aku Cinta Rasul", "subtitle": None, "description": None},
    {"section": "tematik", "sort_order": 3, "icon": None, "title": "Mengenal Alam Semesta", "subtitle": None, "description": None},
    {"section": "tematik", "sort_order": 4, "icon": None, "title": "Cita-Citaku (Profesi)", "subtitle": None, "description": None},
    # event (Kegiatan)
    {"section": "event", "sort_order": 1, "icon": None, "title": "Outing edukatif ke kebun binatang / pemadam kebakaran", "subtitle": None, "description": None},
    {"section": "event", "sort_order": 2, "icon": None, "title": "Seminar parenting “Mendidik Anak ala Rasulullah”", "subtitle": None, "description": None},
    {"section": "event", "sort_order": 3, "icon": None, "title": "Perayaan hari besar Islam (Maulid Nabi, Isra Mi'raj)", "subtitle": None, "description": None},
    {"section": "event", "sort_order": 4, "icon": None, "title": "Manasik haji mini tahunan", "subtitle": None, "description": None},
    # syarat_ppdb (PPDB)
    {"section": "syarat_ppdb", "sort_order": 1, "icon": None, "title": "Usia sesuai kelompok (Kelompok Bermain 2-3 th, TK A 4-5 th, TK B 5-6 th)", "subtitle": None, "description": None},
    {"section": "syarat_ppdb", "sort_order": 2, "icon": None, "title": "Fotokopi Kartu Keluarga (KK)", "subtitle": None, "description": None},
    {"section": "syarat_ppdb", "sort_order": 3, "icon": None, "title": "Fotokopi Akta Kelahiran", "subtitle": None, "description": None},
    {"section": "syarat_ppdb", "sort_order": 4, "icon": None, "title": "Pas foto anak ukuran 3x4 (2 lembar)", "subtitle": None, "description": None},
    {"section": "syarat_ppdb", "sort_order": 5, "icon": None, "title": "Mengisi formulir pendaftaran online di bawah ini", "subtitle": None, "description": None},
    # alur_ppdb (PPDB)
    {"section": "alur_ppdb", "sort_order": 1, "icon": None, "title": "Isi Formulir", "subtitle": None, "description": "Isi formulir pendaftaran online di halaman ini."},
    {"section": "alur_ppdb", "sort_order": 2, "icon": None, "title": "Verifikasi Data", "subtitle": None, "description": "Admin menghubungi Anda via email/WhatsApp untuk verifikasi data."},
    {"section": "alur_ppdb", "sort_order": 3, "icon": None, "title": "Serahkan Dokumen", "subtitle": None, "description": "Menyerahkan dokumen persyaratan ke sekolah."},
    {"section": "alur_ppdb", "sort_order": 4, "icon": None, "title": "Pengumuman", "subtitle": None, "description": "Admin mengabari status pendaftaran (diterima/ditolak)."},
    {"section": "alur_ppdb", "sort_order": 5, "icon": None, "title": "Daftar Ulang", "subtitle": None, "description": "Melengkapi daftar ulang & pembayaran bila diterima."},
    # biaya_ppdb (PPDB)
    {"section": "biaya_ppdb", "sort_order": 1, "icon": None, "title": "Uang Pendaftaran", "subtitle": None, "description": None},
    {"section": "biaya_ppdb", "sort_order": 2, "icon": None, "title": "SPP Bulanan", "subtitle": None, "description": None},
    {"section": "biaya_ppdb", "sort_order": 3, "icon": None, "title": "Seragam & Perlengkapan", "subtitle": None, "description": None},
    {"section": "biaya_ppdb", "sort_order": 4, "icon": None, "title": "Kegiatan Tahunan", "subtitle": None, "description": None},
]


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('content_items',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('section', sa.String(length=50), nullable=False),
    sa.Column('sort_order', sa.Integer(), nullable=False),
    sa.Column('icon', sa.String(length=50), nullable=True),
    sa.Column('title', sa.String(length=255), nullable=False),
    sa.Column('subtitle', sa.String(length=255), nullable=True),
    sa.Column('description', sa.Text(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_content_items_section'), 'content_items', ['section'], unique=False)
    op.create_table('site_settings',
    sa.Column('key', sa.String(length=100), nullable=False),
    sa.Column('value', sa.Text(), nullable=False),
    sa.PrimaryKeyConstraint('key')
    )
    # ### end Alembic commands ###

    op.bulk_insert(
        site_settings_table,
        [{"key": key, "value": value} for key, value in SITE_SETTINGS.items()],
    )
    op.bulk_insert(content_items_table, CONTENT_ITEMS)


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('site_settings')
    op.drop_index(op.f('ix_content_items_section'), table_name='content_items')
    op.drop_table('content_items')
    # ### end Alembic commands ###
