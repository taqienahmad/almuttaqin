from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.kelas import Kelas
from app.schemas.kelas import KelasCreate, KelasUpdate


async def create_kelas(db: AsyncSession, kelas_in: KelasCreate) -> Kelas:
    kelas = Kelas(**kelas_in.model_dump())
    db.add(kelas)
    await db.commit()
    await db.refresh(kelas)
    return kelas


async def get_kelas_by_name(db: AsyncSession, name: str) -> Kelas | None:
    result = await db.execute(select(Kelas).where(Kelas.name == name))
    return result.scalar_one_or_none()


async def list_kelas(db: AsyncSession) -> list[Kelas]:
    result = await db.execute(select(Kelas))
    return list(result.scalars().all())


async def get_kelas(db: AsyncSession, kelas_id: int) -> Kelas | None:
    result = await db.execute(select(Kelas).where(Kelas.id == kelas_id))
    return result.scalar_one_or_none()


async def update_kelas(db: AsyncSession, kelas: Kelas, kelas_in: KelasUpdate) -> Kelas:
    for field, value in kelas_in.model_dump(exclude_unset=True).items():
        setattr(kelas, field, value)
    await db.commit()
    await db.refresh(kelas)
    return kelas


async def delete_kelas(db: AsyncSession, kelas: Kelas) -> None:
    await db.delete(kelas)
    await db.commit()
