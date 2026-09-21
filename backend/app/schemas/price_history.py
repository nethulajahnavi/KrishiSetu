from datetime import date, datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict


class PriceHistoryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    crop_id: int | None = None
    market_id: int | None = None
    price_date: date
    min_price: Decimal | None = None
    max_price: Decimal | None = None
    modal_price: Decimal | None = None
    arrival_quantity: Decimal | None = None
    source: str | None = None
    data_status: str
    created_at: datetime