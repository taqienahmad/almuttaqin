import enum
from datetime import date

from sqlalchemy import Date, Enum, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class StatusAbsensiEnum(str, enum.Enum):
    HADIR = "hadir"
    IZIN = "izin"
    SAKIT = "sakit"
    ALPA = "alpa"


class Absensi(Base):
    __tablename__ = "absensi"

    id: Mapped[int] = mapped_column(primary_key=True)
    siswa_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    kelas_id: Mapped[int] = mapped_column(ForeignKey("kelas.id", ondelete="CASCADE"))
    guru_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))

    tanggal: Mapped[date] = mapped_column(Date, nullable=False)
    status: Mapped[StatusAbsensiEnum] = mapped_column(
        Enum(StatusAbsensiEnum, name="status_absensi_enum"), nullable=False
    )
