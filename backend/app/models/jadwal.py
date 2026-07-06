import enum
from datetime import time as dt_time

from sqlalchemy import Enum, ForeignKey, Time
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class HariEnum(str, enum.Enum):
    SENIN = "senin"
    SELASA = "selasa"
    RABU = "rabu"
    KAMIS = "kamis"
    JUMAT = "jumat"
    SABTU = "sabtu"


class Jadwal(Base):
    __tablename__ = "jadwal"

    id: Mapped[int] = mapped_column(primary_key=True)
    kelas_id: Mapped[int] = mapped_column(ForeignKey("kelas.id", ondelete="CASCADE"), index=True)
    mata_pelajaran_id: Mapped[int] = mapped_column(
        ForeignKey("mata_pelajaran.id", ondelete="CASCADE")
    )
    guru_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))

    hari: Mapped[HariEnum] = mapped_column(Enum(HariEnum, name="hari_enum"), nullable=False)
    jam_mulai: Mapped[dt_time] = mapped_column(Time, nullable=False)
    jam_selesai: Mapped[dt_time] = mapped_column(Time, nullable=False)
