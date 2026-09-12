from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, Numeric, String, Text
from sqlalchemy.sql import func

from app.database import Base


class FarmerProfile(Base):
    __tablename__ = "farmer_profiles"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        unique=True,
        nullable=False
    )

    state = Column(String(100))
    district = Column(String(100))
    village = Column(String(100))

    farm_size = Column(Numeric(10, 2))
    farm_size_unit = Column(
        String(20),
        default="acres"
    )

    crops = Column(Text)

    preferred_market = Column(String(150))

    has_storage = Column(
        Boolean,
        default=False
    )

    storage_capacity = Column(
        Numeric(10, 2)
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