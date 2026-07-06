"""One-off helper for local manual testing only - creates the SQLite dev.db
schema and a known admin/guru/siswa account so the app can be clicked through
in a browser without standing up Postgres. Not part of the app runtime."""

import asyncio

from sqlalchemy.ext.asyncio import create_async_engine

from app.core.security import hash_password
from app.db.base_all import Base
from app.db.session import async_session_maker
from app.models.user import User, UserRole

DEV_DATABASE_URL = "sqlite+aiosqlite:///./dev.db"


async def main() -> None:
    engine = create_async_engine(DEV_DATABASE_URL)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with async_session_maker() as db:
        db.add(
            User(
                email="admin@sekolah.dev",
                full_name="Admin Sekolah",
                hashed_password=hash_password("admin123"),
                role=UserRole.ADMIN,
            )
        )
        db.add(
            User(
                email="guru@sekolah.dev",
                full_name="Bu Guru",
                hashed_password=hash_password("guru123"),
                role=UserRole.GURU,
                nip="G001",
            )
        )
        db.add(
            User(
                email="siswa@sekolah.dev",
                full_name="Budi Siswa",
                hashed_password=hash_password("siswa123"),
                role=UserRole.SISWA,
                nis="S001",
            )
        )
        await db.commit()

    print("Seed selesai: admin@sekolah.dev / admin123 (dan guru/siswa serupa)")


if __name__ == "__main__":
    asyncio.run(main())
