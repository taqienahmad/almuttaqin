from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User, UserRole
from app.services.parent_child_service import get_children_ids


async def list_scoped_to_siswa(db: AsyncSession, model, actor: User) -> list:
    """Shared read-scoping for models with a `siswa_id` column (Nilai, Absensi):
    admin/guru see everything, siswa sees only their own rows, orang_tua sees
    only rows belonging to their linked children.
    """
    query = select(model)

    if actor.role in (UserRole.ADMIN, UserRole.GURU):
        pass
    elif actor.role == UserRole.SISWA:
        query = query.where(model.siswa_id == actor.id)
    elif actor.role == UserRole.ORANG_TUA:
        children_ids = await get_children_ids(db, actor.id)
        query = query.where(model.siswa_id.in_(children_ids))

    result = await db.execute(query)
    return list(result.scalars().all())


def can_read_siswa_row(actor: User, siswa_id: int, children_ids: list[int]) -> bool:
    if actor.role in (UserRole.ADMIN, UserRole.GURU):
        return True
    if actor.role == UserRole.SISWA:
        return actor.id == siswa_id
    if actor.role == UserRole.ORANG_TUA:
        return siswa_id in children_ids
    return False
