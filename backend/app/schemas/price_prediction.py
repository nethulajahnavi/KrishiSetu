from datetime import date, datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict


class PricePredictionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    crop_id: int | None = None
    market_id: int | None = None
    prediction_date: date
    predicted_price: Decimal | None = None
    lower_bound: Decimal | None = None
    upper_bound: Decimal | None = None
    model_name: str | None = None
    confidence: Decimal | None = None
    created_at: datetime