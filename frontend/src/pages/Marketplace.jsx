import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowUpRight,
  Filter,
  IndianRupee,
  MapPin,
  PackageSearch,
  Search,
  Truck,
} from "lucide-react";

import "./Marketplace.css";

function Marketplace() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [commodity, setCommodity] = useState("All");
  const [district, setDistrict] = useState("All");

  /*
   * Backend connection will be added after verifying
   * the actual marketplace/lot API response.
   *
   * No fabricated marketplace records are displayed.
   */
  const listings = [];

  const filteredListings = listings.filter((item) => {
    const matchesSearch =
      !search ||
      item.commodity
        ?.toLowerCase()
        .includes(search.toLowerCase());

    const matchesCommodity =
      commodity === "All" ||
      item.commodity === commodity;

    const matchesDistrict =
      district === "All" ||
      item.district === district;

    return (
      matchesSearch &&
      matchesCommodity &&
      matchesDistrict
    );
  });

  return (
    <div className="marketplace-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <section className="marketplace-heading">

        <div>
          <span className="marketplace-eyebrow">
            BUYER WORKSPACE
          </span>

          <div className="marketplace-title-row">

            <div className="marketplace-title-icon">
              <PackageSearch
                size={20}
                strokeWidth={2.1}
              />
            </div>

            <div>
              <h1>
                Marketplace
              </h1>

              <p>
                Discover produce, compare source,
                price and logistics before making a
                procurement decision.
              </p>
            </div>

          </div>
        </div>

        <button
          type="button"
          className="marketplace-requirement-button"
          onClick={() =>
            navigate("/dashboard/requirements")
          }
        >
          Set Requirement
          <ArrowUpRight size={16} />
        </button>

      </section>


      {/* =====================================================
          DECISION CONTEXT
      ===================================================== */}

      <section className="marketplace-context">

        <div className="marketplace-context-icon">
          <IndianRupee size={19} />
        </div>

        <div>
          <span>
            PROCUREMENT VIEW
          </span>

          <strong>
            Compare more than just the asking price
          </strong>

          <p>
            Source location, quantity, quality and
            transport can all affect your final landed cost.
          </p>
        </div>

      </section>


      {/* =====================================================
          FILTERS
      ===================================================== */}

      <section className="marketplace-filter-card">

        <div className="marketplace-filter-heading">
          <Filter size={16} />

          <strong>
            Find produce
          </strong>
        </div>


        <div className="marketplace-search">

          <Search size={16} />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search commodity..."
          />

        </div>


        <select
          value={commodity}
          onChange={(event) =>
            setCommodity(event.target.value)
          }
        >
          <option value="All">
            All commodities
          </option>

          <option value="Onion">
            Onion
          </option>

          <option value="Tomato">
            Tomato
          </option>

          <option value="Green Chilli">
            Green Chilli
          </option>
        </select>


        <select
          value={district}
          onChange={(event) =>
            setDistrict(event.target.value)
          }
        >
          <option value="All">
            All districts
          </option>

          <option value="Nashik">
            Nashik
          </option>

          <option value="Pune">
            Pune
          </option>

          <option value="Mumbai">
            Mumbai
          </option>
        </select>

      </section>


      {/* =====================================================
          DATA STATUS
      ===================================================== */}

      <div className="marketplace-data-status">

        <span />

        Marketplace listings will appear here once
        connected to the verified produce/lot data source.

      </div>


      {/* =====================================================
          LISTINGS
      ===================================================== */}

      {filteredListings.length > 0 ? (

        <section className="marketplace-list">

          {filteredListings.map((item) => (
            <article
              className="marketplace-listing"
              key={item.id}
            >

              <div className="listing-main">

                <div className="listing-crop-icon">
                  <PackageSearch size={19} />
                </div>

                <div>
                  <span className="listing-label">
                    PRODUCE
                  </span>

                  <h3>
                    {item.commodity}
                  </h3>

                  <p>
                    {item.quantity} · {item.quality}
                  </p>
                </div>

              </div>


              <div className="listing-detail">
                <span>ASKING PRICE</span>
                <strong>
                  ₹{item.price}
                </strong>
                <small>
                  / quintal
                </small>
              </div>


              <div className="listing-detail">
                <span>LOCATION</span>

                <strong>
                  {item.district}
                </strong>

                <small>
                  {item.market}
                </small>
              </div>


              <div className="listing-detail">
                <span>LOGISTICS</span>

                <strong>
                  {item.distance} km
                </strong>

                <small>
                  Transport available
                </small>
              </div>


              <button
                type="button"
                className="listing-action"
              >
                View lot
                <ArrowUpRight size={15} />
              </button>

            </article>
          ))}

        </section>

      ) : (

        <section className="marketplace-empty">

          <div className="marketplace-empty-icon">
            <PackageSearch size={25} />
          </div>

          <h2>
            No marketplace listings yet
          </h2>

          <p>
            Produce listings will appear here when
            verified lot data is available.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/dashboard/requirements")
            }
          >
            Create a requirement
            <ArrowUpRight size={15} />
          </button>

        </section>

      )}


      {/* =====================================================
          LOGISTICS REMINDER
      ===================================================== */}

      <section className="marketplace-logistics">

        <div className="marketplace-logistics-icon">
          <Truck size={20} />
        </div>

        <div>

          <span>
            LANDED COST
          </span>

          <strong>
            A lower asking price does not always mean a
            lower procurement cost.
          </strong>

          <p>
            Check transport and route costs before
            finalising a purchase.
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

export default Marketplace;