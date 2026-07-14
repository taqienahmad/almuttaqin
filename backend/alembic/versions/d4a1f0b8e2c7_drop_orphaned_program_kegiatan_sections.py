"""drop orphaned program/kegiatan content sections

Revision ID: d4a1f0b8e2c7
Revises: c92ed0743fb5
Create Date: 2026-07-07 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'd4a1f0b8e2c7'
down_revision: Union[str, None] = 'c92ed0743fb5'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

# These 5 sections stopped being rendered anywhere on the public site once
# Program+Kegiatan were merged into one reference-style page - user asked to
# delete them (and their data) outright rather than keep them hidden-but-editable.
ORPHANED_SECTIONS = (
    "pengembangan",
    "alokasi_waktu",
    "pembiasaan",
    "tematik",
    "event",
)


def upgrade() -> None:
    conn = op.get_bind()
    stmt = sa.text("DELETE FROM content_items WHERE section IN :sections").bindparams(
        sa.bindparam("sections", expanding=True)
    )
    conn.execute(stmt, {"sections": list(ORPHANED_SECTIONS)})


def downgrade() -> None:
    # Deletion is intentional and permanent - the rows' original content is
    # not recoverable from this migration. Restore from a DB backup if needed.
    pass
