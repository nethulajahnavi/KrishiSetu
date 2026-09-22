
import { useEffect, useMemo, useState } from "react";
import { getNetRealisation } from "../api/api";

import {
  ArrowDown,
  ArrowUp,
  Calculator,
  IndianRupee,
  MapPin,
  Package,
  Sparkles,
  Truck,
} from "lucide-react";

import "./NetRealisation.css";

function NetRealisation() {
  /* =====================================================
     INPUTS
  ===================================================== */

  const [crop, setCrop] = useState("Onion");

  const [origin, setOrigin] = useState("Nashik");

  // Backend expects quantity in quintals.
  const [quantity, setQuantity] = useState(10);

  /* =====================================================
     API STATE
  ===================================================== */

  const [apiData, setApiData] = useState(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  /* =====================================================
     SELECTED MARKET
     
     IMPORTANT:
     We use the array index instead of market name because
     the backend can return duplicate market names.
  ===================================================== */

  const [selectedMarket, setSelectedMarket] = useState(0);

  /* =====================================================
     LOAD NET REALISATION
  ===================================================== */

  useEffect(() => {
    async function loadNetRealisation() {
      try {
        setLoading(true);
        setError("");

        const data = await getNetRealisation(
          crop,
          origin,
          quantity
        );

        console.log("NET REALISATION ACTUAL RESPONSE:");
        console.log(JSON.stringify(data, null, 2));

        console.log("Net Realisation API:", data);

        setApiData(data);

        if (
          data?.markets &&
          data.markets.length > 0
        ) {
          setSelectedMarket(0);
        }
      } catch (err) {
        console.error(
          "Net Realisation API Error:",
          err
        );

        setError(
          err.message ||
            "Failed to calculate net realisation"
        );
      } finally {
        setLoading(false);
      }
    }

    if (Number(quantity) > 0) {
      loadNetRealisation();
    }
  }, [crop, origin, quantity]);

  /* =====================================================
     MARKETS FROM BACKEND
  ===================================================== */

  const markets = apiData?.markets || [];

  /* =====================================================
     SELECTED MARKET DATA
  ===================================================== */

  const market = useMemo(() => {
    return (
      markets[selectedMarket] ||
      markets[0] ||
      null
    );
  }, [markets, selectedMarket]);

  /* =====================================================
     CALCULATIONS
  ===================================================== */

  const calculations = useMemo(() => {
    if (!market) {
      return {
        gross: 0,
        totalCosts: 0,
        net: 0,
        costPerKg: 0,
        quantityQuintals: Number(quantity) || 0,
        quantityKg:
          (Number(quantity) || 0) * 100,
      };
    }

    /*
      Backend quantity is already in quintals.

      1 quintal = 100 kg.
    */

    const quantityQuintals =
      Number(quantity) || 0;

    const quantityKg =
      quantityQuintals * 100;

    const gross =
      Number(
        market.gross_revenue || 0
      );

    const totalCosts =
      Number(
        market.total_logistics_cost || 0
      );

    const net =
      Number(
        market.net_realisation || 0
      );

    const costPerKg =
      quantityKg > 0
        ? totalCosts / quantityKg
        : 0;

    return {
      gross,
      totalCosts,
      net,
      costPerKg,
      quantityQuintals,
      quantityKg,
    };
  }, [market, quantity]);

  /* =====================================================
     BEST MARKET
  ===================================================== */

  const bestMarket = useMemo(() => {
    if (!markets.length) {
      return null;
    }

    return [...markets].sort(
      (a, b) =>
        Number(b.net_realisation || 0) -
        Number(a.net_realisation || 0)
    )[0];
  }, [markets]);

  /* =====================================================
     LOADING STATE
  ===================================================== */

  if (loading && !apiData) {
    return (
      <div className="net-page">
        <div className="net-header">
          <div>
            <span className="page-eyebrow">
              FARMER PROFIT INTELLIGENCE
            </span>

            <h1>
              Net Realisation
            </h1>

            <p>
              See how much money you actually receive
              after selling and transportation costs.
            </p>
          </div>

          <div className="calculator-badge">
            <Calculator size={15} />
            Smart Calculator
          </div>
        </div>

        <section className="calculator-card">
          <div className="calculator-heading">
            <div className="calculator-icon">
              <Calculator size={19} />
            </div>

            <div>
              <h2>
                Calculating...
              </h2>

              <p>
                Getting current market and logistics
                data from KrishiSetu.
              </p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="net-page">
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="net-header">
        <div>
          <span className="page-eyebrow">
            FARMER PROFIT INTELLIGENCE
          </span>

          <h1>
            Net Realisation
          </h1>

          <p>
            See how much money you actually receive
            after selling and transportation costs.
          </p>
        </div>

        <div className="calculator-badge">
          <Calculator size={15} />
          Smart Calculator
        </div>
      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div
          style={{
            padding: "12px 16px",
            marginBottom: "20px",
            borderRadius: "10px",
            background: "#fff1f0",
            color: "#c62828",
            border: "1px solid #ffcdd2",
          }}
        >
          API Error: {error}
        </div>
      )}

      {/* =================================================
          CALCULATOR
      ================================================= */}

      <section className="calculator-card">
        <div className="calculator-heading">
          <div className="calculator-icon">
            <Calculator size={19} />
          </div>

          <div>
            <h2>
              Calculate Your Net Realisation
            </h2>

            <p>
              Enter your crop quantity and select
              your origin.
            </p>
          </div>
        </div>

        <div className="calculator-inputs">
          {/* CROP */}

          <div className="input-group">
            <label>
              Crop
            </label>

            <select
              value={crop}
              onChange={(e) =>
                setCrop(e.target.value)
              }
            >
              <option>
                Onion
              </option>

              <option>
                Tomato
              </option>

              <option>
                Green Chilli
              </option>
            </select>
          </div>

          {/* QUANTITY */}

          <div className="input-group">
            <label>
              Quantity
            </label>

            <div className="input-with-unit">
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) =>
                  setQuantity(
                    Number(e.target.value)
                  )
                }
              />

              <span>
                quintals
              </span>
            </div>
          </div>

          {/* ORIGIN */}

          <div className="input-group">
            <label>
              Origin
            </label>

            <input
              value={origin}
              onChange={(e) =>
                setOrigin(e.target.value)
              }
              placeholder="Enter origin"
            />
          </div>

          {/* MARKET */}

          <div className="input-group">
            <label>
              Market
            </label>

            <select
              value={selectedMarket}
              onChange={(e) =>
                setSelectedMarket(
                  Number(e.target.value)
                )
              }
            >
              {markets.map(
                (item, index) => (
                  <option
                    key={`${item.market}-${index}`}
                    value={index}
                  >
                    {item.market} — ₹
                    {Number(
                      item.modal_price_per_quintal ||
                        0
                    ).toLocaleString(
                      "en-IN"
                    )}
                    /q
                  </option>
                )
              )}
            </select>
          </div>
        </div>

        {/* RESULT */}

        <div className="net-result">
          <div className="result-label">
            Estimated Net Realisation
          </div>

          <div className="result-value">
            ₹
            {calculations.net.toLocaleString(
              "en-IN",
              {
                maximumFractionDigits: 0,
              }
            )}
          </div>

          <div className="result-per-kg">
            ₹
            {calculations.quantityKg > 0
              ? (
                  calculations.net /
                  calculations.quantityKg
                ).toFixed(2)
              : "0.00"}
            /kg after costs
          </div>
        </div>
      </section>

      {/* =================================================
          BREAKDOWN
      ================================================= */}

      <section className="breakdown-section">
        <div className="section-heading">
          <div>
            <h2>
              Money Breakdown
            </h2>

            <p>
              Understand where your selling value
              goes.
            </p>
          </div>
        </div>

        <div className="breakdown-grid">
          {/* GROSS */}

          <div className="money-card gross">
            <div className="money-card-top">
              <div className="money-icon">
                <ArrowUp size={16} />
              </div>

              <span>
                Gross Revenue
              </span>
            </div>

            <strong>
              ₹
              {calculations.gross.toLocaleString(
                "en-IN"
              )}
            </strong>

            <p>
              {calculations.quantityQuintals.toLocaleString(
                "en-IN"
              )}{" "}
              quintals × ₹
              {market
                ? Number(
                    market.modal_price_per_quintal ||
                      0
                  ).toLocaleString(
                    "en-IN"
                  )
                : "0"}
              /quintal
            </p>
          </div>

          {/* COST */}

          <div className="money-card cost">
            <div className="money-card-top">
              <div className="money-icon">
                <ArrowDown size={16} />
              </div>

              <span>
                Total Costs
              </span>
            </div>

            <strong>
              ₹
              {calculations.totalCosts.toLocaleString(
                "en-IN"
              )}
            </strong>

            <p>
              Transport + handling
            </p>
          </div>

          {/* NET */}

          <div className="money-card net">
            <div className="money-card-top">
              <div className="money-icon">
                <IndianRupee size={16} />
              </div>

              <span>
                Net Realisation
              </span>
            </div>

            <strong>
              ₹
              {calculations.net.toLocaleString(
                "en-IN"
              )}
            </strong>

            <p>
              Actual estimated earnings
            </p>
          </div>
        </div>
      </section>

      {/* =================================================
          COST BREAKDOWN
      ================================================= */}

      <section className="cost-section">
        <div className="section-heading">
          <div>
            <h2>
              Cost Breakdown
            </h2>

            <p>
              Actual logistics information returned
              by the backend.
            </p>
          </div>
        </div>

        <div className="cost-content">
          {/* TRANSPORTATION */}

          <div className="cost-row">
            <div className="cost-name">
              <div className="cost-small-icon">
                <Truck size={14} />
              </div>

              <div>
                <strong>
                  Transportation
                </strong>

                <span>
                  {market?.distance_km
                    ? `${market.distance_km} km distance`
                    : "Distance unavailable"}
                </span>
              </div>
            </div>

            <strong>
              ₹
              {Number(
                market?.transport_cost_per_quintal ||
                  0
              ).toLocaleString(
                "en-IN"
              )}
              /quintal
            </strong>
          </div>

          {/* LOADING */}

          <div className="cost-row">
            <div className="cost-name">
              <div className="cost-small-icon">
                <Package size={14} />
              </div>

              <div>
                <strong>
                  Loading
                </strong>

                <span>
                  Loading cost
                </span>
              </div>
            </div>

            <strong>
              ₹
              {Number(
                market?.loading_cost_per_quintal ||
                  0
              ).toLocaleString(
                "en-IN"
              )}
              /quintal
            </strong>
          </div>

          {/* UNLOADING */}

          <div className="cost-row">
            <div className="cost-name">
              <div className="cost-small-icon">
                <Package size={14} />
              </div>

              <div>
                <strong>
                  Unloading
                </strong>

                <span>
                  Unloading cost
                </span>
              </div>
            </div>

            <strong>
              ₹
              {Number(
                market?.unloading_cost_per_quintal ||
                  0
              ).toLocaleString(
                "en-IN"
              )}
              /quintal
            </strong>
          </div>

          {/* TOTAL */}

          <div className="cost-total">
            <span>
              Total estimated logistics cost
            </span>

            <strong>
              ₹
              {calculations.totalCosts.toLocaleString(
                "en-IN"
              )}
            </strong>
          </div>
        </div>
      </section>

      {/* =================================================
          MARKET COMPARISON
      ================================================= */}

      <section className="comparison-section">
        <div className="section-heading">
          <div>
            <h2>
              Best Market After Costs
            </h2>

            <p>
              Compare what you actually keep,
              not just the displayed market price.
            </p>
          </div>

          <Sparkles size={17} />
        </div>

        <div className="market-list">
          {markets.map(
            (item, index) => {
              const net =
                Number(
                  item.net_realisation || 0
                );

              const isSelected =
                index === selectedMarket;

              const isBest =
                bestMarket &&
                item === bestMarket;

              return (
                <div
                  key={`${item.market}-${index}`}
                  className={
                    isSelected
                      ? "market-row selected"
                      : "market-row"
                  }
                  onClick={() =>
                    setSelectedMarket(index)
                  }
                >
                  <div className="market-rank">
                    {isBest
                      ? "★"
                      : ""}
                  </div>

                  <div className="market-details">
                    <strong>
                      {item.market}
                    </strong>

                    <span>
                      <MapPin size={10} />

                      {item.distance_km
                        ? `${item.distance_km} km`
                        : "Distance unavailable"}
                    </span>
                  </div>

                  <div className="market-price">
                    <span>
                      Market price
                    </span>

                    <strong>
                      ₹
                      {Number(
                        item.modal_price_per_quintal ||
                          0
                      ).toLocaleString(
                        "en-IN"
                      )}
                      /quintal
                    </strong>
                  </div>

                  <div className="market-cost">
                    <span>
                      Total costs
                    </span>

                    <strong>
                      ₹
                      {Number(
                        item.total_logistics_cost ||
                          0
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </strong>
                  </div>

                  <div className="market-net">
                    <span>
                      Net realisation
                    </span>

                    <strong>
                      ₹
                      {net.toLocaleString(
                        "en-IN"
                      )}
                    </strong>
                  </div>

                  {isBest && (
                    <span className="best-badge">
                      BEST
                    </span>
                  )}
                </div>
              );
            }
          )}
        </div>
      </section>

      {/* =================================================
          RECOMMENDATION
      ================================================= */}

      {bestMarket && (
        <section className="net-recommendation">
          <div className="recommendation-icon">
            <Sparkles size={19} />
          </div>

          <div>
            <span>
              KRISHISETU RECOMMENDS
            </span>

            <h3>
              Consider selling at{" "}
              {bestMarket.market}
            </h3>

            <p>
              Based on current market prices
              and available logistics information,
              this market provides the highest
              estimated net realisation.
            </p>
          </div>
        </section>
      )}
    </div>
  );
}

export default NetRealisation;
 
