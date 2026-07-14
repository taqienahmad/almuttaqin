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


async def test_admin_can_update_profile_fields(client):
    await create_user_directly("admin_update@schooltest.com", "secret123", UserRole.ADMIN)
    target = await create_user_directly("siswa_update@schooltest.com", "secret123", UserRole.SISWA)
    token = await login(client, "admin_update@schooltest.com", "secret123")
    headers = {"Authorization": f"Bearer {token}"}

    resp = await client.put(
        f"/api/v1/users/{target.id}",
        headers=headers,
        json={"full_name": "Siswa Baru", "nis": "S999"},
    )
    assert resp.status_code == 200
    body = resp.json()
    assert body["full_name"] == "Siswa Baru"
    assert body["nis"] == "S999"

    deactivate = await client.put(
        f"/api/v1/users/{target.id}",
        headers=headers,
        json={"is_active": False},
    )
    assert deactivate.status_code == 200
    assert deactivate.json()["is_active"] is False
    assert deactivate.json()["full_name"] == "Siswa Baru"


async def test_update_unknown_user_returns_404(client):
    await create_user_directly("admin_update2@schooltest.com", "secret123", UserRole.ADMIN)
    token = await login(client, "admin_update2@schooltest.com", "secret123")

    resp = await client.put(
        "/api/v1/users/999999",
        headers={"Authorization": f"Bearer {token}"},
        json={"full_name": "Tidak Ada"},
    )
    assert resp.status_code == 404


async def test_create_account_rejects_short_password(client):
    await create_user_directly("admin_shortpw@schooltest.com", "secret123", UserRole.ADMIN)
    token = await login(client, "admin_shortpw@schooltest.com", "secret123")

    resp = await client.post(
        "/api/v1/users",
        headers={"Authorization": f"Bearer {token}"},
        json={"email": "weak@schooltest.com", "password": "short", "role": "guru"},
    )
    assert resp.status_code == 422


async def test_reset_password_rejects_short_password(client):
    await create_user_directly("admin_shortpw2@schooltest.com", "secret123", UserRole.ADMIN)
    target = await create_user_directly("guru_shortpw@schooltest.com", "secret123", UserRole.GURU)
    token = await login(client, "admin_shortpw2@schooltest.com", "secret123")

    resp = await client.put(
        f"/api/v1/users/{target.id}/password",
        headers={"Authorization": f"Bearer {token}"},
        json={"new_password": "short"},
    )
    assert resp.status_code == 422


async def test_create_account_rejects_duplicate_nis(client):
    await create_user_directly("admin_dupnis@schooltest.com", "secret123", UserRole.ADMIN)
    await create_user_directly("siswa_dupnis1@schooltest.com", "secret123", UserRole.SISWA, nis="S500")
    token = await login(client, "admin_dupnis@schooltest.com", "secret123")

    resp = await client.post(
        "/api/v1/users",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "email": "siswa_dupnis2@schooltest.com",
            "password": "secret123",
            "role": "siswa",
            "nis": "S500",
        },
    )
    assert resp.status_code == 400


async def test_create_account_rejects_duplicate_nip(client):
    await create_user_directly("admin_dupnip@schooltest.com", "secret123", UserRole.ADMIN)
    await create_user_directly("guru_dupnip1@schooltest.com", "secret123", UserRole.GURU, nip="G500")
    token = await login(client, "admin_dupnip@schooltest.com", "secret123")

    resp = await client.post(
        "/api/v1/users",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "email": "guru_dupnip2@schooltest.com",
            "password": "secret123",
            "role": "guru",
            "nip": "G500",
        },
    )
    assert resp.status_code == 400


async def test_update_account_rejects_duplicate_nis(client):
    await create_user_directly("admin_dupnis2@schooltest.com", "secret123", UserRole.ADMIN)
    await create_user_directly("siswa_dupnis3@schooltest.com", "secret123", UserRole.SISWA, nis="S600")
    target = await create_user_directly("siswa_dupnis4@schooltest.com", "secret123", UserRole.SISWA, nis="S601")
    token = await login(client, "admin_dupnis2@schooltest.com", "secret123")

    resp = await client.put(
        f"/api/v1/users/{target.id}",
        headers={"Authorization": f"Bearer {token}"},
        json={"nis": "S600"},
    )
    assert resp.status_code == 400


async def test_update_account_keeps_same_nis_without_conflict(client):
    await create_user_directly("admin_samenis@schooltest.com", "secret123", UserRole.ADMIN)
    target = await create_user_directly("siswa_samenis@schooltest.com", "secret123", UserRole.SISWA, nis="S700")
    token = await login(client, "admin_samenis@schooltest.com", "secret123")

    resp = await client.put(
        f"/api/v1/users/{target.id}",
        headers={"Authorization": f"Bearer {token}"},
        json={"nis": "S700", "full_name": "Nama Baru"},
    )
    assert resp.status_code == 200
    assert resp.json()["full_name"] == "Nama Baru"


async def test_deactivated_account_cannot_login(client):
    await create_user_directly("admin_deactivate@schooltest.com", "secret123", UserRole.ADMIN)
    target = await create_user_directly("guru_deactivate@schooltest.com", "secret123", UserRole.GURU)
    admin_token = await login(client, "admin_deactivate@schooltest.com", "secret123")

    resp = await client.put(
        f"/api/v1/users/{target.id}",
        headers={"Authorization": f"Bearer {admin_token}"},
        json={"is_active": False},
    )
    assert resp.status_code == 200

    login_attempt = await client.post(
        "/api/v1/auth/login",
        json={"email": "guru_deactivate@schooltest.com", "password": "secret123"},
    )
    assert login_attempt.status_code == 403


async def test_deactivating_account_revokes_existing_token(client):
    await create_user_directly("admin_revoke@schooltest.com", "secret123", UserRole.ADMIN)
    target = await create_user_directly("guru_revoke@schooltest.com", "secret123", UserRole.GURU)
    admin_token = await login(client, "admin_revoke@schooltest.com", "secret123")
    target_token = await login(client, "guru_revoke@schooltest.com", "secret123")

    await client.put(
        f"/api/v1/users/{target.id}",
        headers={"Authorization": f"Bearer {admin_token}"},
        json={"is_active": False},
    )

    resp = await client.get("/api/v1/users/me", headers={"Authorization": f"Bearer {target_token}"})
    assert resp.status_code == 403


async def test_non_admin_cannot_update_profile(client):
    actor = await create_user_directly("siswa_update2@schooltest.com", "secret123", UserRole.SISWA)
    token = await login(client, "siswa_update2@schooltest.com", "secret123")

    resp = await client.put(
        f"/api/v1/users/{actor.id}",
        headers={"Authorization": f"Bearer {token}"},
        json={"full_name": "Hack"},
    )
    assert resp.status_code == 403


async def test_non_admin_cannot_reset_password(client):
    actor = await create_user_directly("siswa_reset@schooltest.com", "secret123", UserRole.SISWA)
    token = await login(client, "siswa_reset@schooltest.com", "secret123")

    resp = await client.put(
        f"/api/v1/users/{actor.id}/password",
        headers={"Authorization": f"Bearer {token}"},
        json={"new_password": "hacked123"},
    )
    assert resp.status_code == 403
