from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.deps import get_current_user, require_roles
from app.db.session import get_db
from app.models.user import User, UserRole
from app.schemas.user import UserCreate, UserPasswordReset, UserRead, UserUpdate
from app.services import parent_child_service
from app.services.auth_service import (
    create_user,
    get_user_by_email,
    get_user_by_id,
    get_user_by_nip,
    get_user_by_nis,
    list_users,
    update_password,
    update_user,
)

router = APIRouter()


@router.post("", response_model=UserRead, status_code=status.HTTP_201_CREATED)
async def create_account(
    user_in: UserCreate,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(require_roles(UserRole.ADMIN)),
) -> UserRead:
    existing = await get_user_by_email(db, user_in.email)
    if existing is not None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    if user_in.nis and await get_user_by_nis(db, user_in.nis) is not None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="NIS sudah digunakan akun lain")
    if user_in.nip and await get_user_by_nip(db, user_in.nip) is not None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="NIP sudah digunakan akun lain")
    return await create_user(db, user_in)


@router.get("", response_model=list[UserRead])
async def list_accounts(
    role: UserRole | None = None,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(require_roles(UserRole.ADMIN)),
) -> list[UserRead]:
    return await list_users(db, role)


@router.get("/me", response_model=UserRead)
async def read_me(current_user: User = Depends(get_current_user)) -> UserRead:
    return current_user


@router.put("/{user_id}", response_model=UserRead)
async def update_account(
    user_id: int,
    user_in: UserUpdate,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(require_roles(UserRole.ADMIN)),
) -> UserRead:
    user = await get_user_by_id(db, user_id)
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Akun tidak ditemukan")

    if user_in.nis and user_in.nis != user.nis:
        existing_nis = await get_user_by_nis(db, user_in.nis)
        if existing_nis is not None:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="NIS sudah digunakan akun lain")
    if user_in.nip and user_in.nip != user.nip:
        existing_nip = await get_user_by_nip(db, user_in.nip)
        if existing_nip is not None:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="NIP sudah digunakan akun lain")

    return await update_user(db, user, user_in)


@router.put("/{user_id}/password", response_model=UserRead)
async def reset_password(
    user_id: int,
    password_in: UserPasswordReset,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(require_roles(UserRole.ADMIN)),
) -> UserRead:
    """Admin-only password reset - there is no self-service "forgot password"
    flow (no email sending for that purpose), so this is the fallback."""
    user = await get_user_by_id(db, user_id)
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Akun tidak ditemukan")
    return await update_password(db, user, password_in.new_password)


@router.post("/{parent_id}/children/{student_id}", status_code=status.HTTP_204_NO_CONTENT)
async def link_child(
    parent_id: int,
    student_id: int,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(require_roles(UserRole.ADMIN)),
) -> None:
    """Links an orang_tua account to a siswa account, so the parent can read
    the child's nilai/absensi and receive email notifications about them."""
    parent = await get_user_by_id(db, parent_id)
    if parent is None or parent.role != UserRole.ORANG_TUA:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Akun orang tua tidak ditemukan")

    student = await get_user_by_id(db, student_id)
    if student is None or student.role != UserRole.SISWA:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Akun siswa tidak ditemukan")

    existing = await parent_child_service.get_link(db, parent_id, student_id)
    if existing is not None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Sudah terhubung")

    await parent_child_service.link_parent_child(db, parent_id, student_id)
