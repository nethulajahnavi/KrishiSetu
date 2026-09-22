import { useEffect, useMemo, useState } from "react";
import { getMarketPrices, getPriceHistory } from "../api/api";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  MapPin,
  Search,
  ShoppingBasket,
  TrendingUp,
} from "lucide-react";

import "./MarketPrices.css";

const marketData = [
  {
    id: 1,
    crop: "Tomato",
    emoji: "🍅",
    market: "Bowenpally Market",
    location: "Hyderabad",
    price: 28.5,
    change: 8.4,
    arrivals: "124 MT",
    distance: "18 km",
  },
  {
    id: 2,
    crop: "Tomato",
    emoji: "🍅",
    market: "Gaddiannaram Market",
    location: "Hyderabad",
    price: 26.8,
    change: 4.2,
    arrivals: "96 MT",
    distance: "22 km",
  },
  {
    id: 3,
    crop: "Tomato",
    emoji: "🍅",
    market: "Mehdipatnam Market",
    location: "Hyderabad",
    price: 24.6,
    change: -2.1,
    arrivals: "87 MT",
    distance: "25 km",
  },
  {
    id: 4,
    crop: "Onion",
    emoji: "🧅",
    market: "Malakpet Market",
    location: "Hyderabad",
    price: 31.2,
    change: 4.2,
    arrivals: "210 MT",
    distance: "15 km",
  },
  {
    id: 5,
    crop: "Onion",
    emoji: "🧅",
    market: "Bowenpally Market",
    location: "Hyderabad",
    price: 29.7,
    change: 2.8,
    arrivals: "176 MT",
    distance: "18 km",
  },
  {
    id: 6,
    crop: "Green Chilli",
    emoji: "🌶️",
    market: "Gaddiannaram Market",
    location: "Hyderabad",
    price: 46.0,
    change: 6.7,
    arrivals: "72 MT",
    distance: "22 km",
  },
  {
    id: 7,
    crop: "Green Chilli",
    emoji: "🌶️",
    market: "Bowenpally Market",
    location: "Hyderabad",
    price: 43.5,
    change: 3.1,
    arrivals: "64 MT",
    distance: "18 km",
  },
];

const crops = [
  "All Crops",
  "Tomato",
  "Onion",
  "Green Chilli",
];

