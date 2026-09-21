from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth.dependencies import require_role
from app.database import get_db
from app.models.farmer_profile import FarmerProfile
from app.models.user import User
from app.schemas.farmer_profile import (
    FarmerProfileCreate,
    FarmerProfileResponse
)


router = APIRouter(
    prefix="/api/farmer-profile",
    tags=["Farmer Profile"]
)


@router.post(
    "",
    response_model=FarmerProfileResponse,
    status_code=status.HTTP_201_CREATED
)
def create_farmer_profile(
    profile_data: FarmerProfileCreate,
    current_user: User = Depends(require_role("FARMER")),
    db: Session = Depends(get_db)
):

    existing_profile = db.query(
        FarmerProfile
    ).filter(
        FarmerProfile.user_id == current_user.id
    ).first()

    if existing_profile:
        raise HTTPException(
            status_code=400,
            detail="Farmer profile already exists"
        )

    profile = FarmerProfile(
        user_id=current_user.id,
        **profile_data.model_dump()
    )

    db.add(profile)
    db.commit()
    db.refresh(profile)

    return profile


@router.get(
    "",
    response_model=FarmerProfileResponse
)
def get_farmer_profile(
    current_user: User = Depends(require_role("FARMER")),
    db: Session = Depends(get_db)
):

    profile = db.query(
        FarmerProfile
    ).filter(
        FarmerProfile.user_id == current_user.id
    ).first()

    if not profile:
        raise HTTPException(
            status_code=404,
            detail="Farmer profile not found"
        )

    return profile