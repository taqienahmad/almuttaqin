"""seed jadwal harian descriptions

Revision ID: 7b87aeb4d58f
Revises: ff10468db1d0
Create Date: 2026-07-06 22:34:25.801216

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '7b87aeb4d58f'
down_revision: Union[str, None] = 'ff10468db1d0'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

# Convention (read by frontend/src/utils/schedule.ts): the description
# field's first line is the long-form paragraph shown in the daily-schedule
# tab detail card; up to 3 further lines become checklist highlight points.
# Draft copy - matches the existing "title" (waktu) values seeded by
# 10489ade64f4_add_site_settings_and_content_items.py, keyed by title since
# ids differ between environments.
SCHEDULE_DESCRIPTIONS: dict[str, str] = {
    "07.00 - 07.30": (
        "Anak-anak disambut hangat oleh guru begitu tiba di sekolah, menciptakan suasana ceria "
        "sebelum memulai kegiatan belajar.\n"
        "Salam dan sapa ramah dari guru piket\n"
        "Pengecekan kehadiran dan kondisi kesehatan anak\n"
        "Penitipan barang bawaan dengan rapi"
    ),
    "07.30 - 08.00": (
        "Kegiatan rutin pagi untuk membiasakan anak dekat dengan ibadah dan Al-Qur'an sejak usia dini.\n"
        "Sholat Dhuha berjamaah di mushola\n"
        "Murojaah hafalan surat pendek\n"
        "Doa dan dzikir pagi bersama"
    ),
    "08.00 - 08.30": (
        "Waktu makan bersama untuk melatih kemandirian anak sekaligus memenuhi kebutuhan gizi di pagi hari.\n"
        "Cuci tangan sebelum dan sesudah makan\n"
        "Doa sebelum dan sesudah makan\n"
        "Menu bergizi seimbang setiap hari"
    ),
    "08.30 - 09.30": (
        "Inti pembelajaran hari itu, disesuaikan dengan tema mingguan dan sentra yang sedang berjalan.\n"
        "Belajar sambil bermain sesuai tema\n"
        "Pengembangan motorik, kognitif, dan bahasa\n"
        "Pendampingan penuh oleh guru sentra"
    ),
    "09.30 - 10.00": (
        "Waktu bagi anak untuk beristirahat, bersosialisasi, dan bermain bebas di area outdoor maupun indoor.\n"
        "Bermain di area outdoor yang aman\n"
        "Melatih interaksi sosial antar teman\n"
        "Pengawasan penuh oleh guru pendamping"
    ),
    "10.00 - 10.30": (
        "Waktu makan siang bersama sebagai pembiasaan adab makan yang baik dan hidup sehat.\n"
        "Makan bersama dengan adab islami\n"
        "Membiasakan menghabiskan makanan\n"
        "Menjaga kebersihan area makan"
    ),
    "10.30 - 11.00": (
        "Menutup rangkaian kegiatan hari itu dengan doa dan persiapan sebelum anak dijemput orang tua.\n"
        "Doa penutup majelis bersama\n"
        "Merapikan barang dan seragam\n"
        "Penjemputan anak secara tertib"
    ),
}


def upgrade() -> None:
    conn = op.get_bind()
    for waktu, description in SCHEDULE_DESCRIPTIONS.items():
        conn.execute(
            sa.text(
                "UPDATE content_items SET description = :description "
                "WHERE section = 'jadwal_harian' AND title = :waktu"
            ),
            {"description": description, "waktu": waktu},
        )


def downgrade() -> None:
    conn = op.get_bind()
    for waktu in SCHEDULE_DESCRIPTIONS:
        conn.execute(
            sa.text(
                "UPDATE content_items SET description = NULL "
                "WHERE section = 'jadwal_harian' AND title = :waktu"
            ),
            {"waktu": waktu},
        )
