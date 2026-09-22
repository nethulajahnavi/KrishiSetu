import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BuyerDashboard from "./BuyerDashboard";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  CloudSun,
  IndianRupee,
  Leaf,
  MapPin,
  ShoppingBasket,
  Sparkles,
  Truck,
} from "lucide-react";

import "./Dashboard.css";

const ROLE_CONFIG = {
  farmer: {
    label: "Farmer",
    tagline: "Right Market. Right Buyer. Right Price.",
    greeting: "Your selling decision",
    description:
      "Compare market prices, transport costs and expected realisation before you sell.",
  },

  buyer: {
    label: "Buyer",
    tagline: "Right Produce. Right Source. Right Price.",
    greeting: "Your procurement decision",
    description:
      "Review available market information and move from price discovery to procurement.",
  },

  transporter: {
    label: "Transporter",
    tagline: "Right Route. Right Load. Right Time.",
    greeting: "Your next route",
    description:
      "Review logistics activity and keep transport decisions connected to the marketplace.",
  },

  admin: {
    label: "Admin",
    tagline: "Right Data. Right Action. Right Control.",
    greeting: "Platform overview",
    description:
      "Monitor the marketplace and access the operational areas available to you.",
  },
};

function getStoredRole() {
  const role =
    localStorage.getItem("selectedRole") ||
    localStorage.getItem("role") ||
    "farmer";

  return String(role)
    .toLowerCase()
    .replace(/[\s_-]+/g, "");
}

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [role, setRole] = useState(getStoredRole());

  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser =
          localStorage.getItem("user");

        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          setUser(null);
        }

        setRole(getStoredRole());
      } catch (error) {
        console.error(
          "Failed to load user:",
          error
        );
      }
    };

    loadUser();

    window.addEventListener(
      "storage",
      loadUser
    );

    return () => {
      window.removeEventListener(
        "storage",
        loadUser
      );
    };
  }, []);

  const normalizedRole =
    ROLE_CONFIG[role]
      ? role
      : "farmer";

  const roleConfig =
    ROLE_CONFIG[normalizedRole];

  const userName =
    user?.name ||
    user?.full_name ||
    user?.username ||
    "Farmer";

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";

    return "Good evening";
  };

  const today = new Date().toLocaleDateString(
    "en-IN",
    {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }
  );

  const isFarmer =
    normalizedRole === "farmer";
  if (normalizedRole === "buyer") {
  return <BuyerDashboard />;
}
  return (
    <div
      className={`dashboard-page dashboard-role-${normalizedRole}`}
    >

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <section className="dashboard-heading">

        <div className="dashboard-heading-main">

          <div className="dashboard-eyebrow">
            {today}
          </div>

          <div className="dashboard-title-row">

            <div className="dashboard-title-icon">
              <Leaf
                size={18}
                strokeWidth={2.2}
              />
            </div>

            <div>
              <h1>
                {getGreeting()}, {userName}
              </h1>

              <p>
                {roleConfig.description}
              </p>
            </div>

          </div>

        </div>


        <div className="dashboard-location">

          <div className="dashboard-location-icon">
            <MapPin size={15} />
          </div>

          <div>
            <span>Current area</span>
            <strong>Telangana</strong>
          </div>

        </div>

      </section>


      {/* =====================================================
          FARMER DECISION CENTER
      ===================================================== */}

      {isFarmer && (
        <section className="decision-card">

          <div className="decision-card-header">

            <div>

              <span className="section-kicker">
                DECISION CENTER
              </span>

              <h2>
                {roleConfig.greeting}
              </h2>

              <p>
                Start with the market price.
                Then consider distance, transport
                and other costs before deciding
                where to sell.
              </p>

            </div>


            <div className="decision-status">
              <span className="status-dot" />
              <span>Demo data</span>
            </div>

          </div>


          {/* DECISION FLOW */}

          <div className="decision-flow">

            <div className="decision-step">
              <div className="decision-step-icon green">
                <IndianRupee size={18} />
              </div>

              <div>
                <span>Market price</span>
                <strong>₹28.50/kg</strong>
              </div>
            </div>


            <div className="decision-arrow">
              <ArrowRight size={16} />
            </div>


            <div className="decision-step">
              <div className="decision-step-icon blue">
                <MapPin size={18} />
              </div>

              <div>
                <span>Market</span>
                <strong>Bowenpally</strong>
              </div>
            </div>


            <div className="decision-arrow">
              <ArrowRight size={16} />
            </div>


            <div className="decision-step">
              <div className="decision-step-icon yellow">
                <Truck size={18} />
              </div>

              <div>
                <span>Transport</span>
                <strong>₹1,850</strong>
              </div>
            </div>


            <div className="decision-arrow">
              <ArrowRight size={16} />
            </div>


            <div className="decision-step decision-result">

              <div className="decision-step-icon result">
                <TrendingUpIcon />
              </div>

              <div>
                <span>Expected realisation</span>
                <strong>₹18,750</strong>
              </div>

            </div>

          </div>


          {/* DECISION FOOTER */}

          <div className="decision-footer">

            <div className="decision-note">

              <span className="decision-note-label">
                CURRENT VIEW
              </span>

              <strong>
                Tomato · Bowenpally Market
              </strong>

              <span>
                Values shown above are existing
                demo values and are not presented
                as live market data.
              </span>

            </div>


            <button
              type="button"
              className="primary-action"
              onClick={() =>
                navigate(
                  "/dashboard/market-prices"
                )
              }
            >
              Compare Markets

              <ArrowUpRight size={16} />
            </button>

          </div>

        </section>
      )}


      {/* =====================================================
          NON-FARMER ROLE FOCUS
      ===================================================== */}

      {!isFarmer && (
        <section className="role-focus-card">

          <div className="role-focus-icon">
            {normalizedRole === "buyer" && (
              <ShoppingBasket size={22} />
            )}

            {normalizedRole ===
              "transporter" && (
              <Truck size={22} />
            )}

            {normalizedRole === "admin" && (
              <BarChart3 size={22} />
            )}
          </div>

          <div className="role-focus-content">

            <span className="section-kicker">
              {roleConfig.label.toUpperCase()} WORKSPACE
            </span>

            <h2>
              {roleConfig.greeting}
            </h2>

            <p>
              {roleConfig.description}
            </p>

          </div>

        </section>
      )}


      {/* =====================================================
          SUPPORTING INFORMATION
      ===================================================== */}

      <section className="dashboard-support-grid">


        {/* MARKET OVERVIEW */}

        <div className="dashboard-card market-overview">

          <div className="card-heading">

            <div>
              <span className="card-kicker">
                MARKET
              </span>

              <h3>
                Market Overview
              </h3>

              <p>
                Current sample market information
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/dashboard/market-prices"
                )
              }
            >
              View markets

              <ArrowUpRight size={15} />
            </button>

          </div>


          <div className="data-source-label">
            <span className="data-source-dot" />
            Demo data
          </div>


          <div className="market-list">

            <div className="market-row">

              <div className="crop-icon crop-tomato">
                <span />
              </div>

              <div className="crop-info">

                <strong>
                  Tomato
                </strong>

                <span>
                  Bowenpally Market
                </span>

              </div>

              <div className="crop-price">

                <strong>
                  ₹28.50/kg
                </strong>

                <span className="price-up">
                  ↑ 8.4%
                </span>

              </div>

            </div>


            <div className="market-row">

              <div className="crop-icon crop-onion">
                <span />
              </div>

              <div className="crop-info">

                <strong>
                  Onion
                </strong>

                <span>
                  Malakpet Market
                </span>

              </div>

              <div className="crop-price">

                <strong>
                  ₹31.20/kg
                </strong>

                <span className="price-up">
                  ↑ 4.2%
                </span>

              </div>

            </div>


            <div className="market-row">

              <div className="crop-icon crop-chilli">
                <span />
              </div>

              <div className="crop-info">

                <strong>
                  Green Chilli
                </strong>

                <span>
                  Gaddiannaram Market
                </span>

              </div>

              <div className="crop-price">

                <strong>
                  ₹46.00/kg
                </strong>

                <span className="price-up">
                  ↑ 6.7%
                </span>

              </div>

            </div>

          </div>

        </div>


        {/* AI ASSISTANT */}

        <div className="dashboard-card dashboard-assistant-card">

          <div className="assistant-card-top">

            <div className="assistant-icon">
              <Sparkles size={20} />
            </div>

            <span>
              KRISHISETU ASSISTANT
            </span>

          </div>


          <h3>
            Turn market information
            into a decision.
          </h3>


          <p>
            Ask about market prices,
            realisation, logistics or your
            next marketplace decision.
          </p>


          <button
            type="button"
            onClick={() =>
              navigate(
                "/dashboard/assistant"
              )
            }
          >
            Ask KrishiSetu

            <ArrowUpRight size={16} />
          </button>

        </div>

      </section>


      {/* =====================================================
          QUICK ACTIONS
      ===================================================== */}

      <section className="dashboard-card quick-actions">

        <div className="card-heading">

          <div>
            <span className="card-kicker">
              ACTIONS
            </span>

            <h3>
              Quick Actions
            </h3>

            <p>
              Jump directly to what you need.
            </p>
          </div>

        </div>


        <div className="quick-action-grid">

          <button
            type="button"
            onClick={() =>
              navigate(
                "/dashboard/market-prices"
              )
            }
          >
            <ShoppingBasket size={19} />

            <span>
              Check Market Prices
            </span>

            <ArrowUpRight size={14} />
          </button>


          <button
            type="button"
            onClick={() =>
              navigate(
                "/dashboard/net-realisation"
              )
            }
          >
            <IndianRupee size={19} />

            <span>
              Calculate Realisation
            </span>

            <ArrowUpRight size={14} />
          </button>


          <button
            type="button"
            onClick={() =>
              navigate(
                "/dashboard/logistics"
              )
            }
          >
            <Truck size={19} />

            <span>
              Find Transport
            </span>

            <ArrowUpRight size={14} />
          </button>


          <button
            type="button"
            onClick={() =>
              navigate(
                "/dashboard/assistant"
              )
            }
          >
            <Sparkles size={19} />

            <span>
              Ask AI Assistant
            </span>

            <ArrowUpRight size={14} />
          </button>

        </div>

      </section>


      {/* =====================================================
          WEATHER STRIP
      ===================================================== */}

      <section className="dashboard-weather-strip">

        <div className="weather-strip-icon">
          <CloudSun size={20} />
        </div>

        <div className="weather-strip-content">

          <span>
            WEATHER
          </span>

          <strong>
            Weather information
          </strong>

          <p>
            Open Weather for agriculture-focused
            conditions and planning.
          </p>

        </div>

        <button
          type="button"
          onClick={() =>
            navigate(
              "/dashboard/weather"
            )
          }
        >
          Open Weather

          <ArrowUpRight size={15} />
        </button>

      </section>

    </div>
  );
}


/*
  Small local icon component.
  Keeps the dashboard dependency-free.
*/

function TrendingUpIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="3 17 9 11 13 15 21 7" />
      <polyline points="14 7 21 7 21 14" />
    </svg>
  );
}

export default Dashboard;