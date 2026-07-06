from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class Kelas(Base):
    __tablename__ = "kelas"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)

    # Plain integer (no FK constraint) referencing users.id at the application
    # level only, to avoid a circular FK cycle between `users` and `kelas`
    # (users.kelas_id -> kelas.id) that SQLite can't express via ALTER.
    wali_kelas_id: Mapped[int | None] = mapped_column(Integer, nullable=True)
