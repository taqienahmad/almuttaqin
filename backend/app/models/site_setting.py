from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class SiteSetting(Base):
    """A single editable text value (site-wide copy: hero text, address, etc).

    Keys are fixed by the application (see scripts/seed content), not
    user-created - admin only edits the value, never adds/removes keys.
    """

    __tablename__ = "site_settings"

    key: Mapped[str] = mapped_column(String(100), primary_key=True)
    value: Mapped[str] = mapped_column(Text, nullable=False, default="")
