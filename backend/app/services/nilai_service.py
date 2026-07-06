from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.nilai import Nilai
from app.models.user import User
from app.schemas.nilai import NilaiCreate, NilaiUpdate
from app.services.scoping import list_scoped_to_siswa


async def create_nilai(db: AsyncSession, guru_id: int, nilai_in: NilaiCreate) -> Nilai:
    nilai = Nilai(guru_id=guru_id, **nilai_in.model_dump())
    db.add(nilai)
    await db.commit()
    await db.refresh(nilai)
    return nilai


async def list_nilai_for_actor(db: AsyncSession, actor: User) -> list[Nilai]:
    return await list_scoped_to_siswa(db, Nilai, actor)


async def get_nilai(db: AsyncSession, nilai_id: int) -> Nilai | None:
    result = await db.execute(select(Nilai).where(Nilai.id == nilai_id))
    return result.scalar_one_or_none()


async def update_nilai(db: AsyncSession, nilai: Nilai, nilai_in: NilaiUpdate) -> Nilai:
    for field, value in nilai_in.model_dump(exclude_unset=True).items():
        setattr(nilai, field, value)
    await db.commit()
    await db.refresh(nilai)
    return nilai


async def delete_nilai(db: AsyncSession, nilai: Nilai) -> None:
    await db.delete(nilai)
    await db.commit()
