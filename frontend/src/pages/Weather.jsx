import { useEffect, useMemo, useState } from "react";

import {
  AlertTriangle,
  CloudRain,
  CloudSun,
  Droplets,
  MapPin,
  Sun,
  Thermometer,
  Wind,
} from "lucide-react";

import { getWeather } from "../api/api";

import "./Weather.css";


// ---------------------------------------------------------
// Helpers
// ---------------------------------------------------------

function formatForecastDay(dateString, index) {
  if (!dateString) return "—";

  if (index === 0) {
    return "Today";
  }

  const date = new Date(`${dateString}T00:00:00`);

  return date.toLocaleDateString("en-IN", {
    weekday: "short",
  });
}


function getWeatherIcon(condition = "") {
  const value = condition.toLowerCase();

  if (
    value.includes("thunder") ||
    value.includes("storm")
  ) {
    return CloudRain;
  }

  if (
    value.includes("rain") ||
    value.includes("drizzle")
  ) {
    return CloudRain;
  }

  if (
    value.includes("cloud") ||
    value.includes("overcast")
  ) {
    return CloudSun;
  }

  if (value.includes("sun") || value.includes("clear")) {
    return Sun;
  }

  return CloudSun;
}


function getCropGuidance(crop, weather) {
  const forecast = weather?.forecast || [];

  const nextTwoDays = forecast.slice(0, 2);

  const maxRainChance = Math.max(
    ...nextTwoDays.map((item) =>
      Number(item?.rain_probability || 0)
    ),
    0
  );

  const totalRainfall = nextTwoDays.reduce(
    (sum, item) =>
      sum + Number(item?.rainfall_mm || 0),
    0
  );

  const maxWind = Math.max(
    ...nextTwoDays.map((item) =>
      Number(item?.max_wind_kmh || 0)
    ),
    0
  );

  if (crop === "Tomato") {
    if (maxRainChance >= 70 || totalRainfall >= 5) {
      return {
        status: "Rain caution",
        text:
          "Rain is likely over the next two days. Review harvesting and field-work plans and avoid unnecessary exposure of harvested produce.",
      };
    }

    if (maxWind >= 20) {
      return {
        status: "Wind caution",
        text:
          "Higher winds are expected. Monitor crop and support structures during field activities.",
      };
    }

    return {
      status: "Favourable",
      text:
        "Current weather signals are relatively favourable for routine tomato field activities.",
    };
  }


  if (crop === "Onion") {
    if (maxRainChance >= 70 || totalRainfall >= 5) {
      return {
        status: "Rain caution",
        text:
          "Rain is likely over the next two days. Take extra care with harvesting, drying and movement of onion produce.",
      };
    }

    return {
      status: "Favourable",
      text:
        "Current weather signals are relatively favourable for routine onion activities.",
    };
  }


  if (crop === "Green Chilli") {
    if (maxRainChance >= 70 || totalRainfall >= 5) {
      return {
        status: "Rain caution",
        text:
          "Rain is likely over the next two days. Review harvesting and transport timing for green chilli.",
      };
    }

    if (maxWind >= 20) {
      return {
        status: "Wind caution",
        text:
          "Higher winds are expected. Take care during field activities and monitor the crop.",
      };
    }

    return {
      status: "Favourable",
      text:
        "Current weather signals are relatively favourable for routine green chilli activities.",
    };
  }


  return {
    status: "Weather-based guidance",
    text:
      "Use the current weather and forecast conditions when planning field activities.",
  };
}


