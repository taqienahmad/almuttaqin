from datetime import date

from pydantic import BaseModel, ConfigDict

from app.models.absensi import StatusAbsensiEnum


class AbsensiCreate(BaseModel):
    siswa_id: int
    kelas_id: int
    tanggal: date
    status: StatusAbsensiEnum


class AbsensiUpdate(BaseModel):
    status: StatusAbsensiEnum | None = None


class AbsensiRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    siswa_id: int
    kelas_id: int
    guru_id: int
    tanggal: date
    status: StatusAbsensiEnum
