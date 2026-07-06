import enum
from datetime import date, datetime

from sqlalchemy import DateTime, Enum, String, Text
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import func

from app.db.base import Base


class KelompokEnum(str, enum.Enum):
    KELOMPOK_BERMAIN = "kelompok_bermain"
    TK_A = "tk_a"
    TK_B = "tk_b"


class PPDBStatus(str, enum.Enum):
    PENDING = "pending"
    DITERIMA = "diterima"
    DITOLAK = "ditolak"


class PPDBRegistration(Base):
    __tablename__ = "ppdb_registrations"

    id: Mapped[int] = mapped_column(primary_key=True)

    nama_anak: Mapped[str] = mapped_column(String(255), nullable=False)
    tempat_lahir: Mapped[str] = mapped_column(String(255), nullable=False)
    tanggal_lahir: Mapped[date] = mapped_column(nullable=False)
    jenis_kelamin: Mapped[str] = mapped_column(String(1), nullable=False)  # "L" atau "P"

    nama_ayah: Mapped[str | None] = mapped_column(String(255), nullable=True)
    nama_ibu: Mapped[str | None] = mapped_column(String(255), nullable=True)
    email_orang_tua: Mapped[str] = mapped_column(String(255), nullable=False)
    alamat: Mapped[str | None] = mapped_column(Text, nullable=True)

    kelompok_dipilih: Mapped[KelompokEnum] = mapped_column(
        Enum(KelompokEnum, name="kelompok_enum"), nullable=False
    )
    tahun_ajaran: Mapped[str] = mapped_column(String(20), nullable=False)

    status: Mapped[PPDBStatus] = mapped_column(
        Enum(PPDBStatus, name="ppdb_status"), default=PPDBStatus.PENDING, nullable=False
    )
    catatan_admin: Mapped[str | None] = mapped_column(Text, nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
