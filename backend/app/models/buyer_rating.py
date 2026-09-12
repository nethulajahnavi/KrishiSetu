from sqlalchemy import (
    Column,
    DateTime,
    ForeignKey,
    Integer,
    Numeric,
    Text
)
from sqlalchemy.sql import func

from app.database import Base


class BuyerRating(Base):
    __tablename__ = "buyer_ratings"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    buyer_id = Column(
        Integer,
        ForeignKey("buyers.id"),
        nullable=False
    )

    farmer_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    transaction_id = Column(
        Integer,
        ForeignKey("transactions.id")
    )

    payment_reliability = Column(
        Numeric(3, 2)
    )

    communication = Column(
        Numeric(3, 2)
    )

    fairness = Column(
        Numeric(3, 2)
    )

    overall_rating = Column(
        Numeric(3, 2)
    )

    feedback = Column(
        Text
    )

    created_at = Column(
        DateTime,
        server_default=func.now()
    )