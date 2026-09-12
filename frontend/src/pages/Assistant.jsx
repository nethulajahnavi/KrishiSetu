import { useState } from "react";
import {
  ArrowRight,
  Bot,
  CalendarDays,
  CheckCircle2,
  IndianRupee,
  MapPin,
  Send,
  Sparkles,
  Truck,
  UserRound,
} from "lucide-react";

import { apiRequest } from "../api/api";
import "./Assistant.css";

function Assistant() {
  const [question, setQuestion] = useState("");

  const [commodity, setCommodity] = useState("Onion");
  const [origin, setOrigin] = useState("Nashik");
  const [quantity, setQuantity] = useState(10);

  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const suggestedQuestions = [
    "When is the best time to sell my onion?",
    "Which market should I sell my crop to?",
    "Which buyer should I choose?",
    "Which transportation option is best?",
  ];

  async function askAssistant(customQuestion = null) {
    const finalQuestion =
      customQuestion !== null
        ? customQuestion
        : question.trim();

    if (!finalQuestion) {
      setError("Please enter a question.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await apiRequest("/assistant", {
        method: "POST",
        body: JSON.stringify({
          question: finalQuestion,
          commodity,
          origin,
          quantity: Number(quantity),
        }),
      });

      console.log("AI Assistant API:", data);

      setResponse(data);
      setQuestion(finalQuestion);
    } catch (err) {
      console.error("Assistant error:", err);
      setError(
        err.message || "Unable to connect to AI Assistant."
      );
    } finally {
      setLoading(false);
    }
  }

  const bestMarket = response?.best_market;
  const buyer = response?.recommended_buyer;
  const transport = response?.recommended_transport;

  return (
    <div className="assistant-page">

      {/* HEADER */}

      <div className="assistant-header">

        <div>
          <span className="page-eyebrow">
            KRISHISETU INTELLIGENCE
          </span>

          <h1>AI Assistant</h1>

          <p>
            Get intelligent guidance on prices, markets,
            buyers and transportation.
          </p>
        </div>

        <div className="assistant-status">
          <span className="assistant-status-dot" />
          AI Assistant Online
        </div>

      </div>


      {/* INPUT / CONTEXT */}

      <section className="assistant-card">

        <div className="assistant-card-heading">

          <div className="assistant-bot-icon">
            <Bot size={22} />
          </div>

          <div>
            <h2>Ask KrishiSetu</h2>

            <p>
              Tell me what you want to know about your
              crop and I'll analyse the available data.
            </p>
          </div>

        </div>


        {/* FARM DATA */}

        <div className="assistant-context">

          <div className="assistant-input-group">

            <label>Crop</label>

            <select
              value={commodity}
              onChange={(e) =>
                setCommodity(e.target.value)
              }
            >
              <option>Onion</option>
              <option>Tomato</option>
              <option>Green Chilli</option>
            </select>

          </div>


          <div className="assistant-input-group">

            <label>Origin</label>

            <input
              value={origin}
              onChange={(e) =>
                setOrigin(e.target.value)
              }
              placeholder="e.g. Nashik"
            />

          </div>


          <div className="assistant-input-group">

            <label>Quantity (quintals)</label>

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

          </div>

        </div>


        {/* QUESTION */}

        <div className="assistant-question">

          <textarea
            value={question}
            onChange={(e) =>
              setQuestion(e.target.value)
            }
            placeholder="Ask something like: When is the best time to sell my onion?"
            rows={3}
          />

          <button
            className="assistant-send-button"
            onClick={() => askAssistant()}
            disabled={loading}
          >
            {loading ? (
              "Analysing..."
            ) : (
              <>
                Ask KrishiSetu
                <Send size={17} />
              </>
            )}
          </button>

        </div>


        {/* SUGGESTIONS */}

        <div className="assistant-suggestions">

          <span>Try asking:</span>

          <div>
            {suggestedQuestions.map(
              (item) => (
                <button
                  key={item}
                  onClick={() =>
                    askAssistant(item)
                  }
                >
                  {item}
                </button>
              )
            )}
          </div>

        </div>


        {/* ERROR */}

        {error && (
          <div className="assistant-error">
            {error}
          </div>
        )}

      </section>


      {/* RESPONSE */}

      {response && (

        <section className="assistant-response">

          {/* MAIN ANSWER */}

          <div className="answer-card">

            <div className="answer-header">

              <div className="answer-icon">
                <Sparkles size={19} />
              </div>

              <div>
                <span>
                  KRISHISETU RECOMMENDS
                </span>

                <h2>Analysis</h2>
              </div>

            </div>


            <p className="answer-text">
              {response.answer}
            </p>

          </div>


          {/* RECOMMENDATIONS */}

          <div className="recommendation-grid">

            {/* MARKET */}

            <div className="recommendation-card">

              <div className="recommendation-top">

                <div className="recommendation-icon market">
                  <IndianRupee size={18} />
                </div>

                <span>
                  BEST MARKET
                </span>

              </div>

              {bestMarket ? (
                <>
                  <h3>
                    {bestMarket.market}
                  </h3>

                  <p>
                    <MapPin size={13} />
                    {bestMarket.district},{" "}
                    {bestMarket.state}
                  </p>

                  <strong className="recommendation-value">
                    ₹
                    {Number(
                      bestMarket.price
                    ).toLocaleString(
                      "en-IN"
                    )}
                    /quintal
                  </strong>
                </>
              ) : (
                <p>
                  No market recommendation
                  available.
                </p>
              )}

            </div>


            {/* BUYER */}

            <div className="recommendation-card">

              <div className="recommendation-top">

                <div className="recommendation-icon buyer">
                  <UserRound size={18} />
                </div>

                <span>
                  RECOMMENDED BUYER
                </span>

              </div>

              {buyer ? (
                <>
                  <h3>
                    {buyer.business_name}
                  </h3>

                  <p>
                    {buyer.buyer_type ||
                      "Verified buyer"}
                  </p>

                  {buyer.offered_price && (
                    <strong className="recommendation-value">
                      ₹
                      {Number(
                        buyer.offered_price
                      ).toLocaleString(
                        "en-IN"
                      )}
                      /quintal
                    </strong>
                  )}

                  {buyer.verified && (
                    <span className="verified-label">
                      <CheckCircle2 size={13} />
                      Verified buyer
                    </span>
                  )}
                </>
              ) : (
                <p>
                  No matching buyer found.
                </p>
              )}

            </div>


            {/* TRANSPORT */}

            <div className="recommendation-card">

              <div className="recommendation-top">

                <div className="recommendation-icon transport">
                  <Truck size={18} />
                </div>

                <span>
                  BEST TRANSPORT
                </span>

              </div>

              {transport ? (
                <>
                  <h3>
                    {transport.transport_type ||
                      "Transport option"}
                  </h3>

                  <p>
                    {transport.destination}
                  </p>

                  <strong className="recommendation-value">
                    ₹
                    {Number(
                      transport.total_cost_per_quintal ||
                      0
                    ).toLocaleString(
                      "en-IN"
                    )}
                    /quintal
                  </strong>

                  {transport.distance_km !== null &&
                    transport.distance_km !==
                      undefined && (
                      <span className="transport-distance">
                        {transport.distance_km} km
                      </span>
                    )}
                </>
              ) : (
                <p>
                  No transport option found
                  for this origin.
                </p>
              )}

            </div>

          </div>


          {/* PRICE TREND */}

          <div className="trend-card">

            <div className="trend-icon">
              <CalendarDays size={19} />
            </div>

            <div>

              <span>
                PRICE TREND
              </span>

              <h3>
                {response.price_trend ===
                "increasing"
                  ? "Prices are currently increasing"
                  : response.price_trend ===
                    "decreasing"
                  ? "Prices are currently decreasing"
                  : "Prices appear relatively stable"}
              </h3>

              <p>
                {response.price_trend ===
                "increasing"
                  ? "If storage conditions are suitable, waiting may provide an opportunity for a better price."
                  : response.price_trend ===
                    "decreasing"
                  ? "Consider selling sooner to reduce the risk of further price decline."
                  : "Compare the net realisation across markets before deciding when to sell."}
              </p>

            </div>

          </div>


          {/* MARKET DATA */}

          {response.market_data?.length > 0 && (

            <div className="assistant-market-card">

              <div className="assistant-section-heading">

                <div>
                  <h2>Available Market Data</h2>

                  <p>
                    Current market information used
                    by the assistant.
                  </p>
                </div>

              </div>


              <div className="assistant-market-list">

                {response.market_data.map(
                  (market, index) => (

                    <div
                      className="assistant-market-row"
                      key={`${market.market}-${index}`}
                    >

                      <div>
                        <strong>
                          {market.market}
                        </strong>

                        <span>
                          {market.district},{" "}
                          {market.state}
                        </span>
                      </div>

                      <strong>
                        ₹
                        {Number(
                          market.price
                        ).toLocaleString(
                          "en-IN"
                        )}
                        /quintal
                      </strong>

                    </div>

                  )
                )}

              </div>

            </div>

          )}

        </section>
      )}


      {/* EMPTY STATE */}

      {!response && !loading && !error && (

        <section className="assistant-empty">

          <div className="assistant-empty-icon">
            <Sparkles size={25} />
          </div>

          <h2>
            Your farming decisions,
            made smarter.
          </h2>

          <p>
            Ask about market prices, future trends,
            the best time to sell, trusted buyers,
            or transportation options.
          </p>

          <div className="empty-features">

            <div>
              <IndianRupee size={17} />
              Price prediction
            </div>

            <div>
              <MapPin size={17} />
              Market recommendation
            </div>

            <div>
              <UserRound size={17} />
              Buyer matching
            </div>

            <div>
              <Truck size={17} />
              Transport recommendation
            </div>

          </div>

        </section>

      )}

    </div>
  );
}

export default Assistant;