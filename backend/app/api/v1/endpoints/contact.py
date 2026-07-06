from fastapi import APIRouter, BackgroundTasks, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.deps import require_roles
from app.db.session import get_db
from app.models.user import User, UserRole
from app.schemas.contact_message import ContactMessageCreate, ContactMessageRead
from app.services import contact_message_service, notification_service

router = APIRouter()


@router.post("", response_model=ContactMessageRead, status_code=status.HTTP_201_CREATED)
async def submit_contact_message(
    message_in: ContactMessageCreate,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
) -> ContactMessageRead:
    """Public endpoint - anyone can submit a question via the Kontak page, no login required."""
    message = await contact_message_service.create_message(db, message_in)

    admin_emails = await notification_service.get_admin_emails(db)
    subject, body = notification_service.build_contact_message_email(message)
    for email in admin_emails:
        background_tasks.add_task(notification_service.send_email, email, subject, body)

    return message


@router.get("", response_model=list[ContactMessageRead])
async def list_contact_messages(
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(require_roles(UserRole.ADMIN)),
) -> list[ContactMessageRead]:
    return await contact_message_service.list_messages(db)
