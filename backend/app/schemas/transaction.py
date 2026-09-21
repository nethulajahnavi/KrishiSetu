from decimal import Decimal

from pydantic import BaseModel, Field


class TransactionCreate(BaseModel):
    buyer_id: int
    commodity: str
    quantity_quintals: Decimal = Field(gt=0)
    agreed_price_per_quintal: Decimal = Field(gt=0)


class TransactionStatusUpdate(BaseModel):
    status: str


class PaymentStatusUpdate(BaseModel):
    payment_status: str

class DeliveryStatusUpdate(BaseModel):
    delivery_status: str

class DisputeStatusUpdate(BaseModel):
    dispute_status: str
    
class TransactionResponse(BaseModel):
    id: int
    farmer_id: int
    buyer_id: int
    commodity: str
    quantity_quintals: Decimal
    agreed_price_per_quintal: Decimal
    total_amount: Decimal
    status: str
    payment_status: str
    delivery_status: str
    dispute_status: str

    class Config:
        from_attributes = True