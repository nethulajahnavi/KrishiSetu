from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.market_price import MarketPrice
from app.models.buyer import Buyer
from app.models.logistics import LogisticsOption

router = APIRouter(
    prefix="/api/assistant",
    tags=["AI Assistant"]
)


def normalize(value):
    if value is None:
        return None

    return float(value)


@router.post("")
def assistant(
    request: dict,
    db: Session = Depends(get_db)
):
    question = request.get("question", "").strip()
    commodity = request.get("commodity", "Onion").strip()
    origin = request.get("origin", "Nashik").strip()
    quantity = float(request.get("quantity", 10))

    if not question:
        raise HTTPException(
            status_code=400,
            detail="Question is required"
        )

    if quantity <= 0:
        raise HTTPException(
            status_code=400,
            detail="Quantity must be greater than zero"
        )

    # -------------------------------------------------
    # MARKET DATA
    # -------------------------------------------------

    prices = db.query(MarketPrice).filter(
        MarketPrice.commodity.ilike(commodity)
    ).order_by(
        MarketPrice.price_date.desc()
    ).all()

    if not prices:
        return {
            "answer": (
                f"I could not find current market data "
                f"for {commodity}."
            ),
            "commodity": commodity,
            "market_data": [],
            "buyers": [],
            "logistics": []
        }

    market_data = []

    for price in prices:

        modal_price = normalize(price.modal_price)

        if modal_price is None:
            continue

        market_data.append({
            "market": price.market_name,
            "district": price.district,
            "state": price.state,
            "price": modal_price,
            "min_price": normalize(price.min_price),
            "max_price": normalize(price.max_price),
            "arrival_quantity": normalize(
                price.arrival_quantity
            ),
            "date": str(price.price_date)
        })

    # Remove duplicate market entries
    unique_markets = {}

    for item in market_data:
        market = item["market"]

        if market not in unique_markets:
            unique_markets[market] = item

    market_data = list(unique_markets.values())

    # -------------------------------------------------
    # BUYERS
    # -------------------------------------------------

    buyers_db = db.query(Buyer).filter(
        Buyer.active == True
    ).all()

    buyers = []

    for buyer in buyers_db:

        commodities = (
            buyer.commodities or ""
        ).lower()

        if commodity.lower() in commodities:

            buyers.append({
                "business_name":
                    buyer.business_name,

                "location":
                    buyer.location,

                "buyer_type":
                    buyer.buyer_type,

                "offered_price":
                    normalize(
                        buyer.offered_price_per_quintal
                    ),

                "min_quantity":
                    normalize(
                        buyer.min_quantity_quintals
                    ),

                "max_quantity":
                    normalize(
                        buyer.max_quantity_quintals
                    ),

                "payment_days":
                    buyer.payment_days,

                "verified":
                    buyer.verified,

                "trust_score":
                    normalize(
                        buyer.trust_score
                    )
            })

    buyers.sort(
        key=lambda x: (
            x["offered_price"] or 0
        ),
        reverse=True
    )

    # -------------------------------------------------
    # LOGISTICS
    # -------------------------------------------------

    logistics_db = db.query(
        LogisticsOption
    ).filter(
        LogisticsOption.origin.ilike(origin),
        LogisticsOption.available == True
    ).all()

    logistics = []

    for option in logistics_db:

        transport = normalize(
            option.cost_per_quintal
        ) or 0

        loading = normalize(
            option.loading_cost_per_quintal
        ) or 0

        unloading = normalize(
            option.unloading_cost_per_quintal
        ) or 0

        total_cost = (
            transport +
            loading +
            unloading
        )

        logistics.append({
            "destination":
                option.destination,

            "transport_type":
                option.transport_type,

            "distance_km":
                normalize(
                    option.distance_km
                ),

            "transport_cost":
                transport,

            "loading_cost":
                loading,

            "unloading_cost":
                unloading,

            "total_cost_per_quintal":
                total_cost,

            "estimated_time_hours":
                normalize(
                    option.estimated_time_hours
                )
        })

    logistics.sort(
        key=lambda x:
        x["total_cost_per_quintal"]
    )

    # -------------------------------------------------
    # BEST MARKET
    # -------------------------------------------------

    best_market = None

    if market_data:
        best_market = max(
            market_data,
            key=lambda x: x["price"]
        )

    # -------------------------------------------------
    # PRICE TREND
    # -------------------------------------------------

    recent_prices = []

    for price in prices[:7]:

        modal = normalize(price.modal_price)

        if modal is not None:
            recent_prices.append(modal)

    trend = "stable"

    if len(recent_prices) >= 2:

        latest = recent_prices[0]
        previous = recent_prices[-1]

        if latest > previous:
            trend = "increasing"

        elif latest < previous:
            trend = "decreasing"

    # -------------------------------------------------
    # AI-LIKE RECOMMENDATION
    # -------------------------------------------------

    if best_market:

        best_price = best_market["price"]

        answer = (
            f"For {commodity}, the highest current "
            f"market price is ₹{best_price:.2f}/quintal "
            f"at {best_market['market']}. "
        )

        if trend == "increasing":
            answer += (
                "Recent available prices indicate an "
                "increasing trend, so waiting may be "
                "worth considering if your storage "
                "conditions are suitable."
            )

        elif trend == "decreasing":
            answer += (
                "Recent available prices indicate a "
                "decreasing trend, so selling sooner "
                "may reduce the risk of a lower price."
            )

        else:
            answer += (
                "Recent available prices appear relatively "
                "stable, so compare net realisation and "
                "transport costs before deciding."
            )

    else:

        answer = (
            f"I found limited market information for "
            f"{commodity}."
        )

    # -------------------------------------------------
    # BUYER RECOMMENDATION
    # -------------------------------------------------

    buyer_recommendation = None

    if buyers:
        buyer_recommendation = buyers[0]

    # -------------------------------------------------
    # TRANSPORT RECOMMENDATION
    # -------------------------------------------------

    transport_recommendation = None

    if logistics:
        transport_recommendation = logistics[0]

    # -------------------------------------------------
    # FINAL RESPONSE
    # -------------------------------------------------

    return {
        "answer": answer,

        "commodity": commodity,

        "origin": origin,

        "quantity_quintals": quantity,

        "price_trend": trend,

        "best_market": best_market,

        "recommended_buyer":
            buyer_recommendation,

        "recommended_transport":
            transport_recommendation,

        "market_data":
            market_data,

        "buyers":
            buyers,

        "logistics":
            logistics
    }