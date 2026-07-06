"""Import all models here so Alembic autogenerate can discover them via Base.metadata."""

from app.db.base import Base
from app.models.user import User
from app.models.kelas import Kelas
from app.models.mata_pelajaran import MataPelajaran
from app.models.jadwal import Jadwal
from app.models.nilai import Nilai
from app.models.absensi import Absensi
from app.models.post import Post
from app.models.parent_child import ParentChild
from app.models.ppdb import PPDBRegistration
from app.models.contact_message import ContactMessage
from app.models.site_setting import SiteSetting
from app.models.content_item import ContentItem

__all__ = [
    "Base",
    "User",
    "Kelas",
    "MataPelajaran",
    "Jadwal",
    "Nilai",
    "Absensi",
    "Post",
    "ParentChild",
    "PPDBRegistration",
    "ContactMessage",
    "SiteSetting",
    "ContentItem",
]
