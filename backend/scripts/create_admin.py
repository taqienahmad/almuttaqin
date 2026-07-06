"""One-off bootstrap script to create the first admin account.

There is no public self-registration endpoint by design (accounts are
admin-managed). Run this once against a fresh database to create the admin
who can then create every other account via POST /api/v1/users.

Usage (from backend/): python -m scripts.create_admin
"""

import asyncio
import getpass

from app.core.security import hash_password
from app.db.session import async_session_maker
from app.models.user import User, UserRole


async def main() -> None:
    email = input("Admin email: ").strip()
    password = getpass.getpass("Admin password: ")
    full_name = input("Full name (optional): ").strip() or None

    async with async_session_maker() as db:
        db.add(
            User(
                email=email,
                full_name=full_name,
                hashed_password=hash_password(password),
                role=UserRole.ADMIN,
            )
        )
        await db.commit()

    print(f"Admin account '{email}' created.")


if __name__ == "__main__":
    asyncio.run(main())
