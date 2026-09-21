from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.database import get_db
from app.models.buyer import Buyer
from app.models.buyer_rating import BuyerRating
from app.models.user import User


router = APIRouter(
    prefix="/api/buyer-trust",
    tags=["Buyer Trust"]
)


# ============================================================
# GET BUYER TRUST SCORE
# Allowed: ANY AUTHENTICATED USER
# ============================================================

@router.get("/{buyer_id}")
def get_buyer_trust(
    buyer_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    buyer = (
        db.query(Buyer)
        .filter(Buyer.id == buyer_id)
        .first()
    )

    if not buyer:
        raise HTTPException(
            status_code=404,
            detail="Buyer not found"
        )

    ratings = (
        db.query(BuyerRating)
        .filter(
            BuyerRating.buyer_id == buyer_id
        )
        .all()
    )

    # --------------------------------------------------------
    # No ratings yet
    # --------------------------------------------------------

    if not ratings:

        return {
            "buyer_id": buyer.id,
            "business_name": buyer.business_name,
            "trust_score": float(buyer.trust_score or 0),
            "total_ratings": 0,
            "average_rating": 0,
            "payment_reliability": 0,
            "communication": 0,
            "fairness": 0,
            "verified": buyer.verified,
            "message": "No ratings available yet"
        }

    # --------------------------------------------------------
    # Calculate averages
    # --------------------------------------------------------

    total_ratings = len(ratings)

    average_rating = sum(
        float(r.overall_rating or 0)
        for r in ratings
    ) / total_ratings

    payment_reliability = sum(
        float(r.payment_reliability or 0)
        for r in ratings
    ) / total_ratings

    communication = sum(
        float(r.communication or 0)
        for r in ratings
    ) / total_ratings

    fairness = sum(
        float(r.fairness or 0)
        for r in ratings
    ) / total_ratings

    # --------------------------------------------------------
    # Trust score
    # --------------------------------------------------------

    trust_score = (
        average_rating * 20
    )

    # Add verification bonus
    if buyer.verified:
        trust_score += 10

    # Keep score between 0 and 100
    trust_score = min(
        max(trust_score, 0),
        100
    )

    return {
        "buyer_id": buyer.id,
        "business_name": buyer.business_name,

        "trust_score": round(
            trust_score,
            2
        ),

        "total_ratings": total_ratings,

        "average_rating": round(
            average_rating,
            2
        ),

        "payment_reliability": round(
            payment_reliability,
            2
        ),

        "communication": round(
            communication,
            2
        ),

        "fairness": round(
            fairness,
            2
        ),

        "verified": buyer.verified
    }