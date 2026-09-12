import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowUpRight,
  IndianRupee,
  MapPin,
  ShoppingBasket,
  Sparkles,
  Truck,
  TrendingUp,
  CloudSun,
} from "lucide-react";

import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to load user:", error);
    }
  }, []);

  const farmerName = user?.name || "Farmer";

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="dashboard-page">

      {/* HEADER */}

      <div className="dashboard-heading">

        <div>
          <p className="dashboard-greeting">
            {today}
          </p>

          <h1>
            {getGreeting()}, {farmerName} 👋
          </h1>

          <p>
            Here's what's happening with your farm today.
          </p>
        </div>

        <button
          className="location-button"
          type="button"
        >
          <MapPin size={16} />
          Telangana
        </button>

      </div>


      {/* STAT CARDS */}

      <div className="dashboard-stats">

        <div className="dashboard-stat-card">

          <div className="stat-top">

            <div className="stat-icon green">
              <IndianRupee size={20} />
            </div>

            <span className="stat-change positive">
              +8.4%
            </span>

          </div>

          <p>Best Market Price</p>

          <h2>₹28.50/kg</h2>

          <span className="stat-description">
            Tomato • Bowenpally
          </span>

        </div>


        <div className="dashboard-stat-card">

          <div className="stat-top">

            <div className="stat-icon blue">
              <TrendingUp size={20} />
            </div>

            <span className="stat-change positive">
              +12%
            </span>

          </div>

          <p>Expected Net Realisation</p>

          <h2>₹18,750</h2>

          <span className="stat-description">
            Based on current market data
          </span>

        </div>


        <div className="dashboard-stat-card">

          <div className="stat-top">

            <div className="stat-icon orange">
              <Truck size={20} />
            </div>

            <span className="stat-change">
              2 options
            </span>

          </div>

          <p>Logistics</p>

          <h2>₹1,850</h2>

          <span className="stat-description">
            Estimated transportation cost
          </span>

        </div>


        <div className="dashboard-stat-card">

          <div className="stat-top">

            <div className="stat-icon purple">
              <CloudSun size={20} />
            </div>

            <span className="stat-change">
              27°C
            </span>

          </div>

          <p>Today's Weather</p>

          <h2>Partly Cloudy</h2>

          <span className="stat-description">
            Good conditions for harvesting
          </span>

        </div>

      </div>


      {/* MAIN GRID */}

      <div className="dashboard-grid">

        {/* MARKET */}

        <section className="dashboard-card market-overview">

          <div className="card-heading">

            <div>
              <h3>Market Overview</h3>
              <p>Today's market prices</p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/dashboard/market-prices")}
            >
              View all
              <ArrowUpRight size={15} />
            </button>

          </div>


          <div className="market-list">

            <div className="market-row">

              <div className="crop-icon">
                🍅
              </div>

              <div className="crop-info">
                <strong>Tomato</strong>
                <span>Bowenpally Market</span>
              </div>

              <div className="crop-price">
                <strong>₹28.50</strong>

                <span className="price-up">
                  ↑ 8.4%
                </span>
              </div>

            </div>


            <div className="market-row">

              <div className="crop-icon">
                🧅
              </div>

              <div className="crop-info">
                <strong>Onion</strong>
                <span>Malakpet Market</span>
              </div>

              <div className="crop-price">
                <strong>₹31.20</strong>

                <span className="price-up">
                  ↑ 4.2%
                </span>
              </div>

            </div>


            <div className="market-row">

              <div className="crop-icon">
                🌶️
              </div>

              <div className="crop-info">
                <strong>Green Chilli</strong>
                <span>Gaddiannaram Market</span>
              </div>

              <div className="crop-price">
                <strong>₹46.00</strong>

                <span className="price-up">
                  ↑ 6.7%
                </span>
              </div>

            </div>

          </div>

        </section>


        {/* AI */}

        <section className="dashboard-card ai-card">

          <div className="ai-icon">
            <Sparkles size={22} />
          </div>

          <span className="ai-label">
            KRISHISETU AI
          </span>

          <h3>
            Need help deciding
            <br />
            where to sell?
          </h3>

          <p>
            Ask me about market prices, profit,
            logistics or your next farming decision.
          </p>

          <button
            className="ai-button"
            type="button"
            onClick={() => navigate("/dashboard/assistant")}
          >
            Ask KrishiSetu AI
            <ArrowUpRight size={16} />
          </button>

        </section>


        {/* QUICK ACTIONS */}

        <section className="dashboard-card quick-actions">

          <div className="card-heading">

            <div>
              <h3>Quick Actions</h3>

              <p>
                What would you like to do?
              </p>
            </div>

          </div>


          <div className="quick-action-grid">

            {/* MARKET PRICES */}

            <button
              type="button"
              onClick={() =>
                navigate("/dashboard/market-prices")
              }
            >
              <ShoppingBasket size={19} />

              <span>
                Check Market Prices
              </span>
            </button>


            {/* NET REALISATION */}

            <button
              type="button"
              onClick={() =>
                navigate("/dashboard/net-realisation")
              }
            >
              <IndianRupee size={19} />

              <span>
                Calculate Realisation
              </span>
            </button>


            {/* LOGISTICS */}

            <button
              type="button"
              onClick={() =>
                navigate("/dashboard/logistics")
              }
            >
              <Truck size={19} />

              <span>
                Find Transport
              </span>
            </button>


            {/* AI ASSISTANT */}

            <button
              type="button"
              onClick={() =>
                navigate("/dashboard/assistant")
              }
            >
              <Sparkles size={19} />

              <span>
                Ask AI Assistant
              </span>
            </button>

          </div>

        </section>

      </div>

    </div>
  );
}

export default Dashboard;