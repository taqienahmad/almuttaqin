from pydantic import BaseModel, ConfigDict


class MataPelajaranCreate(BaseModel):
    name: str
    code: str


class MataPelajaranUpdate(BaseModel):
    name: str | None = None
    code: str | None = None


class MataPelajaranRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    code: str
