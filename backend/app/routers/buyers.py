from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.buyer import Buyer
from app.schemas.buyer import (
    BuyerCreate,
    BuyerResponse
)


router = APIRouter(
    prefix="/api/buyers",
    tags=["Buyers"]
)


@router.post(
    "",
    response_model=BuyerResponse,
    status_code=201
)
def create_buyer(
    data: BuyerCreate,
    db: Session = Depends(get_db)
):

    buyer = Buyer(
        **data.model_dump()
    )

    db.add(buyer)
    db.commit()
    db.refresh(buyer)

    return buyer


@router.get(
    "",
    response_model=List[BuyerResponse]
)
def get_buyers(
    db: Session = Depends(get_db)
):

    return db.query(
        Buyer
    ).filter(
        Buyer.active == True
    ).all()