from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr

from app.models.user import UserRole


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str | None = None
    role: UserRole
    nis: str | None = None
    nip: str | None = None
    kelas_id: int | None = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserPasswordReset(BaseModel):
    new_password: str


class UserRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: EmailStr
    full_name: str | None
    role: UserRole
    nis: str | None
    nip: str | None
    kelas_id: int | None
    is_active: bool
    created_at: datetime
