import pytest

from app.models.user import UserRole
from tests.conftest import create_user_directly, login

pytestmark = pytest.mark.asyncio


async def test_admin_can_create_guru_account(client):
    await create_user_directly("admin@schooltest.com", "secret123", UserRole.ADMIN)
    token = await login(client, "admin@schooltest.com", "secret123")

    resp = await client.post(
        "/api/v1/users",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "email": "guru1@schooltest.com",
            "password": "secret123",
            "full_name": "Bu Guru",
            "role": "guru",
            "nip": "12345",
        },
    )
    assert resp.status_code == 201
    assert resp.json()["role"] == "guru"


async def test_non_admin_cannot_create_account(client):
    await create_user_directly("siswa1@schooltest.com", "secret123", UserRole.SISWA)
    token = await login(client, "siswa1@schooltest.com", "secret123")

    resp = await client.post(
        "/api/v1/users",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "email": "guru2@schooltest.com",
            "password": "secret123",
            "role": "guru",
        },
    )
    assert resp.status_code == 403


async def test_me_endpoint_returns_own_profile(client):
    await create_user_directly("siswa2@schooltest.com", "secret123", UserRole.SISWA, nis="S001")
    token = await login(client, "siswa2@schooltest.com", "secret123")

    resp = await client.get("/api/v1/users/me", headers={"Authorization": f"Bearer {token}"})
    assert resp.status_code == 200
    assert resp.json()["email"] == "siswa2@schooltest.com"
    assert resp.json()["nis"] == "S001"


async def test_admin_can_link_parent_and_child(client):
    admin = await create_user_directly("admin_link@schooltest.com", "secret123", UserRole.ADMIN)
    parent = await create_user_directly("ortu_link@schooltest.com", "secret123", UserRole.ORANG_TUA)
    student = await create_user_directly("siswa_link@schooltest.com", "secret123", UserRole.SISWA)
    token = await login(client, "admin_link@schooltest.com", "secret123")
    headers = {"Authorization": f"Bearer {token}"}

    resp = await client.post(f"/api/v1/users/{parent.id}/children/{student.id}", headers=headers)
    assert resp.status_code == 204

    duplicate = await client.post(f"/api/v1/users/{parent.id}/children/{student.id}", headers=headers)
    assert duplicate.status_code == 400


async def test_link_child_rejects_wrong_roles(client):
    await create_user_directly("admin_link2@schooltest.com", "secret123", UserRole.ADMIN)
    guru = await create_user_directly("guru_link@schooltest.com", "secret123", UserRole.GURU)
    student = await create_user_directly("siswa_link2@schooltest.com", "secret123", UserRole.SISWA)
    token = await login(client, "admin_link2@schooltest.com", "secret123")
    headers = {"Authorization": f"Bearer {token}"}

    resp = await client.post(f"/api/v1/users/{guru.id}/children/{student.id}", headers=headers)
    assert resp.status_code == 404


async def test_admin_can_reset_password_and_login_with_new_one(client):
    await create_user_directly("admin_reset@schooltest.com", "secret123", UserRole.ADMIN)
    target = await create_user_directly("guru_reset@schooltest.com", "oldpassword", UserRole.GURU)
    token = await login(client, "admin_reset@schooltest.com", "secret123")
    headers = {"Authorization": f"Bearer {token}"}

    resp = await client.put(
        f"/api/v1/users/{target.id}/password",
        headers=headers,
        json={"new_password": "newpassword456"},
    )
    assert resp.status_code == 200
    assert resp.json()["email"] == "guru_reset@schooltest.com"

    old_login = await client.post(
        "/api/v1/auth/login", json={"email": "guru_reset@schooltest.com", "password": "oldpassword"}
    )
    assert old_login.status_code == 401

    new_login = await client.post(
        "/api/v1/auth/login", json={"email": "guru_reset@schooltest.com", "password": "newpassword456"}
    )
    assert new_login.status_code == 200


async def test_non_admin_cannot_reset_password(client):
    actor = await create_user_directly("siswa_reset@schooltest.com", "secret123", UserRole.SISWA)
    token = await login(client, "siswa_reset@schooltest.com", "secret123")

    resp = await client.put(
        f"/api/v1/users/{actor.id}/password",
        headers={"Authorization": f"Bearer {token}"},
        json={"new_password": "hacked123"},
    )
    assert resp.status_code == 403
