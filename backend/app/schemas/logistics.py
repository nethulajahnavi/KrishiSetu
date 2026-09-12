from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, Field


class LogisticsCreate(BaseModel):

    origin: str
    destination: str

    distance_km: Optional[Decimal] = Field(
        default=None,
        ge=0
    )

    transport_type: Optional[str] = None

    cost_per_quintal: Optional[Decimal] = Field(
        default=None,
        ge=0
    )

    loading_cost_per_quintal: Decimal = Field(
        default=0,
        ge=0
    )

    unloading_cost_per_quintal: Decimal = Field(
        default=0,
        ge=0
    )

    estimated_time_hours: Optional[Decimal] = Field(
        default=None,
        ge=0
    )

    available: bool = True


class LogisticsResponse(LogisticsCreate):

    id: int

    class Config:
        from_attributes = True