from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.absensi import Absensi
from app.models.user import User
from app.schemas.absensi import AbsensiCreate, AbsensiUpdate
from app.services.scoping import list_scoped_to_siswa


async def create_absensi(db: AsyncSession, guru_id: int, absensi_in: AbsensiCreate) -> Absensi:
    absensi = Absensi(guru_id=guru_id, **absensi_in.model_dump())
    db.add(absensi)
    await db.commit()
    await db.refresh(absensi)
    return absensi


async def list_absensi_for_actor(db: AsyncSession, actor: User) -> list[Absensi]:
    return await list_scoped_to_siswa(db, Absensi, actor)


async def get_absensi(db: AsyncSession, absensi_id: int) -> Absensi | None:
    result = await db.execute(select(Absensi).where(Absensi.id == absensi_id))
    return result.scalar_one_or_none()


async def update_absensi(db: AsyncSession, absensi: Absensi, absensi_in: AbsensiUpdate) -> Absensi:
    for field, value in absensi_in.model_dump(exclude_unset=True).items():
        setattr(absensi, field, value)
    await db.commit()
    await db.refresh(absensi)
    return absensi


async def delete_absensi(db: AsyncSession, absensi: Absensi) -> None:
    await db.delete(absensi)
    await db.commit()
