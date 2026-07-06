import pytest

from app.models.user import UserRole
from tests.conftest import create_user_directly, login

pytestmark = pytest.mark.asyncio


def _sample_payload(**overrides):
    payload = {
        "nama": "Siti Aminah",
        "email": "siti.aminah@schooltest.com",
        "whatsapp": "6281234567890",
        "pesan": "Assalamu'alaikum, apakah masih ada kuota untuk Kelompok Bermain?",
    }
    payload.update(overrides)
    return payload


async def test_public_can_submit_contact_message_without_auth(client):
    # SMTP_HOST is unset in the test environment, so send_email should no-op
    # (log and return) instead of making a real network call or raising -
    # this must not affect the 201 response below.
    resp = await client.post("/api/v1/contact", json=_sample_payload())
    assert resp.status_code == 201
    body = resp.json()
    assert body["nama"] == "Siti Aminah"
    assert body["is_read"] is False


async def test_non_admin_cannot_list_contact_messages(client):
    await create_user_directly("guru_contact@schooltest.com", "secret123", UserRole.GURU)
    token = await login(client, "guru_contact@schooltest.com", "secret123")

    resp = await client.get("/api/v1/contact", headers={"Authorization": f"Bearer {token}"})
    assert resp.status_code == 403


async def test_admin_can_list_contact_messages(client):
    await create_user_directly("admin_contact@schooltest.com", "secret123", UserRole.ADMIN)
    token = await login(client, "admin_contact@schooltest.com", "secret123")

    await client.post("/api/v1/contact", json=_sample_payload())

    resp = await client.get("/api/v1/contact", headers={"Authorization": f"Bearer {token}"})
    assert resp.status_code == 200
    assert len(resp.json()) == 1
    assert resp.json()[0]["email"] == "siti.aminah@schooltest.com"
