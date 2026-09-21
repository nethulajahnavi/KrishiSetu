from sqlalchemy import Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class FarmerRating(Base):

    __tablename__ = "farmer_ratings"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True
    )

    # Buyer/User who gives the rating
    buyer_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable=False,
        index=True
    )

    # Farmer/User who receives the rating
    farmer_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable=False,
        index=True
    )

    # Optional transaction reference
    transaction_id: Mapped[int | None] = mapped_column(
        ForeignKey("transactions.id"),
        nullable=True
    )

    # Rating categories
    quality_accuracy: Mapped[float] = mapped_column(
        Float,
        default=0
    )

    communication: Mapped[float] = mapped_column(
        Float,
        default=0
    )

    reliability: Mapped[float] = mapped_column(
        Float,
        default=0
    )

    overall_rating: Mapped[float] = mapped_column(
        Float,
        default=0
    )

    feedback: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )