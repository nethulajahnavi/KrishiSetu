from datetime import date, datetime
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, Field, ConfigDict


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

    is_demo_data: bool = False


class MarketPriceResponse(MarketPriceCreate):

    id: int
    last_updated_at: Optional[datetime] = None

    # Calculated by the API.
    # Examples: CURRENT, LAST_REPORTED, DEMO_DATA
    data_status: str = "LAST_REPORTED"

    model_config = ConfigDict(from_attributes=True)