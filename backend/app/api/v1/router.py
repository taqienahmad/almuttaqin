from fastapi import APIRouter

from app.api.v1.endpoints import (
    absensi,
    auth,
    contact,
    content_items,
    jadwal,
    kelas,
    mata_pelajaran,
    nilai,
    posts,
    ppdb,
    site_settings,
    users,
)

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(kelas.router, prefix="/kelas", tags=["kelas"])
api_router.include_router(mata_pelajaran.router, prefix="/mata-pelajaran", tags=["mata-pelajaran"])
api_router.include_router(jadwal.router, prefix="/jadwal", tags=["jadwal"])
api_router.include_router(nilai.router, prefix="/nilai", tags=["nilai"])
api_router.include_router(absensi.router, prefix="/absensi", tags=["absensi"])
api_router.include_router(posts.router, prefix="/posts", tags=["posts"])
api_router.include_router(ppdb.router, prefix="/ppdb", tags=["ppdb"])
api_router.include_router(contact.router, prefix="/contact", tags=["contact"])
api_router.include_router(content_items.router, prefix="/content-items", tags=["content-items"])
api_router.include_router(site_settings.router, prefix="/site-settings", tags=["site-settings"])
