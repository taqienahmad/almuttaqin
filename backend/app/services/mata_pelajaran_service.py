from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.mata_pelajaran import MataPelajaran
from app.schemas.mata_pelajaran import MataPelajaranCreate, MataPelajaranUpdate


async def create_mata_pelajaran(db: AsyncSession, mapel_in: MataPelajaranCreate) -> MataPelajaran:
    mapel = MataPelajaran(**mapel_in.model_dump())
    db.add(mapel)
    await db.commit()
    await db.refresh(mapel)
    return mapel


async def get_mata_pelajaran_by_code(db: AsyncSession, code: str) -> MataPelajaran | None:
    result = await db.execute(select(MataPelajaran).where(MataPelajaran.code == code))
    return result.scalar_one_or_none()


async def list_mata_pelajaran(db: AsyncSession) -> list[MataPelajaran]:
    result = await db.execute(select(MataPelajaran))
    return list(result.scalars().all())


async def get_mata_pelajaran(db: AsyncSession, mapel_id: int) -> MataPelajaran | None:
    result = await db.execute(select(MataPelajaran).where(MataPelajaran.id == mapel_id))
    return result.scalar_one_or_none()


async def update_mata_pelajaran(
    db: AsyncSession, mapel: MataPelajaran, mapel_in: MataPelajaranUpdate
) -> MataPelajaran:
    for field, value in mapel_in.model_dump(exclude_unset=True).items():
        setattr(mapel, field, value)
    await db.commit()
    await db.refresh(mapel)
    return mapel


async def delete_mata_pelajaran(db: AsyncSession, mapel: MataPelajaran) -> None:
    await db.delete(mapel)
    await db.commit()
