from sqlalchemy import (
    Column,
    DateTime,
    ForeignKey,
    Integer,
    Numeric,
    String,
    Text
)
from sqlalchemy.sql import func

from app.database import Base


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    farmer_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    buyer_id = Column(
        Integer,
        ForeignKey("buyers.id"),
        nullable=False
    )

    commodity = Column(
        String(100),
        nullable=False
    )

    quantity_quintals = Column(
        Numeric(12, 2),
        nullable=False
    )

    agreed_price_per_quintal = Column(
        Numeric(12, 2),
        nullable=False
    )

    total_amount = Column(
        Numeric(14, 2),
        nullable=False
    )

    status = Column(
        String(50),
        default="OFFERED"
    )

    payment_status = Column(
        String(50),
        default="PENDING"
    )

    delivery_status = Column(
        String(50),
        default="PENDING"
    )

    farmer_rating = Column(
        Numeric(3, 2)
    )

    farmer_feedback = Column(
        Text
    )

    dispute_status = Column(
        String(50),
        default="NONE"
    )

    created_at = Column(
        DateTime,
        server_default=func.now()
    )

    updated_at = Column(
        DateTime,
        server_default=func.now(),
        onupdate=func.now()
    )