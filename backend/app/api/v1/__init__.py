"""
KrishiSetu API v1 package.
"""

from fastapi import APIRouter

from app.api.v1.farmer import router as farmer_router
from app.api.v1.market_prices import router as market_prices_router
from app.api.v1.price_history import router as price_history_router
router = APIRouter(
    prefix="/api/v1",
    tags=["API v1"],
)


router.include_router(farmer_router)
router.include_router(market_prices_router)
router.include_router(price_history_router)
@router.get("/health")
def api_v1_health():
    """Health check for the versioned API."""
    return {
        "status": "ok",
        "api_version": "v1",
        "service": "KrishiSetu",
    }