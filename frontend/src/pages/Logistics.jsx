import { useEffect, useMemo, useState } from "react";

import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  MapPin,
  Package,
  Route,
  Truck,
  Wallet,
} from "lucide-react";

import { getLogistics } from "../api/api";

import "./Logistics.css";


function Logistics() {
  const [transportOptions, setTransportOptions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [from, setFrom] = useState("Nashik");
  const [destination, setDestination] =
    useState("Nashik APMC");

  const [quantity, setQuantity] = useState(10);

  const [selectedTransport, setSelectedTransport] =
    useState(null);


  /* ================================
     LOAD LOGISTICS FROM BACKEND
  ================================= */

  useEffect(() => {
    async function loadLogistics() {
      try {
        setLoading(true);
        setError("");

        const data = await getLogistics();

        console.log("Logistics API:", data);

        const formatted = data.map((item) => ({
          id: item.id,

          type:
            item.transport_type ||
            "Transport Vehicle",

          icon: "🚚",

          provider:
            "KrishiSetu Logistics",

          capacity:
            "Available",

          time:
            item.estimated_time_hours !== null &&
            item.estimated_time_hours !== undefined
              ? `${item.estimated_time_hours} hrs`
              : "Time unavailable",

          price:
            Number(item.cost_per_quintal || 0) +
            Number(
              item.loading_cost_per_quintal || 0
            ) +
            Number(
              item.unloading_cost_per_quintal || 0
            ),

          rating: 4.5,

          recommended: false,

          origin: item.origin,

          destination: item.destination,

          distance:
            Number(item.distance_km || 0),

          raw: item,
        }));

        setTransportOptions(formatted);

        if (formatted.length > 0) {
          setSelectedTransport(
            formatted[0].id
          );
        }

      } catch (err) {
        console.error(
          "Logistics API Error:",
          err
        );

        setError(
          err.message ||
          "Failed to load logistics data"
        );

      } finally {
        setLoading(false);
      }
    }

    loadLogistics();
  }, []);


  /* ================================
     SELECTED TRANSPORT
  ================================= */

  const selectedOption =
    transportOptions.find(
      (item) =>
        item.id === selectedTransport
    );


  /* ================================
     TOTAL COST
  ================================= */

  const totalCost = useMemo(() => {
    if (!selectedOption) {
      return 0;
    }

    return selectedOption.price;
  }, [selectedOption]);


  const costPerQuintal =
    quantity > 0
      ? totalCost / quantity
      : 0;


  /* ================================
     RENDER
  ================================= */

  return (
    <div className="logistics-page">

      {/* ============================
          HEADER
      ============================= */}

      <div className="logistics-header">

        <div>

          <span className="page-eyebrow">
            SMART LOGISTICS
          </span>

          <h1>
            Logistics
          </h1>

          <p>
            Find affordable transportation and
            plan the best route for your produce.
          </p>

        </div>


        <div className="logistics-status">

          <span className="status-dot" />

          {loading
            ? "Loading transport services..."
            : "Transport services available"}

        </div>

      </div>


      {/* ============================
          API STATUS
      ============================= */}

      {loading && (
        <div
          style={{
            padding: "12px 16px",
            marginBottom: "16px",
            borderRadius: "10px",
            background: "#f3f7f3",
          }}
        >
          Loading transport options...
        </div>
      )}


      {error && (
        <div
          style={{
            padding: "12px 16px",
            marginBottom: "16px",
            borderRadius: "10px",
            color: "#b42318",
            background: "#fef3f2",
          }}
        >
          API Error: {error}
        </div>
      )}


      {/* ============================
          ROUTE CARD
      ============================= */}

      <section className="route-card">

        <div className="route-heading">

          <div>

            <h2>
              Plan Your Journey
            </h2>

            <p>
              Enter where your produce is coming
              from and where you want to sell.
            </p>

          </div>


          <div className="route-icon">
            <Route size={19} />
          </div>

        </div>


        <div className="route-inputs">

          {/* FROM */}

          <div className="location-field">

            <label>
              FROM
            </label>

            <div className="location-input">

              <MapPin size={17} />

              <input
                value={from}
                onChange={(e) =>
                  setFrom(e.target.value)
                }
                placeholder="Enter origin"
              />

            </div>

          </div>


          {/* ARROW */}

          <div className="route-arrow">
            <ArrowRight size={19} />
          </div>


          {/* DESTINATION */}

          <div className="location-field">

            <label>
              DESTINATION MARKET
            </label>

            <div className="location-input">

              <MapPin size={17} />

              <input
                value={destination}
                onChange={(e) =>
                  setDestination(
                    e.target.value
                  )
                }
                placeholder="Enter destination"
              />

            </div>

          </div>


          {/* QUANTITY */}

          <div className="quantity-field">

            <label>
              PRODUCE
            </label>

            <div className="quantity-input">

              <Package size={17} />

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
                quintal
              </span>

            </div>

          </div>

        </div>

      </section>


      {/* ============================
          SUMMARY
      ============================= */}

      <div className="logistics-summary">

        {/* ROUTE */}

        <div className="logistics-summary-card">

          <div className="logistics-summary-icon">
            <MapPin size={18} />
          </div>

          <div>

            <span>
              Route
            </span>

            <strong>
              {from} → {destination}
            </strong>

          </div>

        </div>


        {/* PRODUCE */}

        <div className="logistics-summary-card">

          <div className="logistics-summary-icon">
            <Package size={18} />
          </div>

          <div>

            <span>
              Produce
            </span>

            <strong>
              {quantity || 0} quintal
            </strong>

          </div>

        </div>


        {/* COST */}

        <div className="logistics-summary-card">

          <div className="logistics-summary-icon">
            <Wallet size={18} />
          </div>

          <div>

            <span>
              Estimated Cost
            </span>

            <strong>
              ₹
              {totalCost.toLocaleString(
                "en-IN",
                {
                  maximumFractionDigits: 2,
                }
              )}
            </strong>

          </div>

        </div>

      </div>


      {/* ============================
          TRANSPORT OPTIONS
      ============================= */}

      <section className="transport-section">

        <div className="section-heading">

          <div>

            <h2>
              Available Transport
            </h2>

            <p>
              Compare available transportation
              options for your journey.
            </p>

          </div>


          <span className="option-count">

            {transportOptions.length}{" "}
            {transportOptions.length === 1
              ? "option"
              : "options"}

          </span>

        </div>


        {/* NO OPTIONS */}

        {!loading &&
          !error &&
          transportOptions.length === 0 && (
            <div
              style={{
                padding: "30px",
                textAlign: "center",
              }}
            >
              <Truck size={32} />

              <p>
                No transport options are
                currently available.
              </p>
            </div>
          )}


        {/* TRANSPORT LIST */}

        <div className="transport-list">

          {transportOptions.map(
            (option) => {

              const isSelected =
                selectedTransport ===
                option.id;

              return (

                <div
                  key={option.id}
                  className={`transport-card ${
                    isSelected
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    setSelectedTransport(
                      option.id
                    )
                  }
                >

                  {/* MAIN */}

                  <div className="transport-main">

                    <div className="vehicle-icon">
                      {option.icon}
                    </div>


                    <div className="transport-name">

                      <div className="transport-title">

                        <strong>
                          {option.type}
                        </strong>


                        {option.recommended && (
                          <span className="recommended-badge">
                            Recommended
                          </span>
                        )}

                      </div>


                      <span>
                        {option.provider}
                      </span>

                    </div>

                  </div>


                  {/* DETAILS */}

                  <div className="transport-detail">

                    <span>
                      <Package size={13} />
                      {option.capacity}
                    </span>


                    <span>
                      <Clock3 size={13} />

                      {option.time}
                    </span>


                    <span>
                      <MapPin size={13} />

                      {option.distance > 0
                        ? `${option.distance} km`
                        : "Distance unavailable"}
                    </span>

                  </div>


                  {/* PRICE */}

                  <div className="transport-price">

                    <strong>
                      ₹
                      {option.price.toLocaleString(
                        "en-IN",
                        {
                          maximumFractionDigits: 2,
                        }
                      )}
                    </strong>

                    <span>
                      per trip
                    </span>

                  </div>


                  {/* SELECTED */}

                  <div className="transport-select">

                    {isSelected ? (
                      <CheckCircle2
                        size={22}
                      />
                    ) : (
                      <div className="select-circle" />
                    )}

                  </div>

                </div>

              );
            }
          )}

        </div>

      </section>


      {/* ============================
          SELECTED TRANSPORT SUMMARY
      ============================= */}

      {selectedOption && (
        <section
          style={{
            marginTop: "24px",
          }}
        >

          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
              padding: "18px 20px",
              borderRadius: "14px",
              background:
                "rgba(46, 125, 50, 0.08)",
            }}
          >

            <div>

              <strong>
                Selected:{" "}
                {selectedOption.type}
              </strong>

              <div
                style={{
                  marginTop: "5px",
                  fontSize: "13px",
                  opacity: 0.7,
                }}
              >
                {from} → {destination}
              </div>

            </div>


            <div
              style={{
                textAlign: "right",
              }}
            >

              <strong>
                ₹
                {totalCost.toLocaleString(
                  "en-IN",
                  {
                    maximumFractionDigits: 2,
                  }
                )}
              </strong>

              <div
                style={{
                  fontSize: "12px",
                  opacity: 0.7,
                }}
              >
                ₹
                {costPerQuintal.toFixed(
                  2
                )}
                / quintal
              </div>

            </div>

          </div>

        </section>
      )}

    </div>
  );
}

export default Logistics;