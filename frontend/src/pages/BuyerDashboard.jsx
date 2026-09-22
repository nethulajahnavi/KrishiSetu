import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowUpRight,
  ClipboardList,
  Handshake,
  IndianRupee,
  MapPin,
  PackageSearch,
  ShoppingBasket,
  Truck,
  WalletCards,
} from "lucide-react";

import "./BuyerDashboard.css";

function BuyerDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Unable to load buyer:", error);
    }
  }, []);

  const userName =
    user?.name ||
    user?.full_name ||
    user?.username ||
    "Buyer";

  const today = new Date().toLocaleDateString(
    "en-IN",
    {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }
  );

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";

    return "Good evening";
  };

  return (
    <div className="buyer-dashboard">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <section className="buyer-dashboard-heading">

        <div>
          <span className="buyer-eyebrow">
            {today}
          </span>

          <div className="buyer-title-row">
            <div className="buyer-title-icon">
              <ShoppingBasket
                size={19}
                strokeWidth={2.2}
              />
            </div>

            <div>
              <h1>
                {getGreeting()}, {userName}
              </h1>

              <p>
                Find the right produce, source and
                landed cost for your next procurement.
              </p>
            </div>
          </div>
        </div>

        <div className="buyer-location">
          <MapPin size={15} />

          <div>
            <span>Current area</span>
            <strong>Telangana</strong>
          </div>
        </div>

      </section>


      {/* =====================================================
          PROCUREMENT DECISION CENTER
      ===================================================== */}

      <section className="buyer-decision-card">

        <div className="buyer-decision-top">

          <div>
            <span className="buyer-section-kicker">
              PROCUREMENT CENTER
            </span>

            <h2>
              What do you need to procure?
            </h2>

            <p>
              Start with your requirement, then
              compare available produce, price and
              logistics before placing an offer.
            </p>
          </div>

          <div className="buyer-live-status">
            <span />
            Demo marketplace
          </div>

        </div>


        <div className="buyer-flow">

          <div className="buyer-flow-step">
            <div className="buyer-flow-icon orange">
              <ClipboardList size={19} />
            </div>

            <div>
              <span>Requirement</span>
              <strong>Set what you need</strong>
            </div>
          </div>

          <div className="buyer-flow-line" />

          <div className="buyer-flow-step">
            <div className="buyer-flow-icon blue">
              <PackageSearch size={19} />
            </div>

            <div>
              <span>Available produce</span>
              <strong>Browse matching lots</strong>
            </div>
          </div>

          <div className="buyer-flow-line" />

          <div className="buyer-flow-step">
            <div className="buyer-flow-icon green">
              <IndianRupee size={19} />
            </div>

            <div>
              <span>Price</span>
              <strong>Compare offers</strong>
            </div>
          </div>

          <div className="buyer-flow-line" />

          <div className="buyer-flow-step">
            <div className="buyer-flow-icon purple">
              <Truck size={19} />
            </div>

            <div>
              <span>Logistics</span>
              <strong>Check landed cost</strong>
            </div>
          </div>

        </div>


        <div className="buyer-decision-footer">

          <div>
            <span>PROCUREMENT PRINCIPLE</span>

            <strong>
              Price is only one part of the decision.
            </strong>

            <p>
              Consider source, quantity, quality,
              distance and transport before buying.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate("/dashboard/marketplace")
            }
          >
            Open Marketplace

            <ArrowUpRight size={16} />
          </button>

        </div>

      </section>


      {/* =====================================================
          PROCUREMENT SNAPSHOT
      ===================================================== */}

      <section className="buyer-stat-grid">

        <div className="buyer-stat-card">

          <div className="buyer-stat-icon orange">
            <PackageSearch size={19} />
          </div>

          <div>
            <span>AVAILABLE PRODUCE</span>
            <strong>Browse marketplace</strong>
            <p>View matching produce lots</p>
          </div>

        </div>


        <div className="buyer-stat-card">

          <div className="buyer-stat-icon green">
            <Handshake size={19} />
          </div>

          <div>
            <span>OFFERS</span>
            <strong>Manage offers</strong>
            <p>Review procurement negotiations</p>
          </div>

        </div>


        <div className="buyer-stat-card">

          <div className="buyer-stat-icon blue">
            <WalletCards size={19} />
          </div>

          <div>
            <span>TRANSACTIONS</span>
            <strong>Track purchases</strong>
            <p>Monitor active transactions</p>
          </div>

        </div>

      </section>


      {/* =====================================================
          QUICK ACTIONS
      ===================================================== */}

      <section className="buyer-card buyer-actions">

        <div className="buyer-card-heading">

          <div>
            <span>WORKSPACE</span>

            <h3>
              Procurement Actions
            </h3>

            <p>
              Go directly to the task you need.
            </p>
          </div>

        </div>


        <div className="buyer-action-grid">

          <button
            type="button"
            onClick={() =>
              navigate("/dashboard/marketplace")
            }
          >
            <PackageSearch size={19} />

            <span>
              Browse Marketplace
            </span>

            <ArrowUpRight size={14} />
          </button>


          <button
            type="button"
            onClick={() =>
              navigate("/dashboard/requirements")
            }
          >
            <ClipboardList size={19} />

            <span>
              Set Requirements
            </span>

            <ArrowUpRight size={14} />
          </button>


          <button
            type="button"
            onClick={() =>
              navigate("/dashboard/offers")
            }
          >
            <Handshake size={19} />

            <span>
              Review Offers
            </span>

            <ArrowUpRight size={14} />
          </button>


          <button
            type="button"
            onClick={() =>
              navigate("/dashboard/transactions")
            }
          >
            <WalletCards size={19} />

            <span>
              View Transactions
            </span>

            <ArrowUpRight size={14} />
          </button>

        </div>

      </section>


      {/* =====================================================
          LOGISTICS STRIP
      ===================================================== */}

      <section className="buyer-logistics-strip">

        <div className="buyer-logistics-icon">
          <Truck size={21} />
        </div>

        <div>

          <span>LOGISTICS</span>

          <strong>
            Procurement doesn't end at the market price.
          </strong>

          <p>
            Compare transport and understand the
            landed cost before confirming a purchase.
          </p>

        </div>

        <button
          type="button"
          onClick={() =>
            navigate("/dashboard/logistics")
          }
        >
          Open Logistics
          <ArrowUpRight size={15} />
        </button>

      </section>

    </div>
  );
}

export default BuyerDashboard;