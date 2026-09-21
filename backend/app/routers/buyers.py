from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.auth.dependencies import require_role
from app.database import get_db
from app.models.buyer import Buyer
from app.models.user import User
from app.schemas.buyer import (
    BuyerCreate,
    BuyerResponse
)


router = APIRouter(
    prefix="/api/buyers",
    tags=["Buyers"]
)


# ============================================================
# CREATE BUYER PROFILE
# Allowed: BUYER, ADMIN
# ============================================================

@router.post(
    "",
    response_model=BuyerResponse,
    status_code=201
)
def create_buyer(
    data: BuyerCreate,
    current_user: User = Depends(
        require_role("BUYER", "ADMIN")
    ),
    db: Session = Depends(get_db)
):

    # A normal BUYER can have only one buyer profile.
    if current_user.role.value == "BUYER":

        existing_buyer = (
            db.query(Buyer)
            .filter(
                Buyer.user_id == current_user.id
            )
            .first()
        )

        if existing_buyer:
            raise HTTPException(
                status_code=400,
                detail="Buyer profile already exists for this user"
            )

    buyer = Buyer(
        user_id=(
            current_user.id
            if current_user.role.value == "BUYER"
            else None
        ),
        **data.model_dump()
    )

    db.add(buyer)
    db.commit()
    db.refresh(buyer)

    return buyer


# ============================================================
# GET BUYERS
# Allowed: FARMER, FPO, BUYER, ADMIN
# ============================================================

@router.get(
    "",
    response_model=List[BuyerResponse]
)
def get_buyers(
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

    return (
        db.query(Buyer)
        .filter(
            Buyer.active == True
        )
        .all()
    )