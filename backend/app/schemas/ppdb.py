from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, EmailStr

from app.models.ppdb import KelompokEnum, PPDBStatus


class PPDBCreate(BaseModel):
    nama_anak: str
    tempat_lahir: str
    tanggal_lahir: date
    jenis_kelamin: str
    nama_ayah: str | None = None
    nama_ibu: str | None = None
    email_orang_tua: EmailStr
    alamat: str | None = None
    kelompok_dipilih: KelompokEnum
    tahun_ajaran: str


class PPDBStatusUpdate(BaseModel):
    status: PPDBStatus
    catatan_admin: str | None = None


class PPDBRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    nama_anak: str
    tempat_lahir: str
    tanggal_lahir: date
    jenis_kelamin: str
    nama_ayah: str | None
    nama_ibu: str | None
    email_orang_tua: EmailStr
    alamat: str | None
    kelompok_dipilih: KelompokEnum
    tahun_ajaran: str
    status: PPDBStatus
    catatan_admin: str | None
    created_at: datetime
