from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, Field


class FarmerProfileCreate(BaseModel):

    state: Optional[str] = None
    district: Optional[str] = None
    village: Optional[str] = None

    farm_size: Optional[Decimal] = Field(
        default=None,
        ge=0
    )

    farm_size_unit: str = "acres"

    crops: Optional[str] = None

    preferred_market: Optional[str] = None

    has_storage: bool = False

    storage_capacity: Optional[Decimal] = Field(
        default=None,
        ge=0
    )


class FarmerProfileResponse(FarmerProfileCreate):

    id: int
    user_id: int

    class Config:
        from_attributes = True