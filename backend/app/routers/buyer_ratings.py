from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth.dependencies import require_role
from app.database import get_db
from app.models.buyer_rating import BuyerRating
from app.models.user import User
from app.schemas.buyer_rating import BuyerRatingCreate


router = APIRouter(
    prefix="/api/buyer-ratings",
    tags=["Buyer Ratings"]
)


# ============================================================
# RATE A BUYER
# Allowed: FARMER, FPO
# ============================================================

@router.post(
    "",
    status_code=201
)
def rate_buyer(
    data: BuyerRatingCreate,
    current_user: User = Depends(
        require_role("FARMER", "FPO")
    ),
    db: Session = Depends(get_db)
):

    rating = BuyerRating(
        buyer_id=data.buyer_id,
        farmer_id=current_user.id,
        transaction_id=data.transaction_id,
        payment_reliability=data.payment_reliability,
        communication=data.communication,
        fairness=data.fairness,
        overall_rating=data.overall_rating,
        feedback=data.feedback
    )

    db.add(rating)
    db.commit()
    db.refresh(rating)

    return {
        "message": "Buyer rating submitted successfully",
        "rating_id": rating.id
    }