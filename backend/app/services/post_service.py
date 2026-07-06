from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.post import Post
from app.schemas.post import PostCreate, PostUpdate


async def create_post(db: AsyncSession, author_id: int, post_in: PostCreate) -> Post:
    data = post_in.model_dump()
    if data["is_published"]:
        data["published_at"] = datetime.now(timezone.utc)
    post = Post(author_id=author_id, **data)
    db.add(post)
    await db.commit()
    await db.refresh(post)
    return post


async def list_published_posts(db: AsyncSession, post_type: str | None = None) -> list[Post]:
    query = select(Post).where(Post.is_published.is_(True)).order_by(Post.published_at.desc())
    if post_type is not None:
        query = query.where(Post.type == post_type)
    result = await db.execute(query)
    return list(result.scalars().all())


async def list_all_posts(db: AsyncSession) -> list[Post]:
    result = await db.execute(select(Post).order_by(Post.created_at.desc()))
    return list(result.scalars().all())


async def get_post(db: AsyncSession, post_id: int) -> Post | None:
    result = await db.execute(select(Post).where(Post.id == post_id))
    return result.scalar_one_or_none()


async def update_post(db: AsyncSession, post: Post, post_in: PostUpdate) -> Post:
    update_data = post_in.model_dump(exclude_unset=True)
    if update_data.get("is_published") and post.published_at is None:
        update_data["published_at"] = datetime.now(timezone.utc)
    for field, value in update_data.items():
        setattr(post, field, value)
    await db.commit()
    await db.refresh(post)
    return post


async def delete_post(db: AsyncSession, post: Post) -> None:
    await db.delete(post)
    await db.commit()
