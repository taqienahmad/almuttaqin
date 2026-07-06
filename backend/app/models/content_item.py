from sqlalchemy import Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class ContentItem(Base):
    """A single repeatable card/row within a named page section (e.g. one
    "Keunggulan" card, one "Jadwal Harian" row). `section` is a plain string
    (not a Postgres enum) so new sections can be added without a migration.
    """

    __tablename__ = "content_items"

    id: Mapped[int] = mapped_column(primary_key=True)

    section: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    icon: Mapped[str | None] = mapped_column(String(50), nullable=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    subtitle: Mapped[str | None] = mapped_column(String(255), nullable=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    image_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
