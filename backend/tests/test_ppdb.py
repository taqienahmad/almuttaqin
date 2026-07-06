import pytest

from app.models.user import UserRole
from tests.conftest import create_user_directly, login

pytestmark = pytest.mark.asyncio


def _sample_payload(**overrides):
    payload = {
        "nama_anak": "Aisyah",
        "tempat_lahir": "Jakarta",
        "tanggal_lahir": "2021-05-10",
        "jenis_kelamin": "P",
        "nama_ayah": "Budi",
        "nama_ibu": "Siti",
        "email_orang_tua": "ortu.aisyah@schooltest.com",
        "alamat": "Jl. Mawar No. 1",
        "kelompok_dipilih": "tk_a",
        "tahun_ajaran": "2026/2027",
    }
    payload.update(overrides)
    return payload


async def test_public_can_submit_ppdb_without_auth(client):
    resp = await client.post("/api/v1/ppdb", json=_sample_payload())
    assert resp.status_code == 201
    body = resp.json()
    assert body["status"] == "pending"
    assert body["nama_anak"] == "Aisyah"


async def test_non_admin_cannot_list_ppdb(client):
    await create_user_directly("guru_ppdb@schooltest.com", "secret123", UserRole.GURU)
    token = await login(client, "guru_ppdb@schooltest.com", "secret123")

    resp = await client.get("/api/v1/ppdb", headers={"Authorization": f"Bearer {token}"})
    assert resp.status_code == 403


async def test_admin_can_approve_ppdb_and_notification_does_not_crash_request(client):
    await create_user_directly("admin_ppdb@schooltest.com", "secret123", UserRole.ADMIN)
    token = await login(client, "admin_ppdb@schooltest.com", "secret123")
    headers = {"Authorization": f"Bearer {token}"}

    submit = await client.post("/api/v1/ppdb", json=_sample_payload())
    ppdb_id = submit.json()["id"]

    listed = await client.get("/api/v1/ppdb", headers=headers)
    assert listed.status_code == 200
    assert len(listed.json()) == 1

    # SMTP_HOST is unset in the test environment, so send_email should no-op
    # (log and return) instead of making a real network call or raising -
    # this must not affect the 200 response below.
    approved = await client.put(
        f"/api/v1/ppdb/{ppdb_id}/status",
        headers=headers,
        json={"status": "diterima", "catatan_admin": "Dokumen lengkap"},
    )
    assert approved.status_code == 200
    assert approved.json()["status"] == "diterima"
    assert approved.json()["catatan_admin"] == "Dokumen lengkap"
