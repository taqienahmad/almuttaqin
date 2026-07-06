from pydantic import BaseModel, ConfigDict

from app.models.nilai import JenisNilaiEnum


class NilaiCreate(BaseModel):
    siswa_id: int
    mata_pelajaran_id: int
    jenis: JenisNilaiEnum
    nilai: float
    semester: int
    tahun_ajaran: str


class NilaiUpdate(BaseModel):
    jenis: JenisNilaiEnum | None = None
    nilai: float | None = None
    semester: int | None = None
    tahun_ajaran: str | None = None


class NilaiRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    siswa_id: int
    mata_pelajaran_id: int
    guru_id: int
    jenis: JenisNilaiEnum
    nilai: float
    semester: int
    tahun_ajaran: str
