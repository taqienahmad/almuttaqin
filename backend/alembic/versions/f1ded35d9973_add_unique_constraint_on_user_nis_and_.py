"""add unique constraint on user nis and nip

Revision ID: f1ded35d9973
Revises: d4a1f0b8e2c7
Create Date: 2026-07-07 21:08:14.097710

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'f1ded35d9973'
down_revision: Union[str, None] = 'd4a1f0b8e2c7'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_unique_constraint("uq_users_nis", "users", ["nis"])
    op.create_unique_constraint("uq_users_nip", "users", ["nip"])


def downgrade() -> None:
    op.drop_constraint("uq_users_nis", "users", type_="unique")
    op.drop_constraint("uq_users_nip", "users", type_="unique")
