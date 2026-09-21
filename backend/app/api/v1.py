"""
KrishiSetu API v1 router.

New production APIs will be added here incrementally.
Existing /api endpoints remain untouched for backward compatibility.
"""
from app.api.v1.farmer import router as farmer_router

from fastapi import APIRouter

router = APIRouter(
    prefix="/api/v1",
    tags=["API v1"],
)

router.include_router(farmer_router)

@router.get("/health")
def api_v1_health():
    """Health check for the versioned API."""
    return {
        "status": "ok",
        "api_version": "v1",
        "service": "KrishiSetu",
    }