"""
Farmer APIs - Version 1

Production farmer endpoints.
Existing /api/farmer-profile endpoints remain untouched.
"""
from app.models.domain import FarmerLot
from app.schemas.farmer_lot import FarmerLotCreate, FarmerLotResponse
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.database import get_db
from app.models.farmer_profile import FarmerProfile
from app.models.user import User


router = APIRouter(
    prefix="/farmer",
    tags=["API v1 - Farmer"],
)


@router.get("/health")
def farmer_api_health():
    """Health check for the Farmer v1 API."""
    return {
        "status": "ok",
        "module": "farmer",
        "api_version": "v1",
    }


@router.get("/profile")
def get_farmer_profile_v1(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    
    """
    Get the authenticated farmer's profile.

    Requires a valid JWT access token.
    """

    if current_user.role != "FARMER":
        raise HTTPException(
            status_code=403,
            detail="Only farmers can access the farmer profile",
        )

    profile = (
        db.query(FarmerProfile)
        .filter(FarmerProfile.user_id == current_user.id)
        .first()
    )

    if not profile:
        raise HTTPException(
            status_code=404,
            detail="Farmer profile not found",
        )

    return profile
@router.post(
    "/lots",
    response_model=FarmerLotResponse,
    status_code=201,
)
def create_farmer_lot(
    lot_data: FarmerLotCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Create a new produce lot for the authenticated farmer.
    """

    if current_user.role != "FARMER":
        raise HTTPException(
            status_code=403,
            detail="Only farmers can create farmer lots",
        )

    lot = FarmerLot(
        farmer_id=current_user.id,
        **lot_data.model_dump(),
    )

    db.add(lot)
    db.commit()
    db.refresh(lot)

    return lot
@router.get(
    "/lots",
    response_model=list[FarmerLotResponse],
)
def get_farmer_lots(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Get all produce lots belonging to the authenticated farmer.
    """

    if current_user.role != "FARMER":
        raise HTTPException(
            status_code=403,
            detail="Only farmers can access farmer lots",
        )

    lots = (
        db.query(FarmerLot)
        .filter(FarmerLot.farmer_id == current_user.id)
        .order_by(FarmerLot.created_at.desc())
        .all()
    )

    return lots
@router.get(
    "/lots/{lot_id}",
    response_model=FarmerLotResponse,
)
def get_farmer_lot(
    lot_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Get one produce lot belonging to the authenticated farmer.
    """

    if current_user.role != "FARMER":
        raise HTTPException(
            status_code=403,
            detail="Only farmers can access farmer lots",
        )

    lot = (
        db.query(FarmerLot)
        .filter(
            FarmerLot.id == lot_id,
            FarmerLot.farmer_id == current_user.id,
        )
        .first()
    )

    if not lot:
        raise HTTPException(
            status_code=404,
            detail="Farmer lot not found",
        )

    return lot
@router.patch(
    "/lots/{lot_id}",
    response_model=FarmerLotResponse,
)
def update_farmer_lot(
    lot_id: int,
    lot_data: FarmerLotCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Update a produce lot belonging to the authenticated farmer.
    """

    if current_user.role != "FARMER":
        raise HTTPException(
            status_code=403,
            detail="Only farmers can update farmer lots",
        )

    lot = (
        db.query(FarmerLot)
        .filter(
            FarmerLot.id == lot_id,
            FarmerLot.farmer_id == current_user.id,
        )
        .first()
    )

    if not lot:
        raise HTTPException(
            status_code=404,
            detail="Farmer lot not found",
        )

    update_data = lot_data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(lot, field, value)

    db.commit()
    db.refresh(lot)

    return lot
@router.delete(
    "/lots/{lot_id}",
    status_code=204,
)
def delete_farmer_lot(
    lot_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Delete a produce lot belonging to the authenticated farmer.
    """

    if current_user.role != "FARMER":
        raise HTTPException(
            status_code=403,
            detail="Only farmers can delete farmer lots",
        )

    lot = (
        db.query(FarmerLot)
        .filter(
            FarmerLot.id == lot_id,
            FarmerLot.farmer_id == current_user.id,
        )
        .first()
    )

    if not lot:
        raise HTTPException(
            status_code=404,
            detail="Farmer lot not found",
        )

    db.delete(lot)
    db.commit()

    return None