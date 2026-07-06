from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.deps import require_roles
from app.db.session import get_db
from app.models.ppdb import PPDBStatus
from app.models.user import User, UserRole
from app.schemas.ppdb import PPDBCreate, PPDBRead, PPDBStatusUpdate
from app.services import ppdb_service
from app.services import notification_service

router = APIRouter()


@router.post("", response_model=PPDBRead, status_code=status.HTTP_201_CREATED)
async def submit_ppdb(ppdb_in: PPDBCreate, db: AsyncSession = Depends(get_db)) -> PPDBRead:
    """Public endpoint - anyone can submit a PPDB registration, no login required."""
    return await ppdb_service.create_ppdb(db, ppdb_in)


@router.get("", response_model=list[PPDBRead])
async def list_ppdb(
    ppdb_status: PPDBStatus | None = None,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(require_roles(UserRole.ADMIN)),
) -> list[PPDBRead]:
    return await ppdb_service.list_ppdb(db, ppdb_status)


@router.get("/{ppdb_id}", response_model=PPDBRead)
async def get_ppdb(
    ppdb_id: int,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(require_roles(UserRole.ADMIN)),
) -> PPDBRead:
    registration = await ppdb_service.get_ppdb(db, ppdb_id)
    if registration is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pendaftaran tidak ditemukan")
    return registration


@router.put("/{ppdb_id}/status", response_model=PPDBRead)
async def update_ppdb_status(
    ppdb_id: int,
    status_in: PPDBStatusUpdate,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(require_roles(UserRole.ADMIN)),
) -> PPDBRead:
    registration = await ppdb_service.get_ppdb(db, ppdb_id)
    if registration is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pendaftaran tidak ditemukan")
    updated = await ppdb_service.update_status(db, registration, status_in)
    subject, body = notification_service.build_ppdb_status_email(updated)
    background_tasks.add_task(notification_service.send_email, updated.email_orang_tua, subject, body)
    return updated
