from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.deps import get_current_user, require_roles
from app.db.session import get_db
from app.models.user import User, UserRole
from app.schemas.absensi import AbsensiCreate, AbsensiRead, AbsensiUpdate
from app.services import absensi_service
from app.services.auth_service import get_user_by_id
from app.services import notification_service
from app.services.parent_child_service import get_children_ids
from app.services.scoping import can_read_siswa_row

router = APIRouter()


@router.post("", response_model=AbsensiRead, status_code=status.HTTP_201_CREATED)
async def create_absensi(
    absensi_in: AbsensiCreate,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    guru: User = Depends(require_roles(UserRole.GURU, UserRole.ADMIN)),
) -> AbsensiRead:
    absensi = await absensi_service.create_absensi(db, guru.id, absensi_in)

    siswa = await get_user_by_id(db, absensi.siswa_id)
    siswa_nama = (siswa.full_name or siswa.email) if siswa else "siswa"
    emails = await notification_service.get_parent_emails(db, absensi.siswa_id)
    subject, body = notification_service.build_absensi_email(absensi, siswa_nama)
    for email in emails:
        background_tasks.add_task(notification_service.send_email, email, subject, body)

    return absensi


@router.get("", response_model=list[AbsensiRead])
async def list_absensi(
    db: AsyncSession = Depends(get_db),
    actor: User = Depends(get_current_user),
) -> list[AbsensiRead]:
    return await absensi_service.list_absensi_for_actor(db, actor)


@router.get("/{absensi_id}", response_model=AbsensiRead)
async def get_absensi(
    absensi_id: int,
    db: AsyncSession = Depends(get_db),
    actor: User = Depends(get_current_user),
) -> AbsensiRead:
    absensi = await absensi_service.get_absensi(db, absensi_id)
    if absensi is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Absensi not found")
    children_ids = await get_children_ids(db, actor.id) if actor.role == UserRole.ORANG_TUA else []
    if not can_read_siswa_row(actor, absensi.siswa_id, children_ids):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not allowed")
    return absensi


@router.put("/{absensi_id}", response_model=AbsensiRead)
async def update_absensi(
    absensi_id: int,
    absensi_in: AbsensiUpdate,
    db: AsyncSession = Depends(get_db),
    _guru: User = Depends(require_roles(UserRole.GURU, UserRole.ADMIN)),
) -> AbsensiRead:
    absensi = await absensi_service.get_absensi(db, absensi_id)
    if absensi is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Absensi not found")
    return await absensi_service.update_absensi(db, absensi, absensi_in)


@router.delete("/{absensi_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_absensi(
    absensi_id: int,
    db: AsyncSession = Depends(get_db),
    _guru: User = Depends(require_roles(UserRole.GURU, UserRole.ADMIN)),
) -> None:
    absensi = await absensi_service.get_absensi(db, absensi_id)
    if absensi is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Absensi not found")
    await absensi_service.delete_absensi(db, absensi)
