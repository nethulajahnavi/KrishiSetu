from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.buyer import Buyer
from app.models.buyer_rating import BuyerRating


router = APIRouter(
    prefix="/api/buyer-trust",
    tags=["Buyer Trust"]
)


@router.get("/{buyer_id}")
def get_buyer_trust(
    buyer_id: int,
    db: Session = Depends(get_db)
):

    buyer = db.query(
        Buyer
    ).filter(
        Buyer.id == buyer_id
    ).first()

    if not buyer:
        raise HTTPException(
            status_code=404,
            detail="Buyer not found"
        )

    ratings = db.query(
        BuyerRating
    ).filter(
        BuyerRating.buyer_id == buyer_id
    ).all()

    if not ratings:

        return {
            "buyer_id": buyer.id,
            "business_name": buyer.business_name,
            "verified": buyer.verified,
            "trust_score": 50,
            "rating_count": 0,
            "message":
                "Not enough transaction history"
        }

    payment = sum(
        float(r.payment_reliability or 0)
        for r in ratings
    ) / len(ratings)

    communication = sum(
        float(r.communication or 0)
        for r in ratings
    ) / len(ratings)

    fairness = sum(
        float(r.fairness or 0)
        for r in ratings
    ) / len(ratings)

    overall = sum(
        float(r.overall_rating or 0)
        for r in ratings
    ) / len(ratings)

    verification_bonus = (
        10 if buyer.verified else 0
    )

    trust_score = (
        overall * 10 * 0.4
        + payment * 10 * 0.25
        + communication * 10 * 0.15
        + fairness * 10 * 0.10
        + verification_bonus
    )

    trust_score = min(
        round(trust_score, 2),
        100
    )

    return {
        "buyer_id": buyer.id,
        "business_name": buyer.business_name,
        "verified": buyer.verified,
        "trust_score": trust_score,
        "rating_count": len(ratings),
        "components": {
            "overall_rating": round(overall, 2),
            "payment_reliability":
                round(payment, 2),
            "communication":
                round(communication, 2),
            "fairness":
                round(fairness, 2)
        }
    }