function getFarmingConditions(weather) {
  const forecast = weather?.forecast || [];

  const nextTwoDays = forecast.slice(0, 2);

  const maxRainChance = Math.max(
    ...nextTwoDays.map((item) =>
      Number(item?.rain_probability || 0)
    ),
    0
  );

  const totalRainfall = nextTwoDays.reduce(
    (sum, item) =>
      sum + Number(item?.rainfall_mm || 0),
    0
  );

  const maxWind = Math.max(
    ...nextTwoDays.map((item) =>
      Number(item?.max_wind_kmh || 0)
    ),
    0
  );


  // Field work
  let fieldWork = "Good";
  let fieldWorkDescription = "Suitable weather signals.";

  if (maxRainChance >= 70 || totalRainfall >= 5) {
    fieldWork = "Caution";
    fieldWorkDescription = "Rain is likely.";
  } else if (maxWind >= 20) {
    fieldWork = "Moderate";
    fieldWorkDescription = "Higher winds expected.";
  }


  // Irrigation
  let irrigation = "Low Need";
  let irrigationDescription = "Rain signal may reduce immediate need.";

  if (maxRainChance < 30 && totalRainfall < 2) {
    irrigation = "Review Need";
    irrigationDescription =
      "Limited rainfall is expected.";
  }


  // Harvesting
  let harvesting = "Good";
  let harvestingDescription =
    "Check crop and field conditions.";

  if (maxRainChance >= 70 || totalRainfall >= 5) {
    harvesting = "Moderate";
    harvestingDescription =
      "Rain may affect harvesting plans.";
  }


  // Spraying
  let spraying = "Good";
  let sprayingDescription =
    "Weather signals are relatively suitable.";

  if (maxRainChance >= 50 || maxWind >= 15) {
    spraying = "Caution";
    sprayingDescription =
      "Rain or wind may affect application.";
  }


  return [
    {
      title: "Field Work",
      status: fieldWork,
      description: fieldWorkDescription,
      icon: Wind,
    },
    {
      title: "Irrigation",
      status: irrigation,
      description: irrigationDescription,
      icon: Droplets,
    },
    {
      title: "Harvesting",
      status: harvesting,
      description: harvestingDescription,
      icon: Sun,
    },
    {
      title: "Spraying",
      status: spraying,
      description: sprayingDescription,
      icon: CloudRain,
    },
  ];
}


// ---------------------------------------------------------
// Weather Component
// ---------------------------------------------------------

