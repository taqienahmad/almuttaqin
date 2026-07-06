from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.deps import require_roles
from app.db.session import get_db
from app.models.post import PostType
from app.models.user import User, UserRole
from app.schemas.post import PostCreate, PostRead, PostUpdate
from app.services import post_service, notification_service

router = APIRouter()


@router.get("", response_model=list[PostRead])
async def list_posts(
    post_type: PostType | None = Query(default=None, alias="type"),
    db: AsyncSession = Depends(get_db),
) -> list[PostRead]:
    """Public endpoint - only returns published posts, no auth required."""
    return await post_service.list_published_posts(db, post_type)


@router.get("/{post_id}", response_model=PostRead)
async def get_post(post_id: int, db: AsyncSession = Depends(get_db)) -> PostRead:
    post = await post_service.get_post(db, post_id)
    if post is None or not post.is_published:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    return post


@router.post("", response_model=PostRead, status_code=status.HTTP_201_CREATED)
async def create_post(
    post_in: PostCreate,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    author: User = Depends(require_roles(UserRole.ADMIN, UserRole.GURU)),
) -> PostRead:
    post = await post_service.create_post(db, author.id, post_in)
    if post.is_published:
        await _notify_post_published(db, background_tasks, post)
    return post


@router.put("/{post_id}", response_model=PostRead)
async def update_post(
    post_id: int,
    post_in: PostUpdate,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    _author: User = Depends(require_roles(UserRole.ADMIN, UserRole.GURU)),
) -> PostRead:
    post = await post_service.get_post(db, post_id)
    if post is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    was_published = post.is_published
    updated = await post_service.update_post(db, post, post_in)
    if updated.is_published and not was_published:
        await _notify_post_published(db, background_tasks, updated)
    return updated


async def _notify_post_published(db: AsyncSession, background_tasks: BackgroundTasks, post) -> None:
    emails = await notification_service.get_all_orang_tua_emails(db)
    subject, body = notification_service.build_post_email(post)
    for email in emails:
        background_tasks.add_task(notification_service.send_email, email, subject, body)


@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_post(
    post_id: int,
    db: AsyncSession = Depends(get_db),
    _author: User = Depends(require_roles(UserRole.ADMIN, UserRole.GURU)),
) -> None:
    post = await post_service.get_post(db, post_id)
    if post is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    await post_service.delete_post(db, post)
