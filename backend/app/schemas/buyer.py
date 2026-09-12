from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, Field


class BuyerCreate(BaseModel):

    business_name: str
    contact_person: Optional[str] = None

    phone: Optional[str] = None
    email: Optional[str] = None

    state: Optional[str] = None
    district: Optional[str] = None
    location: Optional[str] = None

    buyer_type: Optional[str] = None

    commodities: str

    min_quantity_quintals: Optional[Decimal] = Field(
        default=None,
        ge=0
    )

    max_quantity_quintals: Optional[Decimal] = Field(
        default=None,
        ge=0
    )

    preferred_quality: Optional[str] = None

    offered_price_per_quintal: Optional[Decimal] = Field(
        default=None,
        ge=0
    )

    payment_days: int = Field(
        default=0,
        ge=0
    )

    verified: bool = False

    trust_score: Decimal = Field(
        default=0,
        ge=0,
        le=100
    )

    active: bool = True


class BuyerResponse(BuyerCreate):

    id: int

    class Config:
        from_attributes = True