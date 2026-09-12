from pydantic import BaseModel, Field


class BuyerRatingCreate(BaseModel):

    buyer_id: int

    transaction_id: int

    payment_reliability: float = Field(
        ge=1,
        le=5
    )

    communication: float = Field(
        ge=1,
        le=5
    )

    fairness: float = Field(
        ge=1,
        le=5
    )

    overall_rating: float = Field(
        ge=1,
        le=5
    )

    feedback: str | None = None