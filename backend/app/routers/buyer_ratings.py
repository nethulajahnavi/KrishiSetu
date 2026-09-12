from fastapi import (
    APIRouter,
    Depends
)

from sqlalchemy.orm import Session

from app.database import get_db
from app.models.buyer_rating import BuyerRating
from app.schemas.buyer_rating import (
    BuyerRatingCreate
)

from app.auth.dependencies import get_current_user


router = APIRouter(
    prefix="/api/buyer-ratings",
    tags=["Buyer Ratings"]
)


@router.post("", status_code=201)
def rate_buyer(
    data: BuyerRatingCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):

    rating = BuyerRating(
        buyer_id=data.buyer_id,

        farmer_id=current_user.id,

        transaction_id=data.transaction_id,

        payment_reliability=
            data.payment_reliability,

        communication=
            data.communication,

        fairness=data.fairness,

        overall_rating=
            data.overall_rating,

        feedback=data.feedback
    )

    db.add(rating)

    db.commit()

    db.refresh(rating)

    return {
        "message": "Buyer rating submitted",
        "rating_id": rating.id
    }