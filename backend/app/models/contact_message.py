from datetime import datetime

from sqlalchemy import Boolean, DateTime, String, Text
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import func

from app.db.base import Base


class ContactMessage(Base):
    """A message submitted via the public Kontak page contact form."""

    __tablename__ = "contact_messages"

    id: Mapped[int] = mapped_column(primary_key=True)

    nama: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[str] = mapped_column(String(255), nullable=False)
    whatsapp: Mapped[str | None] = mapped_column(String(30), nullable=True)
    pesan: Mapped[str] = mapped_column(Text, nullable=False)

    is_read: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
