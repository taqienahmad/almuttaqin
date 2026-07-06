from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.deps import require_roles
from app.db.session import get_db
from app.models.user import User, UserRole
from app.schemas.content_item import ContentItemCreate, ContentItemRead, ContentItemUpdate
from app.services import content_item_service

router = APIRouter()


@router.get("", response_model=list[ContentItemRead])
async def list_content_items(
    section: str = Query(...),
    db: AsyncSession = Depends(get_db),
) -> list[ContentItemRead]:
    """Public endpoint - page content (feature cards, schedules, etc) has no auth requirement."""
    return await content_item_service.list_by_section(db, section)


@router.post("", response_model=ContentItemRead, status_code=status.HTTP_201_CREATED)
async def create_content_item(
    item_in: ContentItemCreate,
    db: AsyncSession = Depends(get_db),
    _author: User = Depends(require_roles(UserRole.ADMIN, UserRole.GURU)),
) -> ContentItemRead:
    return await content_item_service.create_item(db, item_in)


@router.put("/{item_id}", response_model=ContentItemRead)
async def update_content_item(
    item_id: int,
    item_in: ContentItemUpdate,
    db: AsyncSession = Depends(get_db),
    _author: User = Depends(require_roles(UserRole.ADMIN, UserRole.GURU)),
) -> ContentItemRead:
    item = await content_item_service.get_item(db, item_id)
    if item is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Content item not found")
    return await content_item_service.update_item(db, item, item_in)


@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_content_item(
    item_id: int,
    db: AsyncSession = Depends(get_db),
    _author: User = Depends(require_roles(UserRole.ADMIN, UserRole.GURU)),
) -> None:
    item = await content_item_service.get_item(db, item_id)
    if item is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Content item not found")
    await content_item_service.delete_item(db, item)
