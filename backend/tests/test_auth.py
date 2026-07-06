import pytest

from app.models.user import UserRole
from tests.conftest import create_user_directly

pytestmark = pytest.mark.asyncio


async def test_login_success(client):
    await create_user_directly("admin@schooltest.com", "secret123", UserRole.ADMIN)

    resp = await client.post(
        "/api/v1/auth/login", json={"email": "admin@schooltest.com", "password": "secret123"}
    )
    assert resp.status_code == 200
    assert "access_token" in resp.json()


async def test_login_wrong_password(client):
    await create_user_directly("admin2@schooltest.com", "secret123", UserRole.ADMIN)

    resp = await client.post(
        "/api/v1/auth/login", json={"email": "admin2@schooltest.com", "password": "wrong"}
    )
    assert resp.status_code == 401


async def test_no_public_registration_endpoint(client):
    resp = await client.post(
        "/api/v1/auth/register", json={"email": "x@schooltest.com", "password": "secret123"}
    )
    assert resp.status_code == 404
