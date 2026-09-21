from sqlalchemy import (
    Boolean,
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


class Buyer(Base):
    __tablename__ = "buyers"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=True,
        unique=True,
        index=True
    )

    business_name = Column(
        String(200),
        nullable=False
    )

    contact_person = Column(
        String(150)
    )

    phone = Column(
        String(20)
    )

    email = Column(
        String(150)
    )

    state = Column(
        String(100)
    )

    district = Column(
        String(100)
    )

    location = Column(
        String(200)
    )

    buyer_type = Column(
        String(100)
    )

    commodities = Column(
        Text
    )

    min_quantity_quintals = Column(
        Numeric(12, 2)
    )

    max_quantity_quintals = Column(
        Numeric(12, 2)
    )

    preferred_quality = Column(
        String(100)
    )

    offered_price_per_quintal = Column(
        Numeric(12, 2)
    )

    payment_days = Column(
        Integer,
        default=0
    )

    verified = Column(
        Boolean,
        default=False
    )

    trust_score = Column(
        Numeric(5, 2),
        default=0
    )

    active = Column(
        Boolean,
        default=True
    )

    created_at = Column(
        DateTime,
        server_default=func.now()
    )