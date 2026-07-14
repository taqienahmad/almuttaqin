"""seed program page merged content

Revision ID: 6867c0d39e7d
Revises: 7b87aeb4d58f
Create Date: 2026-07-06 23:21:13.302563

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '6867c0d39e7d'
down_revision: Union[str, None] = '7b87aeb4d58f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

site_settings_table = sa.table(
    "site_settings",
    sa.column("key", sa.String),
    sa.column("value", sa.Text),
)

# New copy for the merged Program+Kegiatan page ("/program"), added when
# the two pages were combined into one reference-style layout.
NEW_SITE_SETTINGS: dict[str, str] = {
    "program_hero_title": "Menumbuhkan Akal, Hati, dan Jiwa Qur'ani",
    "program_hero_description": (
        "Kurikulum kami memadukan standar tumbuh kembang kognitif dan fisik yang modern dengan "
        "pembentukan akhlak mulia (adab), kecintaan pada Al-Qur'an sejak dini, dan eksplorasi "
        "sensorik yang kreatif."
    ),
    "program_methodology_quote": "Belajar paling bermakna ketika anak belajar sambil tersenyum.",
}

# Same highlight convention as jadwal_harian (10489ade64f4/7b87aeb4d58f): first
# line is the paragraph, following lines (up to 4 here) become checklist
# highlights - read by frontend/src/utils/highlights.ts.
KOMPETENSI_DESCRIPTIONS: dict[str, str] = {
    "Aqidah & Adab Islami": (
        "Kami percaya karakter mulia lebih utama daripada sekadar pencapaian akademik. Sejak dini, "
        "anak dibiasakan adab bersyukur, berempati, dan menjaga kebersihan diri maupun lingkungan.\n"
        "Etika berbicara dan mendengarkan dengan santun\n"
        "Praktik menyapa dan bermain kooperatif\n"
        "Doa penjagaan diri pagi dan sore\n"
        "Adab makan dan minum dengan tangan kanan"
    ),
    "Tahfidz & Tahsin Al-Qur'an": (
        "Metode kami memadukan kegembiraan, pengulangan visual, dan lantunan nada yang menyenangkan, "
        "menjadikan hafalan sebagai kelanjutan alami dari waktu bercerita yang kreatif.\n"
        "Membiasakan telinga pada nada bacaan yang merdu\n"
        "Hafalan surat-surat pendek Juz 30\n"
        "Mengenal kisah Al-Qur'an lewat boneka interaktif\n"
        "Kosakata dasar bahasa Arab yang menyenangkan (warna, hewan, aksi)"
    ),
}


def upgrade() -> None:
    conn = op.get_bind()
    op.bulk_insert(
        site_settings_table,
        [{"key": key, "value": value} for key, value in NEW_SITE_SETTINGS.items()],
    )
    for title, description in KOMPETENSI_DESCRIPTIONS.items():
        conn.execute(
            sa.text(
                "UPDATE content_items SET description = :description "
                "WHERE section = 'kompetensi' AND title = :title"
            ),
            {"description": description, "title": title},
        )


def downgrade() -> None:
    conn = op.get_bind()
    for key in NEW_SITE_SETTINGS:
        conn.execute(sa.text("DELETE FROM site_settings WHERE key = :key"), {"key": key})
    for title in KOMPETENSI_DESCRIPTIONS:
        conn.execute(
            sa.text("UPDATE content_items SET description = NULL WHERE section = 'kompetensi' AND title = :title"),
            {"title": title},
        )
