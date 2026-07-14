from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.models.user import UserRole

# Applies to any newly-set password (account creation, admin reset) - not
# retroactive for accounts created before this was added.
PASSWORD_MIN_LENGTH = 8


class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=PASSWORD_MIN_LENGTH)
    full_name: str | None = None
    role: UserRole
    nis: str | None = None
    nip: str | None = None
    kelas_id: int | None = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserPasswordReset(BaseModel):
    new_password: str = Field(min_length=PASSWORD_MIN_LENGTH)


class UserUpdate(BaseModel):
    full_name: str | None = None
    nis: str | None = None
    nip: str | None = None
    kelas_id: int | None = None
    is_active: bool | None = None


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
