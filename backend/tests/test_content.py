import pytest

from app.models.user import UserRole
from tests.conftest import create_user_directly, login

pytestmark = pytest.mark.asyncio


def _sample_item(**overrides):
    payload = {
        "section": "keunggulan",
        "sort_order": 1,
        "icon": "heart",
        "title": "Kurikulum Islami Terpadu",
        "subtitle": None,
        "description": "Pembiasaan akhlak sehari-hari.",
    }
    payload.update(overrides)
    return payload


async def test_public_can_list_content_items_by_section(client):
    await create_user_directly("admin_content@schooltest.com", "secret123", UserRole.ADMIN)
    token = await login(client, "admin_content@schooltest.com", "secret123")
    await client.post(
        "/api/v1/content-items", json=_sample_item(), headers={"Authorization": f"Bearer {token}"}
    )
    await client.post(
        "/api/v1/content-items",
        json=_sample_item(section="nilai", title="Iman"),
        headers={"Authorization": f"Bearer {token}"},
    )

    resp = await client.get("/api/v1/content-items?section=keunggulan")
    assert resp.status_code == 200
    body = resp.json()
    assert len(body) == 1
    assert body[0]["title"] == "Kurikulum Islami Terpadu"


async def test_guru_can_create_but_siswa_cannot_create_content_item(client):
    await create_user_directly("guru_content@schooltest.com", "secret123", UserRole.GURU)
    token = await login(client, "guru_content@schooltest.com", "secret123")

    resp = await client.post(
        "/api/v1/content-items", json=_sample_item(), headers={"Authorization": f"Bearer {token}"}
    )
    assert resp.status_code == 201

    await create_user_directly("siswa_content@schooltest.com", "secret123", UserRole.SISWA)
    siswa_token = await login(client, "siswa_content@schooltest.com", "secret123")
    resp = await client.post(
        "/api/v1/content-items", json=_sample_item(), headers={"Authorization": f"Bearer {siswa_token}"}
    )
    assert resp.status_code == 403


async def test_admin_can_update_and_delete_content_item(client):
    await create_user_directly("admin_content2@schooltest.com", "secret123", UserRole.ADMIN)
    token = await login(client, "admin_content2@schooltest.com", "secret123")
    headers = {"Authorization": f"Bearer {token}"}

    create_resp = await client.post("/api/v1/content-items", json=_sample_item(), headers=headers)
    item_id = create_resp.json()["id"]

    update_resp = await client.put(
        f"/api/v1/content-items/{item_id}", json={"title": "Kurikulum Terpadu (Update)"}, headers=headers
    )
    assert update_resp.status_code == 200
    assert update_resp.json()["title"] == "Kurikulum Terpadu (Update)"

    delete_resp = await client.delete(f"/api/v1/content-items/{item_id}", headers=headers)
    assert delete_resp.status_code == 204

    list_resp = await client.get("/api/v1/content-items?section=keunggulan")
    assert list_resp.json() == []


async def test_public_can_read_site_settings(client):
    resp = await client.get("/api/v1/site-settings")
    assert resp.status_code == 200
    assert resp.json() == {}


async def test_non_admin_cannot_update_site_settings(client):
    await create_user_directly("guru_settings@schooltest.com", "secret123", UserRole.GURU)
    token = await login(client, "guru_settings@schooltest.com", "secret123")

    resp = await client.put(
        "/api/v1/site-settings",
        json={"hero_title": "Judul Baru"},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert resp.status_code == 403


async def test_admin_can_update_site_settings(client):
    await create_user_directly("admin_settings@schooltest.com", "secret123", UserRole.ADMIN)
    token = await login(client, "admin_settings@schooltest.com", "secret123")
    headers = {"Authorization": f"Bearer {token}"}

    resp = await client.put(
        "/api/v1/site-settings", json={"hero_title": "Judul Baru", "address": "Alamat Baru"}, headers=headers
    )
    assert resp.status_code == 200
    assert resp.json() == {"hero_title": "Judul Baru", "address": "Alamat Baru"}

    # Updating again with a subset should only touch the given keys.
    resp2 = await client.put("/api/v1/site-settings", json={"hero_title": "Judul Baru 2"}, headers=headers)
    assert resp2.status_code == 200
    assert resp2.json()["address"] == "Alamat Baru"
    assert resp2.json()["hero_title"] == "Judul Baru 2"

    public_resp = await client.get("/api/v1/site-settings")
    assert public_resp.json()["hero_title"] == "Judul Baru 2"
