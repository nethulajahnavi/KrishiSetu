from datetime import date
from decimal import Decimal
from pydantic import BaseModel, ConfigDict


class FarmerLotCreate(BaseModel):
    crop_id: int | None = None
    quantity: Decimal
    unit: str = "kg"
    quality_grade: str | None = None
    variety: str | None = None
    harvest_date: date | None = None
    expected_ready_date: date | None = None
    location: str | None = None
    district: str | None = None
    state: str | None = None


class FarmerLotResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    farmer_id: int
    crop_id: int | None = None
    quantity: Decimal
    unit: str
    quality_grade: str | None = None
    variety: str | None = None
    harvest_date: date | None = None
    expected_ready_date: date | None = None
    location: str | None = None
    district: str | None = None
    state: str | None = None
    status: str