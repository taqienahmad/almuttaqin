from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.deps import get_current_user, require_roles
from app.db.session import get_db
from app.models.user import User, UserRole
from app.schemas.kelas import KelasCreate, KelasRead, KelasUpdate
from app.services import kelas_service

router = APIRouter()


@router.post("", response_model=KelasRead, status_code=status.HTTP_201_CREATED)
async def create_kelas(
    kelas_in: KelasCreate,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(require_roles(UserRole.ADMIN)),
) -> KelasRead:
    existing = await kelas_service.get_kelas_by_name(db, kelas_in.name)
    if existing is not None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Nama kelas sudah dipakai")
    return await kelas_service.create_kelas(db, kelas_in)


@router.get("", response_model=list[KelasRead])
async def list_kelas(
    db: AsyncSession = Depends(get_db),
    _current_user: User = Depends(get_current_user),
) -> list[KelasRead]:
    return await kelas_service.list_kelas(db)


@router.put("/{kelas_id}", response_model=KelasRead)
async def update_kelas(
    kelas_id: int,
    kelas_in: KelasUpdate,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(require_roles(UserRole.ADMIN)),
) -> KelasRead:
    kelas = await kelas_service.get_kelas(db, kelas_id)
    if kelas is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Kelas not found")
    return await kelas_service.update_kelas(db, kelas, kelas_in)


@router.delete("/{kelas_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_kelas(
    kelas_id: int,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(require_roles(UserRole.ADMIN)),
) -> None:
    kelas = await kelas_service.get_kelas(db, kelas_id)
    if kelas is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Kelas not found")
    await kelas_service.delete_kelas(db, kelas)
