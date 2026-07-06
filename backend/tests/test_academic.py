import pytest

from app.models.user import UserRole
from tests.conftest import create_user_directly, link_parent_child_directly, login

pytestmark = pytest.mark.asyncio


async def _auth_headers(client, email, password):
    token = await login(client, email, password)
    return {"Authorization": f"Bearer {token}"}


async def test_duplicate_kelas_name_returns_400_not_500(client):
    await create_user_directly("admin4@schooltest.com", "secret123", UserRole.ADMIN)
    headers = await _auth_headers(client, "admin4@schooltest.com", "secret123")

    first = await client.post("/api/v1/kelas", headers=headers, json={"name": "7A"})
    assert first.status_code == 201

    duplicate = await client.post("/api/v1/kelas", headers=headers, json={"name": "7A"})
    assert duplicate.status_code == 400


async def test_guru_can_create_nilai_siswa_cannot(client):
    guru = await create_user_directly("guru@schooltest.com", "secret123", UserRole.GURU)
    siswa = await create_user_directly("siswa@schooltest.com", "secret123", UserRole.SISWA, nis="S001")

    guru_headers = await _auth_headers(client, "guru@schooltest.com", "secret123")
    mapel_resp = await client.post(
        "/api/v1/mata-pelajaran", headers=guru_headers, json={"name": "Matematika", "code": "MTK"}
    )
    # guru is not admin, so creating mata_pelajaran should be forbidden
    assert mapel_resp.status_code == 403

    admin = await create_user_directly("admin@schooltest.com", "secret123", UserRole.ADMIN)
    admin_headers = await _auth_headers(client, "admin@schooltest.com", "secret123")
    mapel_resp = await client.post(
        "/api/v1/mata-pelajaran", headers=admin_headers, json={"name": "Matematika", "code": "MTK"}
    )
    assert mapel_resp.status_code == 201
    mapel_id = mapel_resp.json()["id"]

    nilai_resp = await client.post(
        "/api/v1/nilai",
        headers=guru_headers,
        json={
            "siswa_id": siswa.id,
            "mata_pelajaran_id": mapel_id,
            "jenis": "uts",
            "nilai": 88.5,
            "semester": 1,
            "tahun_ajaran": "2025/2026",
        },
    )
    assert nilai_resp.status_code == 201

    siswa_headers = await _auth_headers(client, "siswa@schooltest.com", "secret123")
    forbidden_resp = await client.post(
        "/api/v1/nilai",
        headers=siswa_headers,
        json={
            "siswa_id": siswa.id,
            "mata_pelajaran_id": mapel_id,
            "jenis": "uts",
            "nilai": 100,
            "semester": 1,
            "tahun_ajaran": "2025/2026",
        },
    )
    assert forbidden_resp.status_code == 403


async def test_siswa_and_orang_tua_scoped_read(client):
    admin = await create_user_directly("admin2@schooltest.com", "secret123", UserRole.ADMIN)
    guru = await create_user_directly("guru2@schooltest.com", "secret123", UserRole.GURU)
    siswa_a = await create_user_directly("siswaA@schooltest.com", "secret123", UserRole.SISWA)
    siswa_b = await create_user_directly("siswaB@schooltest.com", "secret123", UserRole.SISWA)
    orang_tua = await create_user_directly("ortu@schooltest.com", "secret123", UserRole.ORANG_TUA)
    await link_parent_child_directly(orang_tua.id, siswa_a.id)

    admin_headers = await _auth_headers(client, "admin2@schooltest.com", "secret123")
    mapel_resp = await client.post(
        "/api/v1/mata-pelajaran", headers=admin_headers, json={"name": "IPA", "code": "IPA"}
    )
    mapel_id = mapel_resp.json()["id"]

    guru_headers = await _auth_headers(client, "guru2@schooltest.com", "secret123")
    for siswa in (siswa_a, siswa_b):
        resp = await client.post(
            "/api/v1/nilai",
            headers=guru_headers,
            json={
                "siswa_id": siswa.id,
                "mata_pelajaran_id": mapel_id,
                "jenis": "uh",
                "nilai": 90,
                "semester": 1,
                "tahun_ajaran": "2025/2026",
            },
        )
        assert resp.status_code == 201

    siswa_a_headers = await _auth_headers(client, "siswaA@schooltest.com", "secret123")
    resp = await client.get("/api/v1/nilai", headers=siswa_a_headers)
    assert resp.status_code == 200
    assert len(resp.json()) == 1
    assert resp.json()[0]["siswa_id"] == siswa_a.id

    ortu_headers = await _auth_headers(client, "ortu@schooltest.com", "secret123")
    resp = await client.get("/api/v1/nilai", headers=ortu_headers)
    assert resp.status_code == 200
    assert len(resp.json()) == 1
    assert resp.json()[0]["siswa_id"] == siswa_a.id


async def test_posts_public_read_admin_write(client):
    admin = await create_user_directly("admin3@schooltest.com", "secret123", UserRole.ADMIN)
    admin_headers = await _auth_headers(client, "admin3@schooltest.com", "secret123")

    anon_create = await client.post(
        "/api/v1/posts", json={"type": "pengumuman", "title": "Libur", "is_published": True}
    )
    assert anon_create.status_code == 401

    created = await client.post(
        "/api/v1/posts",
        headers=admin_headers,
        json={"type": "pengumuman", "title": "Libur Semester", "is_published": True},
    )
    assert created.status_code == 201

    draft = await client.post(
        "/api/v1/posts",
        headers=admin_headers,
        json={"type": "berita", "title": "Draft belum terbit", "is_published": False},
    )
    assert draft.status_code == 201

    public_list = await client.get("/api/v1/posts")
    assert public_list.status_code == 200
    titles = [p["title"] for p in public_list.json()]
    assert "Libur Semester" in titles
    assert "Draft belum terbit" not in titles
