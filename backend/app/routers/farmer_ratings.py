from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.auth.dependencies import require_role
from app.database import get_db
from app.models.farmer_rating import FarmerRating
from app.models.user import User
from app.schemas.farmer_rating import FarmerRatingCreate


router = APIRouter(
    prefix="/api/farmer-ratings",
    tags=["Farmer Ratings"]
)


# ============================================================
# RATE FARMER
# Allowed: BUYER
# ============================================================

@router.post(
    "",
    status_code=201
)
def rate_farmer(
    data: FarmerRatingCreate,
    current_user: User = Depends(
        require_role("BUYER")
    ),
    db: Session = Depends(get_db)
):

    # --------------------------------------------------------
    # Prevent buyer from rating themselves
    # --------------------------------------------------------

    if data.farmer_id == current_user.id:

        raise HTTPException(
            status_code=400,
            detail="You cannot rate yourself."
        )

    # --------------------------------------------------------
    # Create rating
    # --------------------------------------------------------

    rating = FarmerRating(

        buyer_id=current_user.id,

        farmer_id=data.farmer_id,

        transaction_id=data.transaction_id,

        quality_accuracy=data.quality_accuracy,

        communication=data.communication,

        reliability=data.reliability,

        overall_rating=data.overall_rating,

        feedback=data.feedback
    )

    db.add(rating)
    db.commit()
    db.refresh(rating)

    return {
        "message": "Farmer rating submitted successfully",
        "rating_id": rating.id
    }


# ============================================================
# GET FARMER RATING
# Allowed: ALL AUTHENTICATED USERS
# ============================================================

@router.get("/{farmer_id}")
def get_farmer_rating(
    farmer_id: int,
    current_user: User = Depends(
        require_role(
            "FARMER",
            "FPO",
            "BUYER",
            "ADMIN"
        )
    ),
    db: Session = Depends(get_db)
):

    ratings = (
        db.query(FarmerRating)
        .filter(
            FarmerRating.farmer_id == farmer_id
        )
        .all()
    )

    # --------------------------------------------------------
    # No ratings
    # --------------------------------------------------------

    if not ratings:

        return {
            "farmer_id": farmer_id,
            "average_rating": 0,
            "quality_accuracy": 0,
            "communication": 0,
            "reliability": 0,
            "total_ratings": 0,
            "message": "No ratings available yet"
        }

    # --------------------------------------------------------
    # Calculate averages
    # --------------------------------------------------------

    total = len(ratings)

    average_rating = sum(
        float(r.overall_rating or 0)
        for r in ratings
    ) / total

    quality_accuracy = sum(
        float(r.quality_accuracy or 0)
        for r in ratings
    ) / total

    communication = sum(
        float(r.communication or 0)
        for r in ratings
    ) / total

    reliability = sum(
        float(r.reliability or 0)
        for r in ratings
    ) / total

    return {

        "farmer_id": farmer_id,

        "average_rating": round(
            average_rating,
            2
        ),

        "quality_accuracy": round(
            quality_accuracy,
            2
        ),

        "communication": round(
            communication,
            2
        ),

        "reliability": round(
            reliability,
            2
        ),

        "total_ratings": total
    }