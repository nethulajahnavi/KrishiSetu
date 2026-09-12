import enum

from sqlalchemy import Boolean, Enum, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class UserRole(str, enum.Enum):
    FARMER = "FARMER"
    FPO = "FPO"
    BUYER = "BUYER"
    ADMIN = "ADMIN"


class User(Base):

    __tablename__ = "users"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True
    )

    name: Mapped[str] = mapped_column(
        String(100)
    )

    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        index=True
    )

    phone: Mapped[str] = mapped_column(
        String(20),
        unique=True,
        index=True
    )

    password_hash: Mapped[str] = mapped_column(
        String(255)
    )

    role: Mapped[UserRole] = mapped_column(
        Enum(UserRole),
        default=UserRole.FARMER
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True
    )