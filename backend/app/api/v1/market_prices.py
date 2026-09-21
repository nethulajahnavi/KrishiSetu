"""
Market Prices API - Version 1

Production market-price endpoints.

The existing /api/market-prices endpoints remain untouched.
"""

from datetime import date
from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.market_price import MarketPrice
from app.schemas.market_price import MarketPriceResponse


router = APIRouter(
    prefix="/market-prices",
    tags=["API v1 - Market Prices"],
)


@router.get(
    "",
    response_model=list[MarketPriceResponse],
)
def get_market_prices_v1(
    commodity: Optional[str] = Query(
        default=None,
        description="Filter by commodity, e.g. Onion or Tomato",
    ),
    district: Optional[str] = Query(
        default=None,
        description="Filter by district",
    ),
    state: Optional[str] = Query(
        default=None,
        description="Filter by state",
    ),
    market_name: Optional[str] = Query(
        default=None,
        description="Filter by market/APMC name",
    ),
    price_date: Optional[date] = Query(
        default=None,
        description="Filter by exact price date",
    ),
    include_demo: bool = Query(
        default=True,
        description="Include records marked as DEMO DATA",
    ),
    db: Session = Depends(get_db),
):
    """
    Get market prices with optional filters.

    Demo records are explicitly marked as DEMO_DATA.
    Older real records are marked as LAST_REPORTED.
    Recent real records are marked as CURRENT.
    """

    query = db.query(MarketPrice)

    # -----------------------------
    # Filters
    # -----------------------------

    if commodity:
        query = query.filter(
            MarketPrice.commodity.ilike(f"%{commodity}%")
        )

    if district:
        query = query.filter(
            MarketPrice.district.ilike(f"%{district}%")
        )

    if state:
        query = query.filter(
            MarketPrice.state.ilike(f"%{state}%")
        )

    if market_name:
        query = query.filter(
            MarketPrice.market_name.ilike(f"%{market_name}%")
        )

    if price_date:
        query = query.filter(
            MarketPrice.price_date == price_date
        )

    if not include_demo:
        query = query.filter(
            MarketPrice.is_demo_data.is_(False)
        )

    # -----------------------------
    # Fetch records
    # -----------------------------

    prices = (
        query
        .order_by(
            MarketPrice.price_date.desc(),
            MarketPrice.market_name.asc(),
        )
        .all()
    )

    # -----------------------------
    # Calculate data status
    # -----------------------------

    today = date.today()

    for price in prices:

        if price.is_demo_data:
            price.data_status = "DEMO_DATA"

        else:
            age_days = (today - price.price_date).days

            if age_days <= 1:
                price.data_status = "CURRENT"
            else:
                price.data_status = "LAST_REPORTED"

    return prices