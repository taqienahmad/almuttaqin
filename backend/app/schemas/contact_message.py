from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr


class ContactMessageCreate(BaseModel):
    nama: str
    email: EmailStr
    whatsapp: str | None = None
    pesan: str


class ContactMessageRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    nama: str
    email: EmailStr
    whatsapp: str | None
    pesan: str
    is_read: bool
    created_at: datetime
