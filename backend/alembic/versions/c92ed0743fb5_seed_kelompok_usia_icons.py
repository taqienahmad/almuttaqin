"""seed kelompok_usia icons

Revision ID: c92ed0743fb5
Revises: 6867c0d39e7d
Create Date: 2026-07-06 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c92ed0743fb5'
down_revision: Union[str, None] = '6867c0d39e7d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

# Growth-stage icon progression (leaf -> book -> sparkles) for the age-group
# cards restored to the merged Program page.
KELOMPOK_USIA_ICONS: dict[str, str] = {
    "Kelompok Bermain": "leaf",
    "TK A": "book",
    "TK B": "sparkles",
}


def upgrade() -> None:
    conn = op.get_bind()
    for title, icon in KELOMPOK_USIA_ICONS.items():
        conn.execute(
            sa.text(
                "UPDATE content_items SET icon = :icon "
                "WHERE section = 'kelompok_usia' AND title = :title"
            ),
            {"icon": icon, "title": title},
        )


def downgrade() -> None:
    conn = op.get_bind()
    for title in KELOMPOK_USIA_ICONS:
        conn.execute(
            sa.text(
                "UPDATE content_items SET icon = NULL "
                "WHERE section = 'kelompok_usia' AND title = :title"
            ),
            {"title": title},
        )
