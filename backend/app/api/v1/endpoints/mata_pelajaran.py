from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.deps import get_current_user, require_roles
from app.db.session import get_db
from app.models.user import User, UserRole
from app.schemas.mata_pelajaran import MataPelajaranCreate, MataPelajaranRead, MataPelajaranUpdate
from app.services import mata_pelajaran_service

router = APIRouter()


@router.post("", response_model=MataPelajaranRead, status_code=status.HTTP_201_CREATED)
async def create_mata_pelajaran(
    mapel_in: MataPelajaranCreate,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(require_roles(UserRole.ADMIN)),
) -> MataPelajaranRead:
    existing = await mata_pelajaran_service.get_mata_pelajaran_by_code(db, mapel_in.code)
    if existing is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Kode mata pelajaran sudah dipakai"
        )
    return await mata_pelajaran_service.create_mata_pelajaran(db, mapel_in)


@router.get("", response_model=list[MataPelajaranRead])
async def list_mata_pelajaran(
    db: AsyncSession = Depends(get_db),
    _current_user: User = Depends(get_current_user),
) -> list[MataPelajaranRead]:
    return await mata_pelajaran_service.list_mata_pelajaran(db)


@router.put("/{mapel_id}", response_model=MataPelajaranRead)
async def update_mata_pelajaran(
    mapel_id: int,
    mapel_in: MataPelajaranUpdate,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(require_roles(UserRole.ADMIN)),
) -> MataPelajaranRead:
    mapel = await mata_pelajaran_service.get_mata_pelajaran(db, mapel_id)
    if mapel is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Mata pelajaran not found")
    return await mata_pelajaran_service.update_mata_pelajaran(db, mapel, mapel_in)


@router.delete("/{mapel_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_mata_pelajaran(
    mapel_id: int,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(require_roles(UserRole.ADMIN)),
) -> None:
    mapel = await mata_pelajaran_service.get_mata_pelajaran(db, mapel_id)
    if mapel is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Mata pelajaran not found")
    await mata_pelajaran_service.delete_mata_pelajaran(db, mapel)
