from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Integer,
    Numeric,
    String
)
from sqlalchemy.sql import func

from app.database import Base


class LogisticsOption(Base):
    __tablename__ = "logistics_options"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    origin = Column(
        String(150),
        nullable=False
    )

    destination = Column(
        String(150),
        nullable=False
    )

    distance_km = Column(
        Numeric(10, 2)
    )

    transport_type = Column(
        String(100)
    )

    cost_per_quintal = Column(
        Numeric(12, 2)
    )

    loading_cost_per_quintal = Column(
        Numeric(12, 2),
        default=0
    )

    unloading_cost_per_quintal = Column(
        Numeric(12, 2),
        default=0
    )

    estimated_time_hours = Column(
        Numeric(8, 2)
    )

    available = Column(
        Boolean,
        default=True
    )

    created_at = Column(
        DateTime,
        server_default=func.now()
    )