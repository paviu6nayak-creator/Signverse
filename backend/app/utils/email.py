"""
Minimal SMTP email helper, used for the forgot-password flow.

In development (no SMTP credentials configured) this just logs the
reset link instead of sending an email, so the flow is testable
without setting up a mail server.
"""
import logging
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from app.config import settings

logger = logging.getLogger("signverse.email")


async def send_password_reset_email(to_email: str, full_name: str, reset_token: str) -> None:
    reset_link = f"{settings.FRONTEND_URL}/reset-password?token={reset_token}"

    if not settings.SMTP_USERNAME or not settings.SMTP_PASSWORD:
        logger.info("[DEV MODE] Password reset link for %s: %s", to_email, reset_link)
        return

    message = MIMEMultipart("alternative")
    message["Subject"] = "Reset your SignVerse password"
    message["From"] = f"{settings.SMTP_FROM_NAME} <{settings.SMTP_USERNAME}>"
    message["To"] = to_email

    html = f"""
    <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
        <h2 style="color:#2DD4BF;">Reset your password</h2>
        <p>Hi {full_name},</p>
        <p>We received a request to reset your SignVerse password. This link expires in 30 minutes.</p>
        <p><a href="{reset_link}" style="background:#2DD4BF;color:#0B1120;padding:12px 20px;
           border-radius:8px;text-decoration:none;font-weight:600;">Reset Password</a></p>
        <p>If you didn't request this, you can safely ignore this email.</p>
    </div>
    """
    message.attach(MIMEText(html, "html"))

    try:
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
            server.starttls()
            server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
            server.sendmail(settings.SMTP_USERNAME, to_email, message.as_string())
    except Exception:
        logger.exception("Failed to send password reset email to %s", to_email)
