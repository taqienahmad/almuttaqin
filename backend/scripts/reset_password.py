"""One-off helper to reset a user's password when they've forgotten it.

There is no "forgot password" flow in the app (no email sending for that
purpose), so this script exists as the manual admin-side fallback.

Usage (from backend/): python -m scripts.reset_password
"""

import asyncio
import getpass

from sqlalchemy import select

from app.core.security import hash_password
from app.db.session import async_session_maker
from app.models.user import User


async def main() -> None:
    email = input("Email akun yang mau di-reset: ").strip()
    new_password = getpass.getpass("Password baru: ")
    confirm_password = getpass.getpass("Ulangi password baru: ")

    if new_password != confirm_password:
        print("Password tidak cocok, dibatalkan.")
        return

    async with async_session_maker() as db:
        result = await db.execute(select(User).where(User.email == email))
        user = result.scalar_one_or_none()
        if user is None:
            print(f"Tidak ada akun dengan email '{email}'.")
            return

        user.hashed_password = hash_password(new_password)
        await db.commit()

    print(f"Password akun '{email}' berhasil direset.")


if __name__ == "__main__":
    asyncio.run(main())
