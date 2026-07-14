"""Seeds a small set of dummy orang_tua/siswa accounts, with some already
linked via parent_child and one deliberately left unlinked - just enough to
demo/test the "Hubungkan Orang Tua <-> Siswa" admin feature on the real site,
without touching kelas/mapel/guru/jadwal/nilai/absensi/posts/PPDB the way the
full seed_dummy.py does.

Safe to re-run: skipped entirely if the first dummy account already exists.

Usage (from backend/): python -m scripts.seed_dummy_parents_students
"""

import asyncio

from sqlalchemy import select

from app.core.security import hash_password
from app.db.session import async_session_maker
from app.models.parent_child import ParentChild
from app.models.user import User, UserRole

DUMMY_PASSWORD = "Sekolah123!"

SISWA_DATA = [
    ("Ahmad Zaki Ramadhan", "dummy.zaki@siswa.almuttaqin.sch.id", "S101"),
    ("Aisyah Putri Nur", "dummy.aisyah@siswa.almuttaqin.sch.id", "S102"),
    ("Muhammad Fathir Al Ghazali", "dummy.fathir@siswa.almuttaqin.sch.id", "S103"),
]

# Third orang tua is deliberately left unlinked so the new dropdown-based
# "Hubungkan" form on the admin dashboard has something to actually link.
ORANG_TUA_DATA = [
    ("Bapak Ridwan Hidayat", "dummy.ridwan@example.com", 0),
    ("Ibu Siti Maryam", "dummy.maryam@example.com", 1),
    ("Bapak Hendra Gunawan", "dummy.hendra@example.com", None),
]


async def main() -> None:
    async with async_session_maker() as db:
        existing = await db.execute(select(User).where(User.email == SISWA_DATA[0][1]))
        if existing.scalar_one_or_none() is not None:
            print("Data dummy orang tua/siswa sudah pernah dibuat sebelumnya - dilewati.")
            return

        siswa_list = [
            User(
                email=email,
                full_name=nama,
                hashed_password=hash_password(DUMMY_PASSWORD),
                role=UserRole.SISWA,
                nis=nis,
            )
            for nama, email, nis in SISWA_DATA
        ]
        db.add_all(siswa_list)
        await db.flush()

        orang_tua_list = [
            User(
                email=email,
                full_name=nama,
                hashed_password=hash_password(DUMMY_PASSWORD),
                role=UserRole.ORANG_TUA,
            )
            for nama, email, _ in ORANG_TUA_DATA
        ]
        db.add_all(orang_tua_list)
        await db.flush()

        for parent, (_, _, siswa_index) in zip(orang_tua_list, ORANG_TUA_DATA):
            if siswa_index is not None:
                db.add(
                    ParentChild(
                        parent_user_id=parent.id,
                        student_user_id=siswa_list[siswa_index].id,
                    )
                )

        await db.commit()

    print("Data dummy berhasil dibuat:")
    print(f"- {len(SISWA_DATA)} akun siswa, {len(ORANG_TUA_DATA)} akun orang tua")
    print("- 2 sudah tertaut, 1 orang tua (Bapak Hendra Gunawan) sengaja belum ditautkan")
    print(f"Semua akun dummy pakai password: {DUMMY_PASSWORD}")


if __name__ == "__main__":
    asyncio.run(main())
