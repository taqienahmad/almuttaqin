from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.parent_child import ParentChild


async def get_link(db: AsyncSession, parent_user_id: int, student_user_id: int) -> ParentChild | None:
    result = await db.execute(
        select(ParentChild).where(
            ParentChild.parent_user_id == parent_user_id,
            ParentChild.student_user_id == student_user_id,
        )
    )
    return result.scalar_one_or_none()


async def link_parent_child(db: AsyncSession, parent_user_id: int, student_user_id: int) -> ParentChild:
    link = ParentChild(parent_user_id=parent_user_id, student_user_id=student_user_id)
    db.add(link)
    await db.commit()
    return link


async def get_children_ids(db: AsyncSession, parent_user_id: int) -> list[int]:
    result = await db.execute(
        select(ParentChild.student_user_id).where(ParentChild.parent_user_id == parent_user_id)
    )
    return list(result.scalars().all())
