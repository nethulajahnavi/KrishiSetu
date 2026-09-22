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

function formatCurrency(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;
}

function formatHours(value) {
  if (value === null || value === undefined || value === "") {
    return "Time unavailable";
  }

  const hours = Number(value);

  if (Number.isNaN(hours)) {
    return "Time unavailable";
  }

  if (hours < 1) {
    return `${Math.round(hours * 60)} min`;
  }

  return `${hours} hrs`;
}

function Logistics() {
  const [transportOptions, setTransportOptions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [from, setFrom] = useState("Nashik");
  const [destination, setDestination] = useState("Nashik APMC");
  const [quantity, setQuantity] = useState(10);

  const [selectedTransport, setSelectedTransport] = useState(null);

  useEffect(() => {
    async function loadLogistics() {
      try {
        setLoading(true);
        setError("");

        const data = await getLogistics();

        console.log("Logistics API:", data);

        const rows = Array.isArray(data) ? data : [];

        const formatted = rows.map((item) => {
          const transportCost = Number(
            item.cost_per_quintal ??
              item.transport_cost_per_quintal ??
              0
          );

          const loadingCost = Number(
            item.loading_cost_per_quintal ?? 0
          );

          const unloadingCost = Number(
            item.unloading_cost_per_quintal ?? 0
          );

          const totalCostPerQuintal =
            transportCost +
            loadingCost +
            unloadingCost;

          return {
            id: item.id,

            type:
              item.transport_type ||
              "Transport Vehicle",

            origin:
              item.origin ||
              from,

            destination:
              item.destination ||
              destination,

            distance:
              item.distance_km !== null &&
              item.distance_km !== undefined
                ? Number(item.distance_km)
                : null,

            estimatedTime:
              item.estimated_time_hours !== null &&
              item.estimated_time_hours !== undefined
                ? Number(item.estimated_time_hours)
                : null,

            transportCostPerQuintal: transportCost,

            loadingCostPerQuintal: loadingCost,

            unloadingCostPerQuintal: unloadingCost,

            totalCostPerQuintal,

            raw: item,
          };
        });

        setTransportOptions(formatted);

        if (formatted.length > 0) {
          setSelectedTransport(formatted[0].id);
        } else {
          setSelectedTransport(null);
        }
      } catch (err) {
        console.error("Logistics API Error:", err);

        setError(
          err.message ||
            "Failed to load logistics data"
        );

        setTransportOptions([]);
        setSelectedTransport(null);
      } finally {
        setLoading(false);
      }
    }

    loadLogistics();
  }, []);

  const selectedOption = useMemo(
    () =>
      transportOptions.find(
        (item) =>
          item.id === selectedTransport
      ),
    [transportOptions, selectedTransport]
  );

  const safeQuantity =
    Number(quantity) > 0
      ? Number(quantity)
      : 0;

  const totalCost = useMemo(() => {
    if (!selectedOption || safeQuantity <= 0) {
      return 0;
    }

    return (
      selectedOption.totalCostPerQuintal *
      safeQuantity
    );
  }, [selectedOption, safeQuantity]);

  const costPerQuintal = selectedOption
    ? selectedOption.totalCostPerQuintal
    : 0;

  return (
    <div className="logistics-page">

      {/* HEADER */}

      <header className="logistics-header">

        <div>
          <span className="page-eyebrow">
            SMART LOGISTICS
          </span>

          <h1>Plan the Journey</h1>

          <p>
            Compare transport cost, distance and
            travel time before moving your produce.
          </p>
        </div>

        <div className="logistics-status">
          <span
            className={`status-dot ${
              loading ? "loading" : ""
            }`}
          />

          {loading
            ? "Loading transport data"
            : error
            ? "Transport data unavailable"
            : transportOptions.length > 0
            ? `${transportOptions.length} transport ${
                transportOptions.length === 1
                  ? "option"
                  : "options"
              } available`
            : "No transport options available"}
        </div>

      </header>


      {/* ROUTE PLANNER */}

      <section className="route-card">

        <div className="route-heading">

          <div>
            <div className="section-kicker">
              ROUTE PLANNER
            </div>

            <h2>
              Where is the produce going?
            </h2>

            <p>
              Use your route and quantity to
              understand the transport requirement.
            </p>
          </div>

          <div className="route-icon">
            <Route size={19} />
          </div>

        </div>


        <div className="route-inputs">

          <div className="location-field">

            <label>FROM</label>

            <div className="location-input">

              <MapPin size={16} />

              <input
                value={from}
                onChange={(event) =>
                  setFrom(event.target.value)
                }
                placeholder="Enter origin"
              />

            </div>

          </div>


          <div className="route-arrow">
            <ArrowRight size={19} />
          </div>


          <div className="location-field">

            <label>DESTINATION MARKET</label>

            <div className="location-input">

              <MapPin size={16} />

              <input
                value={destination}
                onChange={(event) =>
                  setDestination(
                    event.target.value
                  )
                }
                placeholder="Enter destination"
              />

            </div>

          </div>


          <div className="quantity-field">

            <label>PRODUCE QUANTITY</label>

            <div className="quantity-input">

              <Package size={16} />

              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(event) =>
                  setQuantity(
                    Number(event.target.value)
                  )
                }
              />

              <span>quintal</span>

            </div>

          </div>

        </div>

      </section>


      {/* QUICK SUMMARY */}

      <section className="logistics-summary">

        <div className="logistics-summary-card">

          <div className="logistics-summary-icon">
            <Route size={17} />
          </div>

          <div className="summary-content">

            <span>ROUTE</span>

            <strong>
              {from || "Origin"}{" "}
              <span className="summary-arrow">
                →
              </span>{" "}
              {destination || "Market"}
            </strong>

          </div>

        </div>


        <div className="logistics-summary-card">

          <div className="logistics-summary-icon">
            <Package size={17} />
          </div>

          <div className="summary-content">

            <span>PRODUCE</span>

            <strong>
              {safeQuantity || 0} quintal
            </strong>

          </div>

        </div>


        <div className="logistics-summary-card highlight">

          <div className="logistics-summary-icon">
            <Wallet size={17} />
          </div>

          <div className="summary-content">

            <span>ESTIMATED TRANSPORT COST</span>

            <strong>
              {selectedOption
                ? formatCurrency(totalCost)
                : "—"}
            </strong>

          </div>

        </div>

      </section>


      {/* ERROR */}

      {error && (
        <div className="logistics-alert error">

          <div className="alert-icon">
            !
          </div>

          <div>
            <strong>
              Transport data could not be loaded
            </strong>

            <p>{error}</p>
          </div>

        </div>
      )}


      {/* TRANSPORT OPTIONS */}

      <section className="transport-section">

        <div className="section-heading">

          <div>
            <div className="section-kicker">
              TRANSPORT OPTIONS
            </div>

            <h2>
              Compare available transport
            </h2>

            <p>
              Select an option to see its estimated
              cost for your produce quantity.
            </p>
          </div>

          <span className="option-count">
            {transportOptions.length}{" "}
            {transportOptions.length === 1
              ? "option"
              : "options"}
          </span>

        </div>


        {loading && (
          <div className="logistics-loading">

            <div className="loading-spinner" />

            <div>
              <strong>
                Loading transport options
              </strong>

              <p>
                Checking available logistics data...
              </p>
            </div>

          </div>
        )}


        {!loading &&
          !error &&
          transportOptions.length === 0 && (
            <div className="transport-empty">

              <div className="empty-icon">
                <Truck size={25} />
              </div>

              <strong>
                No transport options available
              </strong>

              <p>
                There are currently no logistics
                records available for this route.
              </p>

            </div>
          )}


        {!loading &&
          transportOptions.length > 0 && (
            <div className="transport-list">

              {transportOptions.map((option) => {

                const isSelected =
                  selectedTransport ===
                  option.id;

                const estimatedTotal =
                  option.totalCostPerQuintal *
                  safeQuantity;

                return (
                  <button
                    type="button"
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

                    <div className="transport-main">

                      <div className="vehicle-icon">
                        <Truck size={21} />
                      </div>

                      <div className="transport-name">

                        <div className="transport-title">

                          <strong>
                            {option.type}
                          </strong>

                          {isSelected && (
                            <span className="selected-badge">
                              Selected
                            </span>
                          )}

                        </div>

                        <span>
                          {option.origin ||
                            from}{" "}
                          →{" "}
                          {option.destination ||
                            destination}
                        </span>

                      </div>

                    </div>


                    <div className="transport-detail">

                      <span>
                        <Clock3 size={13} />

                        {formatHours(
                          option.estimatedTime
                        )}
                      </span>

                      <span>
                        <MapPin size={13} />

                        {option.distance !== null
                          ? `${option.distance} km`
                          : "Distance unavailable"}
                      </span>

                    </div>


                    <div className="transport-cost">

                      <strong>
                        {formatCurrency(
                          estimatedTotal
                        )}
                      </strong>

                      <span>
                        {formatCurrency(
                          option.totalCostPerQuintal
                        )}
                        / quintal
                      </span>

                    </div>


                    <div className="transport-select">

                      {isSelected ? (
                        <CheckCircle2
                          size={22}
                        />
                      ) : (
                        <span className="select-circle" />
                      )}

                    </div>

                  </button>
                );
              })}

            </div>
          )}

      </section>


      {/* SELECTED TRANSPORT */}

      {selectedOption && (
        <section className="selected-transport-card">

          <div className="selected-transport-left">

            <div className="selected-transport-icon">
              <CheckCircle2 size={19} />
            </div>

            <div>

              <span className="selected-label">
                SELECTED TRANSPORT
              </span>

              <h3>
                {selectedOption.type}
              </h3>

              <p>
                {from || selectedOption.origin}{" "}
                <ArrowRight size={13} />{" "}
                {destination ||
                  selectedOption.destination}
              </p>

            </div>

          </div>


          <div className="selected-transport-metrics">

            <div>
              <span>QUANTITY</span>
              <strong>
                {safeQuantity} qtl
              </strong>
            </div>

            <div>
              <span>COST / QTL</span>
              <strong>
                {formatCurrency(
                  costPerQuintal
                )}
              </strong>
            </div>

            <div>
              <span>TOTAL ESTIMATE</span>
              <strong className="total-cost">
                {formatCurrency(totalCost)}
              </strong>
            </div>

          </div>

        </section>
      )}


      {/* COST BREAKDOWN */}

      {selectedOption && (
        <section className="cost-breakdown-card">

          <div className="cost-breakdown-heading">

            <div>
              <div className="section-kicker">
                COST BREAKDOWN
              </div>

              <h2>
                What makes up the transport cost?
              </h2>
            </div>

            <Wallet size={18} />
          </div>


          <div className="cost-breakdown-grid">

            <div>
              <span>Transport</span>
              <strong>
                {formatCurrency(
                  selectedOption.transportCostPerQuintal
                )}
                <small>/ qtl</small>
              </strong>
            </div>

            <div>
              <span>Loading</span>
              <strong>
                {formatCurrency(
                  selectedOption.loadingCostPerQuintal
                )}
                <small>/ qtl</small>
              </strong>
            </div>

            <div>
              <span>Unloading</span>
              <strong>
                {formatCurrency(
                  selectedOption.unloadingCostPerQuintal
                )}
                <small>/ qtl</small>
              </strong>
            </div>

            <div className="breakdown-total">
              <span>Total / quintal</span>
              <strong>
                {formatCurrency(
                  selectedOption.totalCostPerQuintal
                )}
              </strong>
            </div>

          </div>

          <p className="cost-note">
            Estimated total = total transport cost
            per quintal × {safeQuantity || 0} quintal.
          </p>

        </section>
      )}

    </div>
  );
}

export default Logistics;