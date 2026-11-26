import logging
import smtplib
import ssl
from email.message import EmailMessage
from urllib.parse import urlencode, urlsplit

from app.core.config import get_settings


logger = logging.getLogger(__name__)


class EmailDeliveryError(RuntimeError):
    """Raised when SMTP delivery is unavailable or fails."""


def build_verification_url(email: str, token: str) -> str:
    settings = get_settings()
    parsed = urlsplit(settings.frontend_base_url)
    if parsed.scheme not in {"http", "https"} or not parsed.netloc:
        raise EmailDeliveryError("Email verification is not configured.")
    if settings.app_env == "production" and parsed.scheme != "https":
        raise EmailDeliveryError("Email verification is not configured securely.")
    query = urlencode({"email": email, "token": token})
    return f"{settings.frontend_base_url}/verify-email?{query}"


def send_verification_email(recipient: str, verification_url: str) -> None:
    settings = get_settings()
    if not settings.smtp_host or not settings.smtp_from_address:
        raise EmailDeliveryError("Email delivery is not configured.")

    message = EmailMessage()
    message["Subject"] = "Verify your AgriSensing email"
    message["From"] = settings.smtp_from_address
    message["To"] = recipient
    message.set_content(
        "If you requested an AgriSensing account verification, open this link to continue:\n\n"
        f"{verification_url}\n\n"
        "This link expires soon. If you did not request it, you can ignore this message."
    )

    stage = "connect"
    try:
        with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=10) as server:
            stage = "greeting"
            server.ehlo()
            if settings.smtp_use_starttls:
                stage = "starttls"
                server.starttls(context=ssl.create_default_context())
                stage = "secure_greeting"
                server.ehlo()
            if settings.smtp_username and settings.smtp_password:
                stage = "login"
                server.login(settings.smtp_username, settings.smtp_password)
            stage = "send"
            server.send_message(message)
            stage = "quit"
    except OSError as exc:
        # SMTP exception messages can contain addresses or other private values.
        logger.warning(
            "Verification email failed stage=%s error=%s smtp_code=%s",
            stage,
            type(exc).__name__,
            getattr(exc, "smtp_code", None),
        )
        raise EmailDeliveryError("Email delivery failed.") from None
