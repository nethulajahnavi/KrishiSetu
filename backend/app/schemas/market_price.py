from datetime import date
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, Field


class MarketPriceCreate(BaseModel):

    commodity: str
    variety: Optional[str] = None

    market_name: str
    district: Optional[str] = None
    state: Optional[str] = None

    price_date: date

    min_price: Optional[Decimal] = Field(
        default=None,
        ge=0
    )

    max_price: Optional[Decimal] = Field(
        default=None,
        ge=0
    )

    modal_price: Optional[Decimal] = Field(
        default=None,
        ge=0
    )

    arrival_quantity: Optional[Decimal] = Field(
        default=None,
        ge=0
    )

    unit: str = "quintal"

    source: Optional[str] = None


class MarketPriceResponse(MarketPriceCreate):

    id: int

    class Config:
        from_attributes = True