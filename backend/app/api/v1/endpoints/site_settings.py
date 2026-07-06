from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.deps import require_roles
from app.db.session import get_db
from app.models.user import User, UserRole
from app.services import site_setting_service

router = APIRouter()


@router.get("", response_model=dict[str, str])
async def get_site_settings(db: AsyncSession = Depends(get_db)) -> dict[str, str]:
    """Public endpoint - site-wide copy (hero text, address, etc) is shown to every visitor."""
    return await site_setting_service.get_all_settings(db)


@router.put("", response_model=dict[str, str])
async def update_site_settings(
    updates: dict[str, str],
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(require_roles(UserRole.ADMIN)),
) -> dict[str, str]:
    return await site_setting_service.update_settings(db, updates)
