from sqlalchemy import Boolean, Column, Date, DateTime, Integer, Numeric, String
from sqlalchemy.sql import func

from app.database import Base


class MarketPrice(Base):
    __tablename__ = "market_prices"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    commodity = Column(
        String(100),
        nullable=False
    )

    variety = Column(
        String(100)
    )

    market_name = Column(
        String(150),
        nullable=False
    )

    district = Column(
        String(100)
    )

    state = Column(
        String(100)
    )

    price_date = Column(
        Date,
        nullable=False
    )

    min_price = Column(
        Numeric(12, 2)
    )

    max_price = Column(
        Numeric(12, 2)
    )

    modal_price = Column(
        Numeric(12, 2)
    )

    arrival_quantity = Column(
        Numeric(12, 2)
    )

    unit = Column(
        String(30),
        default="quintal"
    )

    source = Column(
        String(255)
    )

    created_at = Column(
        DateTime,
        server_default=func.now()
    )
    is_demo_data = Column(
        Boolean,
        default=False,
        nullable=False
    )

    last_updated_at = Column(
        DateTime,
        server_default=func.now(),
        onupdate=func.now()
    )