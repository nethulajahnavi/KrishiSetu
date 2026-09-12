import { useEffect, useMemo, useState } from "react";

import {
  BadgeCheck,
  ChevronRight,
  Clock3,
  CreditCard,
  Search,
  ShieldCheck,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";

import { getBuyerMatching } from "../api/api";

import "./BuyerTrust.css";


function BuyerTrust() {

  /* ================================
     STATE
  ================================= */

  const [buyers, setBuyers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] =
    useState("");

  const [selectedBuyer, setSelectedBuyer] =
    useState(null);


  /* ================================
     LOAD BUYERS FROM BACKEND
  ================================= */

  useEffect(() => {

    async function loadBuyers() {

      try {

        setLoading(true);
        setError("");

        const data =
          await getBuyerMatching();

        console.log(
          "Buyer Matching API:",
          data
        );

        /*
          Backend may return:

          [
            {...},
            {...}
          ]

          OR

          {
            buyers: [...]
          }

          OR

          {
            matches: [...]
          }
        */

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

        /*
          Convert backend data into the
          structure expected by the UI.
        */

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
                  rating * 20 ??
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


        if (
          formattedBuyers.length > 0
        ) {

          setSelectedBuyer(
            formattedBuyers[0]
          );

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

      } finally {

        setLoading(false);

      }

    }


    loadBuyers();

  }, []);


  /* ================================
     FILTER BUYERS
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
              .includes(search) ||

            buyer.location
              .toLowerCase()
              .includes(search) ||

            buyer.crop
              .toLowerCase()
              .includes(search)
          );

        }
      );

    }, [buyers, searchTerm]);


  /* ================================
     BEST BUYER
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
            Find reliable buyers with verified
            profiles, transparent payments and
            strong transaction history.
          </p>

        </div>


        <div className="buyer-status">

          <span className="status-dot" />

          {loading
            ? "Loading buyers..."
            : "Buyer network active"}

        </div>

      </div>


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
          }}
        >

          Loading buyer data
          from PostgreSQL...

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
              <small>
                /5
              </small>
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

              KRISHISETU RECOMMENDS

            </span>


            <h2>

              Consider selling to{" "}

              {bestBuyer.name}

            </h2>


            <p>

              This buyer currently has the
              strongest trust score among
              the available buyers.

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
            BUYER LIST
        =========================== */}

        {!loading &&
          !error &&
          filteredBuyers.length === 0 && (

            <div
              style={{
                padding: "35px",
                textAlign: "center",
              }}
            >

              <Users
                size={34}
              />

              <p>
                No buyers found.
              </p>

            </div>

          )}


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