function Weather() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedCrop, setSelectedCrop] =
    useState("Green Chilli");


  // -------------------------------------------------------
  // Load real weather data
  // -------------------------------------------------------

  useEffect(() => {
    async function loadWeather() {
      try {
        setLoading(true);
        setError("");

        const data = await getWeather();

        setWeatherData(data);
      } catch (err) {
        console.error("Weather API Error:", err);

        setError(
          err?.message ||
            "Failed to load weather data."
        );
      } finally {
        setLoading(false);
      }
    }

    loadWeather();
  }, []);


  // -------------------------------------------------------
  // Derived data
  // -------------------------------------------------------

  const forecast = weatherData?.forecast || [];

  const current = weatherData?.current || {};

  const location = weatherData?.location || {};


  const todayForecast = forecast[0] || {};

  const rainProbability = Number(
    todayForecast?.rain_probability || 0
  );


  const farmingConditions = useMemo(
    () => getFarmingConditions(weatherData),
    [weatherData]
  );


  const cropGuidance = useMemo(
    () =>
      getCropGuidance(
        selectedCrop,
        weatherData
      ),
    [selectedCrop, weatherData]
  );


  // -------------------------------------------------------
  // Agricultural alert
  // -------------------------------------------------------

  const next48Hours = forecast.slice(0, 2);

  const maxRainChance48 = Math.max(
    ...next48Hours.map((item) =>
      Number(item?.rain_probability || 0)
    ),
    0
  );

  const rainfall48 = next48Hours.reduce(
    (sum, item) =>
      sum + Number(item?.rainfall_mm || 0),
    0
  );

  const rainExpected =
    maxRainChance48 >= 60 ||
    rainfall48 >= 5;


  // -------------------------------------------------------
  // Loading state
  // -------------------------------------------------------

  if (loading) {
    return (
      <div className="weather-page">
        <div className="weather-header">
          <div>
            <span className="weather-eyebrow">
              FARM WEATHER INTELLIGENCE
            </span>

            <h1>Weather</h1>

            <p>
              Weather insights and farming alerts
              for better day-to-day decisions.
            </p>
          </div>
        </div>

        <div className="weather-loading">
          <div className="weather-loading-icon">
            <CloudSun size={28} />
          </div>

          <strong>
            Loading weather data...
          </strong>

          <span>
            Getting the latest forecast.
          </span>
        </div>
      </div>
    );
  }


  // -------------------------------------------------------
  // Error state
  // -------------------------------------------------------

  if (error) {
    return (
      <div className="weather-page">
        <div className="weather-header">
          <div>
            <span className="weather-eyebrow">
              FARM WEATHER INTELLIGENCE
            </span>

            <h1>Weather</h1>

            <p>
              Weather insights and farming alerts
              for better day-to-day decisions.
            </p>
          </div>
        </div>

        <div className="weather-error">
          <div className="weather-error-icon">
            <AlertTriangle size={26} />
          </div>

          <div>
            <strong>
              Weather data unavailable
            </strong>

            <p>{error}</p>
          </div>

          <button
            type="button"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }


  // -------------------------------------------------------
  // Main UI
  // -------------------------------------------------------

  return (
    <div className="weather-page">

      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="weather-header">

        <div>
          <span className="weather-eyebrow">
            FARM WEATHER INTELLIGENCE
          </span>

          <h1>Weather</h1>

          <p>
            Weather insights and farming alerts
            for better day-to-day decisions.
          </p>
        </div>

        <div className="weather-location">
          <MapPin size={13} />

          <span>
            {location?.name || "Hyderabad"}
            {location?.state
              ? `, ${location.state}`
              : ""}
          </span>
        </div>

      </div>


      {/* ===================================================
          CURRENT WEATHER
      =================================================== */}

      <section className="current-weather-card">

        <div className="current-weather-main">

          <div className="current-location">
            <MapPin size={11} />

            <span>
              {location?.name || "Hyderabad"}
            </span>
          </div>

          <div className="current-temperature">
            {Math.round(
              Number(current?.temperature || 0)
            )}
            °
          </div>

          <div className="current-condition">

            {(() => {
              const Icon =
                getWeatherIcon(
                  current?.condition
                );

              return <Icon size={13} />;
            })()}

            <strong>
              {current?.condition || "—"}
            </strong>

          </div>

          <span className="current-source">
            {weatherData?.source || "Weather API"}
          </span>

        </div>


        <div className="current-weather-metrics">

          <div className="weather-metric">

            <div className="weather-metric-icon">
              <Droplets size={14} />
            </div>

            <div>
              <span>Humidity</span>

              <strong>
                {Number(
                  current?.humidity || 0
                )}
                %
              </strong>
            </div>

          </div>


          <div className="weather-metric">

            <div className="weather-metric-icon">
              <Wind size={14} />
            </div>

            <div>
              <span>Wind</span>

              <strong>
                {Number(
                  current?.wind_speed_kmh || 0
                )}{" "}
                km/h
              </strong>
            </div>

          </div>


          <div className="weather-metric">

            <div className="weather-metric-icon">
              <CloudRain size={14} />
            </div>

            <div>
              <span>Rain chance</span>

              <strong>
                {rainProbability}%
              </strong>
            </div>

          </div>


          <div className="weather-metric">

            <div className="weather-metric-icon">
              <Thermometer size={14} />
            </div>

            <div>
              <span>Feels like</span>

              <strong>
                {Math.round(
                  Number(
                    current?.apparent_temperature ||
                      current?.temperature ||
                      0
                  )
                )}
                °
              </strong>
            </div>

          </div>

        </div>

      </section>


      {/* ===================================================
          FARMING ALERT
      =================================================== */}

      <section
        className={`weather-alert ${
          rainExpected
            ? "weather-alert-warning"
            : "weather-alert-normal"
        }`}
      >

        <div className="weather-alert-icon">
          {rainExpected ? (
            <AlertTriangle size={17} />
          ) : (
            <CloudSun size={17} />
          )}
        </div>

        <div className="weather-alert-content">

          <span>
            FARMING ALERT
          </span>

          <strong>
            {rainExpected
              ? "Rain likely over the next 48 hours"
              : "No significant rainfall signal in the next 48 hours"}
          </strong>

          <p>
            {rainExpected
              ? "Review harvesting, field-work and transport plans before rainfall."
              : "Current forecast does not show a strong rainfall signal over the next 48 hours."}
          </p>

        </div>

        <div className="weather-alert-value">

          <span>
            Rain chance
          </span>

          <strong>
            {maxRainChance48}%
          </strong>

        </div>

      </section>


      {/* ===================================================
          7-DAY FORECAST
      =================================================== */}

      <section className="weather-section">

        <div className="weather-section-header">

          <div>
            <h2>
              7-Day Forecast
            </h2>

            <p>
              Plan your farm activities around
              upcoming weather conditions.
            </p>
          </div>

          <span className="weather-updated">
            Updated{" "}
            {weatherData?.fetched_at
              ? new Date(
                  weatherData.fetched_at
                ).toLocaleTimeString(
                  "en-IN",
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )
              : "recently"}
          </span>

        </div>


        <div className="forecast-grid">

          {forecast.map((item, index) => {

            const Icon =
              getWeatherIcon(
                item?.condition
              );

            return (
              <div
                className={`forecast-card ${
                  index === 0
                    ? "forecast-card-active"
                    : ""
                }`}
                key={`${item?.date}-${index}`}
              >

                <span className="forecast-day">
                  {formatForecastDay(
                    item?.date,
                    index
                  )}
                </span>

                <div className="forecast-icon">
                  <Icon size={22} />
                </div>

                <strong className="forecast-condition">
                  {item?.condition || "—"}
                </strong>

                <div className="forecast-temperature">

                  <strong>
                    {Math.round(
                      Number(item?.high || 0)
                    )}
                    °
                  </strong>

                  <span>
                    {Math.round(
                      Number(item?.low || 0)
                    )}
                    °
                  </span>

                </div>

                <div className="forecast-rain">

                  <CloudRain size={11} />

                  <span>
                    {Number(
                      item?.rain_probability || 0
                    )}
                    %
                  </span>

                </div>

              </div>
            );
          })}

        </div>

      </section>


      {/* ===================================================
          CROP WEATHER ADVISORY
      =================================================== */}

      <section className="weather-section crop-advisory-section">

        <div className="weather-section-header">

          <div>
            <h2>
              Crop Weather Advisory
            </h2>

            <p>
              Select your crop to see
              weather-based guidance.
            </p>
          </div>

        </div>


        <div className="crop-tabs">

          {[
            "Tomato",
            "Onion",
            "Green Chilli",
          ].map((crop) => (

            <button
              key={crop}
              type="button"
              className={`crop-tab ${
                selectedCrop === crop
                  ? "crop-tab-active"
                  : ""
              }`}
              onClick={() =>
                setSelectedCrop(crop)
              }
            >

              {crop === "Tomato" && "🍅"}

              {crop === "Onion" && "🧅"}

              {crop === "Green Chilli" && "🌶️"}

              <span>
                {crop}
              </span>

            </button>

          ))}

        </div>


        <div className="crop-advisory-card">

          <div className="crop-advisory-visual">

            <span>
              {selectedCrop === "Tomato" &&
                "🍅"}

              {selectedCrop === "Onion" &&
                "🧅"}

              {selectedCrop ===
                "Green Chilli" &&
                "🌶️"}
            </span>

          </div>


          <div className="crop-advisory-content">

            <div className="crop-advisory-title">

              <strong>
                {selectedCrop}
              </strong>

              <span
                className={`crop-status ${
                  cropGuidance.status
                    .toLowerCase()
                    .includes("caution")
                    ? "crop-status-warning"
                    : "crop-status-good"
                }`}
              >
                {cropGuidance.status}
              </span>

            </div>

            <p>
              {cropGuidance.text}
            </p>

          </div>

        </div>

      </section>


      {/* ===================================================
          FARMING CONDITIONS
      =================================================== */}

      <section className="weather-section">

        <div className="weather-section-header">

          <div>
            <h2>
              Today's Farming Conditions
            </h2>

            <p>
              Quick indicators based on
              current forecast conditions.
            </p>
          </div>

        </div>


        <div className="farming-conditions-grid">

          {farmingConditions.map(
            (item) => {

              const Icon = item.icon;

              const caution =
                item.status
                  .toLowerCase()
                  .includes("caution") ||
                item.status
                  .toLowerCase()
                  .includes("moderate") ||
                item.status
                  .toLowerCase()
                  .includes("review");

              return (
                <div
                  className="farming-condition-card"
                  key={item.title}
                >

                  <div className="farming-condition-icon">
                    <Icon size={15} />
                  </div>

                  <div className="farming-condition-content">

                    <span>
                      {item.title}
                    </span>

                    <strong
                      className={
                        caution
                          ? "condition-caution"
                          : "condition-good"
                      }
                    >
                      {item.status}
                    </strong>

                    <small>
                      {item.description}
                    </small>

                  </div>

                </div>
              );
            }
          )}

        </div>

      </section>


      {/* ===================================================
          SOURCE / DISCLAIMER
      =================================================== */}

      <div className="weather-footer">

        <CloudSun size={13} />

        <span>
          Weather information is sourced from{" "}
          <strong>
            {weatherData?.source ||
              "Open-Meteo"}
          </strong>
          . Conditions and forecasts may
          change as new weather data becomes
          available.
        </span>

      </div>

    </div>
  );
}


export default Weather;