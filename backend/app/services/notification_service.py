import asyncio
import logging
import smtplib
from email.mime.text import MIMEText

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.models.absensi import Absensi
from app.models.contact_message import ContactMessage
from app.models.nilai import Nilai
from app.models.parent_child import ParentChild
from app.models.post import Post
from app.models.ppdb import PPDBRegistration
from app.models.user import User, UserRole

logger = logging.getLogger(__name__)


async def send_email(to_email: str, subject: str, body: str) -> None:
    """Sends a notification email over plain SMTP. No-ops (just logs) if
    SMTP_HOST isn't configured, so the feature degrades gracefully instead of
    crashing the request that triggered it.

    Safe to call from a FastAPI BackgroundTask: it needs no DB session, only
    plain arguments, since a `yield`-based DB session dependency is already
    torn down by the time background tasks run. smtplib is blocking, so the
    actual send happens in a worker thread via asyncio.to_thread.
    """
    if not settings.SMTP_HOST:
        logger.info("SMTP_HOST not set - skipping email to %s: %s", to_email, subject)
        return

    def _send() -> None:
        message = MIMEText(body)
        message["Subject"] = subject
        message["From"] = f"{settings.SMTP_FROM_NAME} <{settings.SMTP_FROM_EMAIL}>"
        message["To"] = to_email

        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=10) as server:
            if settings.SMTP_USE_TLS:
                server.starttls()
            if settings.SMTP_USERNAME:
                server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
            server.sendmail(settings.SMTP_FROM_EMAIL, [to_email], message.as_string())

    try:
        await asyncio.to_thread(_send)
    except (smtplib.SMTPException, OSError):
        logger.exception("Failed to send email notification to %s", to_email)


async def get_parent_emails(db: AsyncSession, siswa_id: int) -> list[str]:
    """Looks up the email of every orang_tua linked to this siswa via the
    parent_child association table. Must be called with the request's live
    DB session, before scheduling any background task."""
    result = await db.execute(
        select(User.email)
        .join(ParentChild, ParentChild.parent_user_id == User.id)
        .where(ParentChild.student_user_id == siswa_id)
    )
    return list(result.scalars().all())


async def get_all_orang_tua_emails(db: AsyncSession) -> list[str]:
    result = await db.execute(select(User.email).where(User.role == UserRole.ORANG_TUA))
    return list(result.scalars().all())


async def get_admin_emails(db: AsyncSession) -> list[str]:
    result = await db.execute(select(User.email).where(User.role == UserRole.ADMIN))
    return list(result.scalars().all())


def build_absensi_email(absensi: Absensi, siswa_nama: str) -> tuple[str, str]:
    subject = f"Info Absensi - {siswa_nama}"
    body = f"{siswa_nama} tercatat {absensi.status.value} pada {absensi.tanggal.isoformat()}."
    return subject, body


def build_nilai_email(nilai: Nilai, siswa_nama: str) -> tuple[str, str]:
    subject = f"Info Nilai - {siswa_nama}"
    body = f"{siswa_nama} mendapat nilai {nilai.jenis.value} = {nilai.nilai}."
    return subject, body


def build_post_email(post: Post) -> tuple[str, str]:
    subject = "Pengumuman Baru dari Sekolah"
    body = f"{post.title}\n\n{post.content or ''}"
    return subject, body


def build_contact_message_email(message: ContactMessage) -> tuple[str, str]:
    subject = f"Pesan Baru dari Website - {message.nama}"
    body = (
        f"Ada pesan baru masuk lewat form Kontak website:\n\n"
        f"Nama: {message.nama}\n"
        f"Email: {message.email}\n"
        f"WhatsApp: {message.whatsapp or '-'}\n\n"
        f"Pesan:\n{message.pesan}"
    )
    return subject, body


def build_ppdb_status_email(registration: PPDBRegistration) -> tuple[str, str]:
    if registration.status.value == "diterima":
        subject = "Pendaftaran PPDB Diterima"
        body = (
            f"Selamat! Pendaftaran {registration.nama_anak} untuk "
            f"{registration.kelompok_dipilih.value} tahun ajaran {registration.tahun_ajaran} "
            f"telah diterima. Silakan hubungi sekolah untuk proses selanjutnya."
        )
    else:
        subject = "Informasi Status Pendaftaran PPDB"
        body = f"Pendaftaran {registration.nama_anak} belum bisa kami terima saat ini."
    return subject, body
