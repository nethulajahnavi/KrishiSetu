"""
Price History API - Version 1

Provides historical market-price data for charts,
trend analysis, and future price prediction.
"""

from datetime import date
from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.domain import PriceHistory
from app.schemas.price_history import PriceHistoryResponse


router = APIRouter(
    prefix="/price-history",
    tags=["API v1 - Price History"],
)


@router.get(
    "",
    response_model=list[PriceHistoryResponse],
)
def get_price_history(
    crop_id: Optional[int] = Query(
        default=None,
        description="Filter by crop ID",
    ),
    market_id: Optional[int] = Query(
        default=None,
        description="Filter by market ID",
    ),
    start_date: Optional[date] = Query(
        default=None,
        description="Return prices from this date onward",
    ),
    end_date: Optional[date] = Query(
        default=None,
        description="Return prices up to this date",
    ),
    max_records: int = Query(
        default=100,
        ge=1,
        le=500,
        alias="limit",
        description="Maximum number of history records to return",
    ),
    db: Session = Depends(get_db),
):
    """
    Get historical market prices.

    Optional filters:
    - crop_id
    - market_id
    - start_date
    - end_date
    - limit

    Results are ordered from oldest to newest.
    """

    query = db.query(PriceHistory)

    if crop_id is not None:
        query = query.filter(
            PriceHistory.crop_id == crop_id
        )

    if market_id is not None:
        query = query.filter(
            PriceHistory.market_id == market_id
        )

    if start_date is not None:
        query = query.filter(
            PriceHistory.price_date >= start_date
        )

    if end_date is not None:
        query = query.filter(
            PriceHistory.price_date <= end_date
        )

    query = query.order_by(
        PriceHistory.price_date.asc(),
        PriceHistory.id.asc(),
    )

    query = query.limit(max_records)

    return query.all()