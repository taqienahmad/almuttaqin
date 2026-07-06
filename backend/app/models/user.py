import enum
from datetime import datetime

from sqlalchemy import Boolean, DateTime, Enum, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from app.db.base import Base
from app.models.kelas import Kelas


class UserRole(str, enum.Enum):
    ADMIN = "admin"
    GURU = "guru"
    SISWA = "siswa"
    ORANG_TUA = "orang_tua"


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    full_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    role: Mapped[UserRole] = mapped_column(Enum(UserRole, name="user_role"), nullable=False)

    # Role-specific fields kept directly on User rather than separate profile
    # tables, to avoid join overhead for a handful of optional columns.
    nis: Mapped[str | None] = mapped_column(String(50), nullable=True)  # siswa
    nip: Mapped[str | None] = mapped_column(String(50), nullable=True)  # guru
    kelas_id: Mapped[int | None] = mapped_column(
        ForeignKey("kelas.id", ondelete="SET NULL"), nullable=True
    )  # siswa's current class

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    kelas: Mapped[Kelas | None] = relationship(foreign_keys=[kelas_id])
