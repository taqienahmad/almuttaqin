from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.deps import get_current_user, require_roles
from app.db.session import get_db
from app.models.user import User, UserRole
from app.schemas.nilai import NilaiCreate, NilaiRead, NilaiUpdate
from app.services import nilai_service, notification_service
from app.services.auth_service import get_user_by_id
from app.services.parent_child_service import get_children_ids
from app.services.scoping import can_read_siswa_row

router = APIRouter()


@router.post("", response_model=NilaiRead, status_code=status.HTTP_201_CREATED)
async def create_nilai(
    nilai_in: NilaiCreate,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    guru: User = Depends(require_roles(UserRole.GURU, UserRole.ADMIN)),
) -> NilaiRead:
    nilai = await nilai_service.create_nilai(db, guru.id, nilai_in)

    siswa = await get_user_by_id(db, nilai.siswa_id)
    siswa_nama = (siswa.full_name or siswa.email) if siswa else "siswa"
    emails = await notification_service.get_parent_emails(db, nilai.siswa_id)
    subject, body = notification_service.build_nilai_email(nilai, siswa_nama)
    for email in emails:
        background_tasks.add_task(notification_service.send_email, email, subject, body)

    return nilai


@router.get("", response_model=list[NilaiRead])
async def list_nilai(
    db: AsyncSession = Depends(get_db),
    actor: User = Depends(get_current_user),
) -> list[NilaiRead]:
    return await nilai_service.list_nilai_for_actor(db, actor)


@router.get("/{nilai_id}", response_model=NilaiRead)
async def get_nilai(
    nilai_id: int,
    db: AsyncSession = Depends(get_db),
    actor: User = Depends(get_current_user),
) -> NilaiRead:
    nilai = await nilai_service.get_nilai(db, nilai_id)
    if nilai is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Nilai not found")
    children_ids = await get_children_ids(db, actor.id) if actor.role == UserRole.ORANG_TUA else []
    if not can_read_siswa_row(actor, nilai.siswa_id, children_ids):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not allowed")
    return nilai


@router.put("/{nilai_id}", response_model=NilaiRead)
async def update_nilai(
    nilai_id: int,
    nilai_in: NilaiUpdate,
    db: AsyncSession = Depends(get_db),
    _guru: User = Depends(require_roles(UserRole.GURU, UserRole.ADMIN)),
) -> NilaiRead:
    nilai = await nilai_service.get_nilai(db, nilai_id)
    if nilai is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Nilai not found")
    return await nilai_service.update_nilai(db, nilai, nilai_in)


@router.delete("/{nilai_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_nilai(
    nilai_id: int,
    db: AsyncSession = Depends(get_db),
    _guru: User = Depends(require_roles(UserRole.GURU, UserRole.ADMIN)),
) -> None:
    nilai = await nilai_service.get_nilai(db, nilai_id)
    if nilai is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Nilai not found")
    await nilai_service.delete_nilai(db, nilai)
