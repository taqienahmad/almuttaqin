from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.deps import get_current_user, require_roles
from app.db.session import get_db
from app.models.user import User, UserRole
from app.schemas.jadwal import JadwalCreate, JadwalRead, JadwalUpdate
from app.services import jadwal_service

router = APIRouter()


@router.post("", response_model=JadwalRead, status_code=status.HTTP_201_CREATED)
async def create_jadwal(
    jadwal_in: JadwalCreate,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(require_roles(UserRole.ADMIN)),
) -> JadwalRead:
    return await jadwal_service.create_jadwal(db, jadwal_in)


@router.get("", response_model=list[JadwalRead])
async def list_jadwal(
    kelas_id: int | None = None,
    db: AsyncSession = Depends(get_db),
    _current_user: User = Depends(get_current_user),
) -> list[JadwalRead]:
    return await jadwal_service.list_jadwal(db, kelas_id)


@router.put("/{jadwal_id}", response_model=JadwalRead)
async def update_jadwal(
    jadwal_id: int,
    jadwal_in: JadwalUpdate,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(require_roles(UserRole.ADMIN)),
) -> JadwalRead:
    jadwal = await jadwal_service.get_jadwal(db, jadwal_id)
    if jadwal is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Jadwal not found")
    return await jadwal_service.update_jadwal(db, jadwal, jadwal_in)


@router.delete("/{jadwal_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_jadwal(
    jadwal_id: int,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(require_roles(UserRole.ADMIN)),
) -> None:
    jadwal = await jadwal_service.get_jadwal(db, jadwal_id)
    if jadwal is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Jadwal not found")
    await jadwal_service.delete_jadwal(db, jadwal)
