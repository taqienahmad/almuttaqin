import enum

from sqlalchemy import Enum, Float, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class JenisNilaiEnum(str, enum.Enum):
    TUGAS = "tugas"
    UH = "uh"
    UTS = "uts"
    UAS = "uas"


class Nilai(Base):
    __tablename__ = "nilai"

    id: Mapped[int] = mapped_column(primary_key=True)
    siswa_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    mata_pelajaran_id: Mapped[int] = mapped_column(
        ForeignKey("mata_pelajaran.id", ondelete="CASCADE")
    )
    guru_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))

    jenis: Mapped[JenisNilaiEnum] = mapped_column(Enum(JenisNilaiEnum, name="jenis_nilai_enum"), nullable=False)
    nilai: Mapped[float] = mapped_column(Float, nullable=False)
    semester: Mapped[int] = mapped_column(Integer, nullable=False)
    tahun_ajaran: Mapped[str] = mapped_column(String(20), nullable=False)
