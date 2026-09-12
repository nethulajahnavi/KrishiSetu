from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.market_price import MarketPrice
from app.schemas.market_price import (
    MarketPriceCreate,
    MarketPriceResponse
)


router = APIRouter(
    prefix="/api/market-prices",
    tags=["Market Prices"]
)


@router.post(
    "",
    response_model=MarketPriceResponse,
    status_code=201
)
def create_market_price(
    price_data: MarketPriceCreate,
    db: Session = Depends(get_db)
):

    market_price = MarketPrice(
        **price_data.model_dump()
    )

    db.add(market_price)
    db.commit()
    db.refresh(market_price)

    return market_price


@router.get(
    "",
    response_model=List[MarketPriceResponse]
)
def get_market_prices(
    db: Session = Depends(get_db)
):

    prices = db.query(
        MarketPrice
    ).order_by(
        MarketPrice.price_date.desc()
    ).all()

    return prices