function MarketPrices() {
  const [marketPrices, setMarketPrices] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

const [priceHistory, setPriceHistory] = useState([]);
const [historyLoading, setHistoryLoading] = useState(true);
const [historyError, setHistoryError] = useState("");
  const liveMarketData = marketPrices.map((item, index) => {
  const modalPrice = Number(item.modal_price || 0);
  const arrivalQuintal = Number(item.arrival_quantity || 0);

  return {
    id: item.id ?? index,

    crop: item.commodity || "Unknown",

    emoji:
      item.commodity === "Onion"
        ? "🧅"
        : item.commodity === "Tomato"
        ? "🍅"
        : item.commodity === "Green Chilli"
        ? "🌶️"
        : "🌾",

    market: item.market_name || "Unknown Market",

    location:
      item.district && item.state
        ? `${item.district}, ${item.state}`
        : item.district || item.state || "Unknown",

    // PostgreSQL gives ₹/quintal.
    // UI displays ₹/kg.
    price: modalPrice / 100,

    // Convert quintal → metric tonnes
    arrivals: `${(arrivalQuintal / 10).toFixed(0)} MT`,

    distance: "—",

    change: 0,

    minPrice: Number(item.min_price || 0) / 100,

    maxPrice: Number(item.max_price || 0) / 100,

    priceDate: item.price_date,

    variety: item.variety,
  };
});
useEffect(() => {
  async function loadMarketPrices() {
    try {
      setLoading(true);
      setError("");

      const data = await getMarketPrices();

      console.log(
        "Market Prices API:",
        JSON.stringify(data, null, 2)
      );

      setMarketPrices(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Market prices error:", err);
      setError(err.message);
      setMarketPrices([]);
    } finally {
      setLoading(false);
    }
  }

  loadMarketPrices();
}, []);
  useEffect(() => {
  async function loadPriceHistory() {
    try {
      setHistoryLoading(true);
      setHistoryError("");

      const data = await getPriceHistory({ limit: 20 });

      console.log(
        "Price History API:",
        JSON.stringify(data, null, 2)
      );

      setPriceHistory(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Price history error:", err);
      setHistoryError(err.message);
    } finally {
      setHistoryLoading(false);
    }
  }

  loadPriceHistory();
}, []);
  const [selectedCrop, setSelectedCrop] = useState("Onion");
  const [search, setSearch] = useState("");
  

  const filteredMarkets = useMemo(() => {
    return liveMarketData.filter((item) => {
      const matchesCrop =
        selectedCrop === "All Crops" ||
        item.crop === selectedCrop;

      const matchesSearch =
        item.market
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        item.crop
          .toLowerCase()
          .includes(search.toLowerCase());

      return matchesCrop && matchesSearch;
    });
  }, [liveMarketData,selectedCrop, search]);

  const bestMarket = filteredMarkets.length
    ? [...filteredMarkets].sort(
        (a, b) => b.price - a.price
      )[0]
    : null;

  const averagePrice = filteredMarkets.length
    ? (
        filteredMarkets.reduce(
          (sum, item) => sum + item.price,
          0
        ) / filteredMarkets.length
      ).toFixed(2)
    : "0.00";

  const highestPrice = filteredMarkets.length
    ? Math.max(...filteredMarkets.map((item) => item.price))
    : 0;

  const lowestPrice = filteredMarkets.length
    ? Math.min(...filteredMarkets.map((item) => item.price))
    : 0;
    const trendData = [...priceHistory]
  .filter((item) => item?.price_date && item?.modal_price)
  .sort(
    (a, b) =>
      new Date(a.price_date) - new Date(b.price_date)
  )
  .map((item) => ({
    date: item.price_date,
    price: Number(item.modal_price) / 100,
    source: item.source,
    status: item.data_status,
  }));

const trendPrices = trendData.map((item) => item.price);

const trendMin =
  trendPrices.length > 0
    ? Math.min(...trendPrices)
    : 0;

const trendMax =
  trendPrices.length > 0
    ? Math.max(...trendPrices)
    : 0;

const trendRange =
  trendMax - trendMin || 1;

const trendPoints = trendData
  .map((item, index) => {
    const x =
      trendData.length === 1
        ? 350
        : (index / (trendData.length - 1)) * 700;

    const y =
      220 -
      ((item.price - trendMin) / trendRange) * 165;

    return {
      ...item,
      x,
      y,
    };
  });

const polylinePoints = trendPoints
  .map((point) => `${point.x},${point.y}`)
  .join(" ");

const trendYAxis = [
  trendMax + 1,
  trendMax + 0.5,
  (trendMax + trendMin) / 2,
  trendMin + 0.5,
  trendMin - 1,
];

const formatTrendDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
  });
  return (
    <div className="market-page">
    {loading && (
  <p style={{ padding: "10px" }}>
    Loading market data...
  </p>
)}

{error && (
  <p style={{ padding: "10px", color: "red" }}>
    API Error: {error}
  </p>
)}

{!loading && !error && (
  <p style={{ padding: "10px", color: "green" }}>
    ✓ Connected to Market Prices API
  </p>
)}
      {/* HEADER */}

      <div className="market-page-header">
        <div>
          <span className="page-eyebrow">
            MARKET INTELLIGENCE
          </span>

          <h1>Market Prices</h1>

          <p>
            Compare prices across nearby markets and find
            the best opportunity for your produce.
          </p>
        </div>

        <div className="market-date">
  <span>Data status</span>
  <strong>Latest reported data</strong>
</div>
      </div>


      {/* CONTROLS */}

      <div className="market-controls">

        <div className="crop-selector">
          {crops.map((crop) => (
            <button
              key={crop}
              className={
                selectedCrop === crop
                  ? "selected"
                  : ""
              }
              onClick={() => setSelectedCrop(crop)}
            >
              {crop}
            </button>
          ))}
        </div>

        <div className="market-search">
          <Search size={17} />

          <input
            type="text"
            placeholder="Search market..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>

      </div>


      {/* SUMMARY */}

      <div className="market-summary">

        <div className="market-summary-card">
          <div className="summary-icon green">
            <ShoppingBasket size={19} />
          </div>

          <div>
            <span>Average Price</span>

            <strong>
              ₹{averagePrice}
              <small>/kg</small>
            </strong>
          </div>
        </div>


        <div className="market-summary-card">
          <div className="summary-icon blue">
            <TrendingUp size={19} />
          </div>

          <div>
            <span>Highest Price</span>

            <strong>
              ₹{highestPrice.toFixed(2)}
              <small>/kg</small>
            </strong>
          </div>
        </div>


        <div className="market-summary-card">
          <div className="summary-icon orange">
            <ArrowDown size={19} />
          </div>

          <div>
            <span>Lowest Price</span>

            <strong>
              ₹{lowestPrice.toFixed(2)}
              <small>/kg</small>
            </strong>
          </div>
        </div>


        <div className="market-summary-card">
          <div className="summary-icon purple">
            <MapPin size={19} />
          </div>

          <div>
            <span>Markets Found</span>

            <strong>
              {filteredMarkets.length}
              <small> markets</small>
            </strong>
          </div>
        </div>

      </div>


      {/* RECOMMENDATION */}

      {bestMarket && (
        <section className="market-recommendation">

          <div className="recommendation-icon">
            ⭐
          </div>

          <div className="recommendation-content">

            <span>
              KRISHISETU RECOMMENDS
            </span>

            <h3>
              Consider selling at{" "}
              {bestMarket.market}
            </h3>

            <p>
              It currently offers the highest
displayed price for {bestMarket.crop}{" "}
among the selected markets.
            </p>

          </div>

          <div className="recommendation-price">

            <span>Best price</span>

            <strong>
              ₹{bestMarket.price.toFixed(2)}
              <small>/kg</small>
            </strong>

            <div className="price-neutral">
  Price change unavailable
</div>

          </div>

        </section>
      )}


      {/* MARKET TABLE */}

      <section className="market-table-card">

        <div className="market-table-header">

          <div>
            <h2>Market Comparison</h2>

            <p>
              Current prices across available markets
            </p>
          </div>

          <button className="view-map-button">
            <MapPin size={15} />
            View markets
          </button>

        </div>


        <div className="market-table-wrapper">

          <table>
  <thead>
    <tr>
      <th scope="col">Produce</th>
      <th scope="col">Market</th>
      <th scope="col">Price</th>
      <th scope="col">Change</th>
      <th scope="col">Arrivals</th>
      <th scope="col">Distance</th>
      <th scope="col">Status</th>
    </tr>
  </thead>
            <tbody>
  {filteredMarkets.map((market) => (
    <tr key={market.id}>

      <td>
        <span className="market-crop">
          {market.emoji}
        </span>
      </td>

      <td>
        <div className="market-name">
          <strong>{market.market}</strong>

          <span>
            {market.crop} • {market.location}
          </span>
        </div>
      </td>

      <td>
        <strong>
          ₹{market.price.toFixed(2)}
        </strong>
      </td>

      <td>
        {market.change !== 0 ? (
          <span
            className={
              market.change > 0
                ? "price-up"
                : "price-down"
            }
          >
            {market.change > 0 ? (
              <ArrowUp size={14} />
            ) : (
              <ArrowDown size={14} />
            )}

            {Math.abs(market.change).toFixed(1)}%
          </span>
        ) : (
          <span className="price-neutral">
            —
          </span>
        )}
      </td>

      <td>
        {market.arrivals}
      </td>

      <td>
        {market.distance}
      </td>

      <td>
        {bestMarket?.id === market.id && (
          <span className="best-badge">
            Best
          </span>
        )}
      </td>

    </tr>
  ))}
</tbody>

          </table>


          {filteredMarkets.length === 0 && (
            <div className="no-markets">

              <ShoppingBasket size={28} />

              <strong>
                No markets found
              </strong>

              <span>
                Try another crop or search term.
              </span>

            </div>
          )}

        </div>

      </section>


      {/* PRICE TREND */}

      <section className="price-trend-section">
  <div className="section-header">
    <div>
      <h2>Price Trend</h2>

      <p>
        {historyLoading
          ? "Loading recent price history..."
          : trendData.length > 0
          ? "Recent modal price movement from the price history API"
          : "No price history available"}
      </p>
    </div>

    <div className="trend-status">
      {historyLoading ? (
        <span>Loading...</span>
      ) : historyError ? (
        <span className="trend-error">
          Price history unavailable
        </span>
      ) : (
        <span className="trend-live">
          ● API connected
        </span>
      )}
    </div>
  </div>

  {historyError && (
    <div className="trend-message error">
      Unable to load price history: {historyError}
    </div>
  )}

  {!historyLoading && !historyError && trendData.length > 0 && (
    <>
      <div className="trend-chart">
        <div className="chart-y-axis">
          {trendYAxis.map((value, index) => (
            <span key={index}>
              ₹{value.toFixed(2)}
            </span>
          ))}
        </div>

        <div className="chart-area">
          <div className="chart-grid">
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>

          <svg
            viewBox="0 0 700 260"
            preserveAspectRatio="none"
            className="trend-svg"
          >
            {trendPoints.length > 1 && (
              <polyline
                points={polylinePoints}
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {trendPoints.map((point) => (
              <circle
                key={point.date}
                cx={point.x}
                cy={point.y}
                r="6"
                fill="currentColor"
              />
            ))}
          </svg>

          <div className="chart-x-axis">
            {trendData.map((item) => (
              <span key={item.date}>
                {formatTrendDate(item.date)}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="trend-summary">
        <div>
          <span>Latest modal price</span>
          <strong>
            ₹{trendData[trendData.length - 1].price.toFixed(2)}
            <small>/kg</small>
          </strong>
        </div>

        <div>
          <span>Period change</span>
          <strong
            className={
              trendData[trendData.length - 1].price >=
              trendData[0].price
                ? "trend-positive"
                : "trend-negative"
            }
          >
            {trendData[0].price > 0
              ? `${
                  trendData[trendData.length - 1].price >=
                  trendData[0].price
                    ? "+"
                    : ""
                }${(
                  ((trendData[trendData.length - 1].price -
                    trendData[0].price) /
                    trendData[0].price) *
                  100
                ).toFixed(1)}%`
              : "—"}
          </strong>
        </div>

        <div>
          <span>Data points</span>
          <strong>{trendData.length}</strong>
        </div>
      </div>
    </>
  )}

  {!historyLoading &&
    !historyError &&
    trendData.length === 0 && (
      <div className="trend-message">
        No historical price data is available yet.
      </div>
    )}

  <p className="trend-note">
    Current history is sourced from the Price History API.
    The available records are marked as DEMO DATA and currently
    do not contain crop or market IDs.
  </p>
</section>


      {/* INFORMATION */}

      <div className="market-info">

        <TrendingUp size={16} />

        <span>
          Prices shown are indicative market data.
          Final transaction prices may vary based on
          quality, quantity and negotiation.
        </span>

      </div>

    </div>
  );
}

export default MarketPrices;

