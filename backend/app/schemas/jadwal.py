from datetime import time

from pydantic import BaseModel, ConfigDict

from app.models.jadwal import HariEnum


class JadwalCreate(BaseModel):
    kelas_id: int
    mata_pelajaran_id: int
    guru_id: int
    hari: HariEnum
    jam_mulai: time
    jam_selesai: time


class JadwalUpdate(BaseModel):
    kelas_id: int | None = None
    mata_pelajaran_id: int | None = None
    guru_id: int | None = None
    hari: HariEnum | None = None
    jam_mulai: time | None = None
    jam_selesai: time | None = None


class JadwalRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    kelas_id: int
    mata_pelajaran_id: int
    guru_id: int
    hari: HariEnum
    jam_mulai: time
    jam_selesai: time
