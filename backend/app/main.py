from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import router as api_v1_router
from app.routers.auth import router as auth_router
from app.routers import users
from app.routers import assistant
from app.routers import market_prices
from app.routers import farmer_profile
from app.routers import logistics
from app.routers import net_realisation
from app.routers import buyers
from app.routers import buyer_matching
from app.routers import transactions
from app.routers import buyer_trust
from app.routers import buyer_ratings
from app.routers import farmer_ratings
from app.routers import notifications
from app.routers import weather
app = FastAPI(
    title="KrishiSetu API",
    description="Agricultural Market Intelligence Platform",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(users.router)
app.include_router(
    farmer_profile.router
)
app.include_router(
    market_prices.router
)
app.include_router(
    assistant.router
)
app.include_router(logistics.router)
app.include_router(
    net_realisation.router
)
app.include_router(
    buyers.router
)
app.include_router(
    buyer_matching.router
)
app.include_router(
    transactions.router
)
app.include_router(
    buyer_trust.router
)

app.include_router(
    buyer_ratings.router
)

app.include_router(api_v1_router)
app.include_router(farmer_ratings.router)
app.include_router(notifications.router)
app.include_router(weather.router)

@app.get("/")
def root():
    return {
        "message": "KrishiSetu API is running"
    }


@app.get("/api/health")
def health():
    return {
        "status": "healthy"
    }