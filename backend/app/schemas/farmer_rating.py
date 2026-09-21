from pydantic import BaseModel, Field


class FarmerRatingCreate(BaseModel):

    farmer_id: int

    transaction_id: int | None = None

    quality_accuracy: float = Field(
        ge=1,
        le=5
    )

    communication: float = Field(
        ge=1,
        le=5
    )

    reliability: float = Field(
        ge=1,
        le=5
    )

    overall_rating: float = Field(
        ge=1,
        le=5
    )

    feedback: str | None = None