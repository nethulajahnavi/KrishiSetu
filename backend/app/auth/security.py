from datetime import datetime, timedelta, timezone

from argon2 import PasswordHasher
from jose import jwt

from app.config import settings


ALGORITHM = "HS256"

password_hasher = PasswordHasher()


def hash_password(password: str) -> str:
    """Hash a user's password securely."""
    return password_hasher.hash(password)


def verify_password(
    plain_password: str,
    hashed_password: str
) -> bool:
    """Verify a password against its stored hash."""

    try:
        password_hasher.verify(
            hashed_password,
            plain_password
        )
        return True

    except Exception:
        return False


def create_access_token(
    user_id: int,
    role: str
) -> str:

    expire = datetime.now(timezone.utc) + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )

    payload = {
        "sub": str(user_id),
        "role": role,
        "exp": expire
    }

    return jwt.encode(
        payload,
        settings.JWT_SECRET,
        algorithm=ALGORITHM
    )