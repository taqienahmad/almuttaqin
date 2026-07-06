from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.models.post import PostType


class PostCreate(BaseModel):
    type: PostType
    title: str
    content: str | None = None
    image_url: str | None = None
    video_url: str | None = None
    is_published: bool = False


class PostUpdate(BaseModel):
    type: PostType | None = None
    title: str | None = None
    content: str | None = None
    image_url: str | None = None
    video_url: str | None = None
    is_published: bool | None = None


class PostRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    author_id: int
    type: PostType
    title: str
    content: str | None
    image_url: str | None
    video_url: str | None
    is_published: bool
    published_at: datetime | None
    created_at: datetime
