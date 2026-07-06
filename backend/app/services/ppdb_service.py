from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.ppdb import PPDBRegistration, PPDBStatus
from app.schemas.ppdb import PPDBCreate, PPDBStatusUpdate


async def create_ppdb(db: AsyncSession, ppdb_in: PPDBCreate) -> PPDBRegistration:
    registration = PPDBRegistration(**ppdb_in.model_dump())
    db.add(registration)
    await db.commit()
    await db.refresh(registration)
    return registration


async def list_ppdb(db: AsyncSession, status: PPDBStatus | None = None) -> list[PPDBRegistration]:
    query = select(PPDBRegistration).order_by(PPDBRegistration.created_at.desc())
    if status is not None:
        query = query.where(PPDBRegistration.status == status)
    result = await db.execute(query)
    return list(result.scalars().all())


async def get_ppdb(db: AsyncSession, ppdb_id: int) -> PPDBRegistration | None:
    result = await db.execute(select(PPDBRegistration).where(PPDBRegistration.id == ppdb_id))
    return result.scalar_one_or_none()


async def update_status(
    db: AsyncSession, registration: PPDBRegistration, status_in: PPDBStatusUpdate
) -> PPDBRegistration:
    registration.status = status_in.status
    registration.catatan_admin = status_in.catatan_admin
    await db.commit()
    await db.refresh(registration)
    return registration
