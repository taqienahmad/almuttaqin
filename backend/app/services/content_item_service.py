from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.content_item import ContentItem
from app.schemas.content_item import ContentItemCreate, ContentItemUpdate


async def list_by_section(db: AsyncSession, section: str) -> list[ContentItem]:
    result = await db.execute(
        select(ContentItem)
        .where(ContentItem.section == section)
        .order_by(ContentItem.sort_order.asc(), ContentItem.id.asc())
    )
    return list(result.scalars().all())


async def get_item(db: AsyncSession, item_id: int) -> ContentItem | None:
    result = await db.execute(select(ContentItem).where(ContentItem.id == item_id))
    return result.scalar_one_or_none()


async def create_item(db: AsyncSession, item_in: ContentItemCreate) -> ContentItem:
    item = ContentItem(**item_in.model_dump())
    db.add(item)
    await db.commit()
    await db.refresh(item)
    return item


async def update_item(db: AsyncSession, item: ContentItem, item_in: ContentItemUpdate) -> ContentItem:
    for field, value in item_in.model_dump(exclude_unset=True).items():
        setattr(item, field, value)
    await db.commit()
    await db.refresh(item)
    return item


async def delete_item(db: AsyncSession, item: ContentItem) -> None:
    await db.delete(item)
    await db.commit()
