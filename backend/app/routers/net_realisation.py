from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.auth.dependencies import require_role
from app.models.user import User
from app.database import get_db
from app.models.market_price import MarketPrice
from app.models.logistics import LogisticsOption


router = APIRouter(
    prefix="/api/net-realisation",
    tags=["Net Realisation"]
)


@router.get("")
def calculate_net_realisation(
    commodity: str,
    origin: str,
    quantity: float,
    current_user: User = Depends(
        require_role("FARMER", "FPO", "ADMIN")
    ),
    db: Session = Depends(get_db)
):
    """
    Calculate net realisation for a commodity across available markets.

    The calculation uses:
    - Current modal market price
    - Transport cost
    - Loading cost
    - Unloading cost
    - Distance
    - Transport type

    Logistics lookup is made more flexible by:
    1. Exact origin + destination match
    2. Case-insensitive matching
    3. Partial location matching
    4. Normalized market names
    """

    if quantity <= 0:
        raise HTTPException(
            status_code=400,
            detail="Quantity must be greater than zero"
        )

    # ---------------------------------------------------------
    # 1. GET MARKET PRICES
    # ---------------------------------------------------------

    prices = (
        db.query(MarketPrice)
        .filter(
            MarketPrice.commodity.ilike(
                commodity.strip()
            )
        )
        .all()
    )

    if not prices:
        return {
            "commodity": commodity,
            "origin": origin,
            "quantity_quintals": quantity,
            "recommendation": None,
            "markets": []
        }

    results = []

    # ---------------------------------------------------------
    # 2. PROCESS EACH MARKET
    # ---------------------------------------------------------

    for price in prices:

        market_name = (
            price.market_name or ""
        ).strip()

        origin_clean = (
            origin or ""
        ).strip()

        # -----------------------------------------------------
        # IMPROVED LOGISTICS LOOKUP
        # -----------------------------------------------------

        logistics = None

        # A. Exact case-insensitive match
        if origin_clean and market_name:

            logistics = (
                db.query(LogisticsOption)
                .filter(
                    LogisticsOption.available.is_(True),
                    LogisticsOption.origin.ilike(
                        origin_clean
                    ),
                    LogisticsOption.destination.ilike(
                        market_name
                    )
                )
                .order_by(
                    LogisticsOption.cost_per_quintal.asc()
                )
                .first()
            )

        # B. Partial origin + destination match
        if not logistics and origin_clean and market_name:

            logistics = (
                db.query(LogisticsOption)
                .filter(
                    LogisticsOption.available.is_(True),
                    LogisticsOption.origin.ilike(
                        f"%{origin_clean}%"
                    ),
                    LogisticsOption.destination.ilike(
                        f"%{market_name}%"
                    )
                )
                .order_by(
                    LogisticsOption.cost_per_quintal.asc()
                )
                .first()
            )

        # C. Try matching destination without "Market"/"APMC"
        if not logistics and market_name:

            destination_variants = [
                market_name,
                market_name.replace(
                    " Market", ""
                ).strip(),
                market_name.replace(
                    " APMC", ""
                ).strip(),
                market_name.replace(
                    " Market", ""
                ).replace(
                    " APMC", ""
                ).strip()
            ]

            for destination in destination_variants:

                if not destination:
                    continue

                logistics = (
                    db.query(LogisticsOption)
                    .filter(
                        LogisticsOption.available.is_(True),
                        LogisticsOption.origin.ilike(
                            f"%{origin_clean}%"
                        ),
                        LogisticsOption.destination.ilike(
                            f"%{destination}%"
                        )
                    )
                    .order_by(
                        LogisticsOption.cost_per_quintal.asc()
                    )
                    .first()
                )

                if logistics:
                    break

        # -----------------------------------------------------
        # 3. LOGISTICS VALUES
        # -----------------------------------------------------

        if logistics:

            transport_cost = float(
                logistics.cost_per_quintal or 0
            )

            loading_cost = float(
                logistics.loading_cost_per_quintal or 0
            )

            unloading_cost = float(
                logistics.unloading_cost_per_quintal or 0
            )

            distance_km = float(
                logistics.distance_km or 0
            )

            transport_type = (
                logistics.transport_type
            )

            estimated_time_hours = (
                float(
                    logistics.estimated_time_hours
                )
                if logistics.estimated_time_hours
                is not None
                else None
            )

            logistics_available = True

        else:

            transport_cost = 0
            loading_cost = 0
            unloading_cost = 0

            distance_km = 0
            transport_type = None
            estimated_time_hours = None

            logistics_available = False

        # -----------------------------------------------------
        # 4. MARKET PRICE
        # -----------------------------------------------------

        market_price = float(
            price.modal_price or 0
        )

        # -----------------------------------------------------
        # 5. TOTAL LOGISTICS COST
        # -----------------------------------------------------

        total_cost_per_quintal = (
            transport_cost
            + loading_cost
            + unloading_cost
        )

        # -----------------------------------------------------
        # 6. NET PRICE
        # -----------------------------------------------------

        net_price_per_quintal = (
            market_price
            - total_cost_per_quintal
        )

        # -----------------------------------------------------
        # 7. TOTAL REVENUE
        # -----------------------------------------------------

        total_gross = (
            market_price * quantity
        )

        total_cost = (
            total_cost_per_quintal * quantity
        )

        total_net = (
            net_price_per_quintal * quantity
        )

        # -----------------------------------------------------
        # 8. RESULT
        # -----------------------------------------------------

        results.append({

            "market": market_name,

            "district": price.district,

            "state": price.state,

            "modal_price_per_quintal":
                market_price,

            "transport_cost_per_quintal":
                transport_cost,

            "loading_cost_per_quintal":
                loading_cost,

            "unloading_cost_per_quintal":
                unloading_cost,

            "total_cost_per_quintal":
                total_cost_per_quintal,

            "net_price_per_quintal":
                net_price_per_quintal,

            "quantity_quintals":
                quantity,

            "gross_revenue":
                total_gross,

            "total_logistics_cost":
                total_cost,

            "net_realisation":
                total_net,

            "distance_km":
                distance_km,

            "transport_type":
                transport_type,

            "estimated_time_hours":
                estimated_time_hours,

            "logistics_available":
                logistics_available,

            "price_source":
                price.source,

            "price_date":
                price.price_date
        })

    # ---------------------------------------------------------
    # 9. SORT BY HIGHEST NET REALISATION
    # ---------------------------------------------------------

    results.sort(
        key=lambda x: x["net_realisation"],
        reverse=True
    )

    # ---------------------------------------------------------
    # 10. RECOMMENDED MARKET
    # ---------------------------------------------------------

    recommendation = (
        results[0]["market"]
        if results
        else None
    )

    return {

        "commodity": commodity,

        "origin": origin,

        "quantity_quintals": quantity,

        "recommendation": recommendation,

        "markets": results
    }