from pydantic import BaseModel, ConfigDict


class ContentItemCreate(BaseModel):
    section: str
    sort_order: int = 0
    icon: str | None = None
    title: str
    subtitle: str | None = None
    description: str | None = None
    image_url: str | None = None


class ContentItemUpdate(BaseModel):
    section: str | None = None
    sort_order: int | None = None
    icon: str | None = None
    title: str | None = None
    subtitle: str | None = None
    description: str | None = None
    image_url: str | None = None


class ContentItemRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    section: str
    sort_order: int
    icon: str | None
    title: str
    subtitle: str | None
    description: str | None
    image_url: str | None
