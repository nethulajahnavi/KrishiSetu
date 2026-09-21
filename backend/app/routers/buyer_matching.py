from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth.dependencies import require_role
from app.database import get_db
from app.models.buyer import Buyer
from app.models.user import User


router = APIRouter(
    prefix="/api/buyer-matching",
    tags=["Buyer Matching"]
)


@router.get("")
def match_buyers(
    commodity: str,
    quantity: float,
    quality: str,
    district: str,
    current_user: User = Depends(
        require_role("FARMER", "FPO")
    ),
    db: Session = Depends(get_db)
):

    buyers = db.query(
        Buyer
    ).filter(
        Buyer.active == True
    ).all()

    matches = []

    for buyer in buyers:

        # Commodity matching
        commodities = [
            c.strip().lower()
            for c in buyer.commodities.split(",")
        ]

        if commodity.lower() not in commodities:
            continue

        # Quantity matching
        if buyer.min_quantity_quintals is not None:
            if quantity < float(
                buyer.min_quantity_quintals
            ):
                continue

        if buyer.max_quantity_quintals is not None:
            if quantity > float(
                buyer.max_quantity_quintals
            ):
                continue

        score = 0

        # Quality match
        if (
            buyer.preferred_quality
            and buyer.preferred_quality.lower()
            == quality.lower()
        ):
            score += 30

        # Location match
        if (
            buyer.district
            and buyer.district.lower()
            == district.lower()
        ):
            score += 20

        # Verification
        if buyer.verified:
            score += 20

        # Trust
        score += (
            float(buyer.trust_score or 0)
            * 0.2
        )

        # Price
        if buyer.offered_price_per_quintal:
            score += min(
                float(
                    buyer.offered_price_per_quintal
                ) / 100,
                10
            )

        matches.append({
            "buyer_id": buyer.id,
            "business_name": buyer.business_name,
            "buyer_type": buyer.buyer_type,
            "location": buyer.location,
            "offered_price_per_quintal":
                float(
                    buyer.offered_price_per_quintal or 0
                ),
            "payment_days": buyer.payment_days,
            "verified": buyer.verified,
            "trust_score":
                float(buyer.trust_score or 0),
            "preferred_quality":
                buyer.preferred_quality,
            "match_score": round(score, 2)
        })

    matches.sort(
        key=lambda x: x["match_score"],
        reverse=True
    )

    return {
        "commodity": commodity,
        "quantity_quintals": quantity,
        "quality": quality,
        "district": district,
        "matches": matches
    }