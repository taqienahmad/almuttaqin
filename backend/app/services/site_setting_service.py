from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.site_setting import SiteSetting


async def get_all_settings(db: AsyncSession) -> dict[str, str]:
    result = await db.execute(select(SiteSetting))
    return {row.key: row.value for row in result.scalars().all()}


async def update_settings(db: AsyncSession, updates: dict[str, str]) -> dict[str, str]:
    existing = {
        row.key: row
        for row in (await db.execute(select(SiteSetting).where(SiteSetting.key.in_(updates.keys())))).scalars().all()
    }
    for key, value in updates.items():
        if key in existing:
            existing[key].value = value
        else:
            db.add(SiteSetting(key=key, value=value))
    await db.commit()
    return await get_all_settings(db)
