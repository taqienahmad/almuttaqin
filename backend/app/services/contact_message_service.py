from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.contact_message import ContactMessage
from app.schemas.contact_message import ContactMessageCreate


async def create_message(db: AsyncSession, message_in: ContactMessageCreate) -> ContactMessage:
    message = ContactMessage(**message_in.model_dump())
    db.add(message)
    await db.commit()
    await db.refresh(message)
    return message


async def list_messages(db: AsyncSession) -> list[ContactMessage]:
    result = await db.execute(select(ContactMessage).order_by(ContactMessage.created_at.desc()))
    return list(result.scalars().all())
