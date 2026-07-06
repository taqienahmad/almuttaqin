from pydantic import BaseModel, ConfigDict


class KelasCreate(BaseModel):
    name: str
    wali_kelas_id: int | None = None


class KelasUpdate(BaseModel):
    name: str | None = None
    wali_kelas_id: int | None = None


class KelasRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    wali_kelas_id: int | None
