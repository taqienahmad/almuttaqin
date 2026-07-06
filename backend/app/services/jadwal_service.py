from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.jadwal import Jadwal
from app.schemas.jadwal import JadwalCreate, JadwalUpdate


async def create_jadwal(db: AsyncSession, jadwal_in: JadwalCreate) -> Jadwal:
    jadwal = Jadwal(**jadwal_in.model_dump())
    db.add(jadwal)
    await db.commit()
    await db.refresh(jadwal)
    return jadwal


async def list_jadwal(db: AsyncSession, kelas_id: int | None = None) -> list[Jadwal]:
    query = select(Jadwal)
    if kelas_id is not None:
        query = query.where(Jadwal.kelas_id == kelas_id)
    result = await db.execute(query)
    return list(result.scalars().all())


async def get_jadwal(db: AsyncSession, jadwal_id: int) -> Jadwal | None:
    result = await db.execute(select(Jadwal).where(Jadwal.id == jadwal_id))
    return result.scalar_one_or_none()


async def update_jadwal(db: AsyncSession, jadwal: Jadwal, jadwal_in: JadwalUpdate) -> Jadwal:
    for field, value in jadwal_in.model_dump(exclude_unset=True).items():
        setattr(jadwal, field, value)
    await db.commit()
    await db.refresh(jadwal)
    return jadwal


async def delete_jadwal(db: AsyncSession, jadwal: Jadwal) -> None:
    await db.delete(jadwal)
    await db.commit()
