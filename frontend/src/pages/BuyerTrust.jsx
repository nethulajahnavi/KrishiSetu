import { useEffect, useMemo, useState } from "react";

import {
  BadgeCheck,
  ChevronRight,
  Search,
  ShieldCheck,
  Star,
  TrendingUp,
  Users,
  SlidersHorizontal,
} from "lucide-react";

import { getBuyerMatching } from "../api/api";

import "./BuyerTrust.css";


function BuyerTrust() {

  /* ================================
     SEARCH / MATCHING INPUTS
  ================================= */

  const [commodity, setCommodity] =
    useState("Onion");

  const [quantity, setQuantity] =
    useState("10");

  const [quality, setQuality] =
    useState("Grade A");

  const [district, setDistrict] =
    useState("Nashik");


  /* ================================
     BUYER DATA STATE
  ================================= */

  const [buyers, setBuyers] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [searchTerm, setSearchTerm] =
    useState("");

  const [selectedBuyer, setSelectedBuyer] =
    useState(null);


  /* ================================
     LOAD BUYERS
  ================================= */

  async function loadBuyers(
    searchParams = {
      commodity,
      quantity,
      quality,
      district,
    }
  ) {

    try {

      setLoading(true);
      setError("");

      const data =
        await getBuyerMatching(
          searchParams
        );

      console.log(
        "BUYER MATCHING ACTUAL RESPONSE:"
      );

      console.log(
        JSON.stringify(
          data,
          null,
          2
        )
      );


      /* ================================
         NORMALIZE BACKEND RESPONSE
      ================================= */

      let buyerData = [];


      if (Array.isArray(data)) {

        buyerData = data;

      } else if (
        Array.isArray(data?.buyers)
      ) {

        buyerData = data.buyers;

      } else if (
        Array.isArray(data?.matches)
      ) {

        buyerData = data.matches;

      } else if (
        Array.isArray(data?.results)
      ) {

        buyerData = data.results;

      }


      /* ================================
         FORMAT BUYERS FOR UI
      ================================= */

      const formattedBuyers =
        buyerData.map(
          (item, index) => {

            const name =
              item.name ||
              item.buyer_name ||
              item.company_name ||
              item.company ||
              `Buyer ${index + 1}`;


            const location =
              item.location ||
              item.city ||
              item.district ||
              item.address ||
              "Location unavailable";


            const rating =
              Number(
                item.rating ??
                item.trust_score ??
                item.buyer_rating ??
                0
              );


            const trust =
              Number(
                item.trust_score ??
                item.trust ??
                item.score ??
                rating ??
                0
              );


            const orders =
              Number(
                item.completed_orders ??
                item.orders_completed ??
                item.total_orders ??
                item.orders ??
                0
              );


            const paymentDays =
              item.payment_days ??
              item.payment_time ??
              item.payment_terms ??
              "N/A";


            const crop =
              item.commodity ||
              item.crop ||
              item.produce ||
              searchParams.commodity ||
              "Produce";


            return {

              id:
                item.id ??
                index + 1,

              name,

              location,

              rating,

              trust,

              orders,

              paymentDays,

              crop,

              verified:
                item.verified ??
                item.is_verified ??
                true,

              price:
                Number(
                  item.price ??
                  item.offered_price ??
                  item.modal_price ??
                  0
                ),

              raw: item,

            };

          }
        );


      setBuyers(
        formattedBuyers
      );


      /*
        Automatically select the first
        available buyer.
      */

      if (
        formattedBuyers.length > 0
      ) {

        setSelectedBuyer(
          formattedBuyers[0]
        );

      } else {

        setSelectedBuyer(null);

      }

    } catch (err) {

      console.error(
        "Buyer Matching API Error:",
        err
      );

      setError(
        err.message ||
        "Failed to load buyer data"
      );

      setBuyers([]);

      setSelectedBuyer(null);

    } finally {

      setLoading(false);

    }

  }


  /* ================================
     INITIAL LOAD
  ================================= */

  useEffect(() => {

    loadBuyers({
      commodity: "Onion",
      quantity: "10",
      quality: "Grade A",
      district: "Nashik",
    });

  }, []);


  /* ================================
     FIND BUYERS
  ================================= */

  function handleFindBuyers(event) {

    event.preventDefault();

    const cleanedCommodity =
      commodity.trim();

    const cleanedDistrict =
      district.trim();

    const cleanedQuantity =
      String(quantity).trim();


    /*
      Basic frontend validation.
      Backend validation remains the
      final authority.
    */

    if (!cleanedCommodity) {

      setError(
        "Please enter a commodity."
      );

      return;

    }


    if (
      !cleanedQuantity ||
      Number(cleanedQuantity) <= 0
    ) {

      setError(
        "Please enter a valid quantity."
      );

      return;

    }


    if (!cleanedDistrict) {

      setError(
        "Please enter a district."
      );

      return;

    }


    setSearchTerm("");


    loadBuyers({

      commodity:
        cleanedCommodity,

      quantity:
        cleanedQuantity,

      quality:
        quality.trim(),

      district:
        cleanedDistrict,

    });

  }


  /* ================================
     FILTER BUYERS LOCALLY
  ================================= */

  const filteredBuyers =
    useMemo(() => {

      const search =
        searchTerm
          .toLowerCase()
          .trim();


      if (!search) {

        return buyers;

      }


      return buyers.filter(
        (buyer) => {

          return (

            buyer.name
              .toLowerCase()
              .includes(search)

            ||

            buyer.location
              .toLowerCase()
              .includes(search)

            ||

            buyer.crop
              .toLowerCase()
              .includes(search)

          );

        }
      );

    }, [
      buyers,
      searchTerm,
    ]);


  /* ================================
     BEST TRUSTED BUYER
  ================================= */

  const bestBuyer =
    filteredBuyers.length > 0
      ? [...filteredBuyers].sort(
          (a, b) =>
            b.trust - a.trust
        )[0]
      : null;


  /* ================================
     SUMMARY VALUES
  ================================= */

  const averageRating =
    filteredBuyers.length > 0
      ? (
          filteredBuyers.reduce(
            (sum, buyer) =>
              sum + buyer.rating,
            0
          ) /
          filteredBuyers.length
        ).toFixed(1)
      : "0.0";


  const verifiedCount =
    filteredBuyers.filter(
      (buyer) =>
        buyer.verified
    ).length;


  /* ================================
     RENDER
  ================================= */

  return (

    <div className="buyer-page">


      {/* ============================
          HEADER
      ============================= */}

      <div className="buyer-header">

        <div>

          <span className="page-eyebrow">
            BUYER INTELLIGENCE
          </span>

          <h1>
            Buyer Trust
          </h1>

          <p>
            Find reliable buyers with
            verified profiles, transparent
            payments and strong transaction
            history.
          </p>

        </div>


        <div className="buyer-status">

          <span className="status-dot" />

          {loading
            ? "Finding buyers..."
            : "Buyer network active"}

        </div>

      </div>


      {/* ============================
          MATCHING CONTROLS
      ============================= */}

      <section
        style={{
          marginBottom: "20px",
          padding: "18px",
          background: "var(--ks-surface)",
          border: "1px solid var(--ks-border)",
          borderRadius: "var(--ks-radius-lg)",
          boxShadow: "var(--ks-shadow-sm)",
        }}
      >

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "14px",
          }}
        >

          <div
            style={{
              width: "34px",
              height: "34px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--role-primary)",
              background: "var(--role-soft)",
              borderRadius: "9px",
              flexShrink: 0,
            }}
          >

            <SlidersHorizontal
              size={17}
            />

          </div>


          <div>

            <h2
              style={{
                margin: 0,
                color: "var(--ks-text)",
                fontSize: "15px",
                fontWeight: 750,
              }}
            >
              Find the right buyer
            </h2>

            <p
              style={{
                margin: "3px 0 0",
                color: "var(--ks-text-muted)",
                fontSize: "11px",
              }}
            >
              Match your produce with
              buyers using your requirements.
            </p>

          </div>

        </div>


        <form
          onSubmit={handleFindBuyers}
          style={{
            display: "grid",
            gridTemplateColumns:
              "minmax(150px, 1.4fr) minmax(110px, .8fr) minmax(130px, 1fr) minmax(150px, 1fr) auto",
            gap: "10px",
            alignItems: "end",
          }}
        >


          {/* COMMODITY */}

          <label
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "6px",
            }}
          >

            <span
              style={{
                color: "var(--ks-text-muted)",
                fontSize: "10px",
                fontWeight: 700,
              }}
            >
              Commodity
            </span>

            <input
              type="text"
              value={commodity}
              onChange={(e) =>
                setCommodity(
                  e.target.value
                )
              }
              placeholder="e.g. Onion"
              style={{
                width: "100%",
                height: "40px",
                padding: "0 11px",
                border: "1px solid var(--ks-border)",
                borderRadius: "9px",
                outline: "none",
                background: "var(--ks-surface)",
                fontSize: "12px",
              }}
            />

          </label>


          {/* QUANTITY */}

          <label
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "6px",
            }}
          >

            <span
              style={{
                color: "var(--ks-text-muted)",
                fontSize: "10px",
                fontWeight: 700,
              }}
            >
              Quantity (quintals)
            </span>

            <input
              type="number"
              min="0.1"
              step="0.1"
              value={quantity}
              onChange={(e) =>
                setQuantity(
                  e.target.value
                )
              }
              placeholder="10"
              style={{
                width: "100%",
                height: "40px",
                padding: "0 11px",
                border: "1px solid var(--ks-border)",
                borderRadius: "9px",
                outline: "none",
                background: "var(--ks-surface)",
                fontSize: "12px",
              }}
            />

          </label>


          {/* QUALITY */}

          <label
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "6px",
            }}
          >

            <span
              style={{
                color: "var(--ks-text-muted)",
                fontSize: "10px",
                fontWeight: 700,
              }}
            >
              Quality
            </span>

            <select
              value={quality}
              onChange={(e) =>
                setQuality(
                  e.target.value
                )
              }
              style={{
                width: "100%",
                height: "40px",
                padding: "0 10px",
                border: "1px solid var(--ks-border)",
                borderRadius: "9px",
                outline: "none",
                background: "var(--ks-surface)",
                color: "var(--ks-text)",
                fontSize: "12px",
              }}
            >

              <option value="Grade A">
                Grade A
              </option>

              <option value="Grade B">
                Grade B
              </option>

              <option value="Grade C">
                Grade C
              </option>

            </select>

          </label>


          {/* DISTRICT */}

          <label
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "6px",
            }}
          >

            <span
              style={{
                color: "var(--ks-text-muted)",
                fontSize: "10px",
                fontWeight: 700,
              }}
            >
              District
            </span>

            <input
              type="text"
              value={district}
              onChange={(e) =>
                setDistrict(
                  e.target.value
                )
              }
              placeholder="e.g. Nashik"
              style={{
                width: "100%",
                height: "40px",
                padding: "0 11px",
                border: "1px solid var(--ks-border)",
                borderRadius: "9px",
                outline: "none",
                background: "var(--ks-surface)",
                fontSize: "12px",
              }}
            />

          </label>


          {/* PRIMARY ACTION */}

          <button
            type="submit"
            disabled={loading}
            style={{
              height: "40px",
              padding: "0 17px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "7px",
              border: "none",
              borderRadius: "9px",
              color: "#ffffff",
              background:
                "var(--role-primary)",
              fontSize: "12px",
              fontWeight: 700,
              whiteSpace: "nowrap",
              cursor:
                loading
                  ? "not-allowed"
                  : "pointer",
              opacity:
                loading
                  ? 0.65
                  : 1,
            }}
          >

            <Search size={15} />

            {loading
              ? "Finding..."
              : "Find Buyers"}

          </button>

        </form>

      </section>


      {/* ============================
          API STATUS
      ============================= */}

      {loading && (

        <div
          style={{
            padding: "14px 18px",
            marginBottom: "18px",
            borderRadius: "10px",
            background:
              "#f3f7f3",
            color: "var(--ks-text-secondary)",
            fontSize: "12px",
          }}
        >

          Finding buyers for{" "}

          <strong>
            {commodity}
          </strong>

          {" · "}

          {quantity} quintals

          {" · "}

          {quality}

          {" · "}

          {district}

          ...

        </div>

      )}


      {error && (

        <div
          style={{
            padding: "14px 18px",
            marginBottom: "18px",
            borderRadius: "10px",
            background:
              "#fef3f2",
            color: "#b42318",
            fontSize: "12px",
          }}
        >

          API Error: {error}

        </div>

      )}


      {/* ============================
          SUMMARY
      ============================= */}

      <div className="buyer-summary">


        <div className="buyer-summary-card">

          <div className="buyer-summary-icon">

            <Users size={19} />

          </div>

          <div>

            <span>
              Buyers Found
            </span>

            <strong>
              {filteredBuyers.length}
            </strong>

          </div>

        </div>


        <div className="buyer-summary-card">

          <div className="buyer-summary-icon">

            <Star size={19} />

          </div>

          <div>

            <span>
              Average Rating
            </span>

            <strong>
              {averageRating}
            </strong>

          </div>

        </div>


        <div className="buyer-summary-card">

          <div className="buyer-summary-icon">

            <ShieldCheck size={19} />

          </div>

          <div>

            <span>
              Verified Buyers
            </span>

            <strong>
              {verifiedCount}
            </strong>

          </div>

        </div>


        <div className="buyer-summary-card">

          <div className="buyer-summary-icon">

            <TrendingUp size={19} />

          </div>

          <div>

            <span>
              Best Trust Score
            </span>

            <strong>

              {bestBuyer
                ? `${Math.round(
                    bestBuyer.trust
                  )}%`
                : "0%"}

            </strong>

          </div>

        </div>

      </div>


      {/* ============================
          RECOMMENDATION
      ============================= */}

      {bestBuyer && (

        <section className="buyer-recommendation">

          <div className="recommendation-icon">

            <BadgeCheck size={22} />

          </div>


          <div className="recommendation-content">

            <span className="recommendation-label">

              TOP TRUSTED MATCH

            </span>


            <h2>

              {bestBuyer.name}

            </h2>


            <p>

              This buyer currently has the
              strongest trust score among
              the available matches.

            </p>


            <div className="recommendation-stats">

              <span>

                Trust Score{" "}

                <strong>
                  {Math.round(
                    bestBuyer.trust
                  )}%
                </strong>

              </span>


              <span>

                Rating{" "}

                <strong>
                  {bestBuyer.rating}
                </strong>

              </span>


              <span>

                Orders{" "}

                <strong>
                  {bestBuyer.orders}
                </strong>

              </span>

            </div>

          </div>

        </section>

      )}


      {/* ============================
          SEARCH
      ============================= */}

      <div className="buyer-controls">

        <div className="buyer-search">

          <Search size={17} />

          <input
            type="text"
            placeholder="Search buyers..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(
                e.target.value
              )
            }
          />

        </div>

      </div>


      {/* ============================
          BUYER SECTION
      ============================= */}

      <section className="buyer-section">

        <div className="section-heading">

          <div>

            <h2>
              Trusted Buyers
            </h2>

            <p>
              Compare buyers before choosing
              where to sell your produce.
            </p>

          </div>


          <span className="option-count">

            {filteredBuyers.length}{" "}

            {filteredBuyers.length === 1
              ? "buyer"
              : "buyers"}

          </span>

        </div>


        {/* ==========================
            EMPTY STATE
        =========================== */}

        {!loading &&
          !error &&
          filteredBuyers.length === 0 && (

            <div
              style={{
                padding: "40px 25px",
                textAlign: "center",
                color: "var(--ks-text-muted)",
              }}
            >

              <Users
                size={34}
                style={{
                  marginBottom: "10px",
                }}
              />

              <p
                style={{
                  margin: 0,
                  fontSize: "13px",
                  fontWeight: 650,
                }}
              >
                No buyers found for these
                requirements.
              </p>

              <p
                style={{
                  marginTop: "5px",
                  fontSize: "11px",
                }}
              >
                Try changing the commodity,
                quality, quantity or district.
              </p>

            </div>

          )}


        {/* ==========================
            BUYER LIST
        =========================== */}

        <div className="buyer-list">

          {filteredBuyers.map(
            (buyer) => {

              const isSelected =
                selectedBuyer?.id ===
                buyer.id;


              return (

                <div
                  key={buyer.id}
                  className={`buyer-card ${
                    isSelected
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    setSelectedBuyer(
                      buyer
                    )
                  }
                >


                  {/* AVATAR */}

                  <div className="buyer-avatar">

                    {buyer.name
                      .charAt(0)
                      .toUpperCase()}

                  </div>


                  {/* MAIN */}

                  <div className="buyer-main">

                    <div className="buyer-title">

                      <strong>
                        {buyer.name}
                      </strong>


                      {buyer.verified && (

                        <BadgeCheck
                          size={17}
                        />

                      )}

                    </div>


                    <span className="buyer-location">

                      {buyer.location}

                    </span>


                    <span className="buyer-crop">

                      Interested in:{" "}

                      {buyer.crop}

                    </span>

                  </div>


                  {/* TRUST */}

                  <div className="buyer-trust-score">

                    <span>
                      Trust Score
                    </span>

                    <strong>

                      {Math.round(
                        buyer.trust
                      )}%

                    </strong>

                  </div>


                  {/* RATING */}

                  <div className="buyer-rating">

                    <Star
                      size={15}
                      fill="currentColor"
                    />

                    <strong>
                      {buyer.rating}
                    </strong>

                  </div>


                  {/* ORDERS */}

                  <div className="buyer-orders">

                    <span>
                      Orders
                    </span>

                    <strong>
                      {buyer.orders}
                    </strong>

                  </div>


                  {/* ARROW */}

                  <ChevronRight
                    size={19}
                    className="buyer-arrow"
                  />

                </div>

              );

            }
          )}

        </div>

      </section>


      {/* ============================
          SELECTED BUYER DETAILS
      ============================= */}

      {selectedBuyer && (

        <section
          className="buyer-detail-card"
          style={{
            marginTop: "24px",
          }}
        >

          <div>

            <span className="page-eyebrow">
              SELECTED BUYER
            </span>

            <h2>
              {selectedBuyer.name}
            </h2>

            <p>
              {selectedBuyer.location}
            </p>

          </div>


          <div
            style={{
              display: "flex",
              gap: "24px",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >

            <div>

              <span>
                Trust Score
              </span>

              <strong>

                {Math.round(
                  selectedBuyer.trust
                )}%

              </strong>

            </div>


            <div>

              <span>
                Rating
              </span>

              <strong>

                ⭐{" "}
                {selectedBuyer.rating}

              </strong>

            </div>


            <div>

              <span>
                Completed Orders
              </span>

              <strong>
                {selectedBuyer.orders}
              </strong>

            </div>


            <div>

              <span>
                Payment
              </span>

              <strong>
                {selectedBuyer.paymentDays}
              </strong>

            </div>

          </div>

        </section>

      )}

    </div>

  );

}


export default BuyerTrust;