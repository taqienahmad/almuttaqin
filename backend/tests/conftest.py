import asyncio
from collections.abc import AsyncGenerator

import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.pool import StaticPool

from app.core.security import hash_password
from app.db.base_all import Base
from app.db.session import get_db
from app.main import app
from app.models.parent_child import ParentChild
from app.models.user import User, UserRole

TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"

engine = create_async_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False}, poolclass=StaticPool)
TestSessionLocal = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


@pytest.fixture(scope="session")
def event_loop():
    loop = asyncio.new_event_loop()
    yield loop
    loop.close()


@pytest_asyncio.fixture(autouse=True)
async def setup_db() -> AsyncGenerator[None, None]:
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


async def _override_get_db() -> AsyncGenerator[AsyncSession, None]:
    async with TestSessionLocal() as session:
        yield session


app.dependency_overrides[get_db] = _override_get_db


@pytest_asyncio.fixture
async def client() -> AsyncGenerator[AsyncClient, None]:
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac


async def create_user_directly(
    email: str,
    password: str,
    role: UserRole,
    **extra,
) -> User:
    """Bypasses the (admin-only) create-account endpoint - used to bootstrap the
    first admin and to seed other users in tests without needing an admin token."""
    async with TestSessionLocal() as db:
        user = User(
            email=email,
            hashed_password=hash_password(password),
            role=role,
            **extra,
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)
        return user


async def link_parent_child_directly(parent_id: int, student_id: int) -> None:
    async with TestSessionLocal() as db:
        db.add(ParentChild(parent_user_id=parent_id, student_user_id=student_id))
        await db.commit()


async def login(client: AsyncClient, email: str, password: str) -> str:
    resp = await client.post("/api/v1/auth/login", json={"email": email, "password": password})
    assert resp.status_code == 200, resp.text
    return resp.json()["access_token"]
