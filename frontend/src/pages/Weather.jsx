import { useState } from "react";
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

import "./Weather.css";

const forecast = [
  {
    day: "Today",
    icon: "🌤️",
    condition: "Partly Cloudy",
    high: 31,
    low: 24,
    rain: 20,
  },
  {
    day: "Sun",
    icon: "🌦️",
    condition: "Light Rain",
    high: 29,
    low: 23,
    rain: 60,
  },
  {
    day: "Mon",
    icon: "🌧️",
    condition: "Rain",
    high: 27,
    low: 22,
    rain: 75,
  },
  {
    day: "Tue",
    icon: "⛅",
    condition: "Cloudy",
    high: 28,
    low: 22,
    rain: 35,
  },
  {
    day: "Wed",
    icon: "☀️",
    condition: "Sunny",
    high: 32,
    low: 23,
    rain: 15,
  },
  {
    day: "Thu",
    icon: "🌤️",
    condition: "Partly Cloudy",
    high: 33,
    low: 24,
    rain: 20,
  },
  {
    day: "Fri",
    icon: "🌦️",
    condition: "Light Rain",
    high: 30,
    low: 23,
    rain: 50,
  },
];

const cropAdvice = {
  Tomato: {
    emoji: "🍅",
    title: "Tomato",
    advice:
      "Rain is expected in the next 48 hours. Avoid unnecessary irrigation and monitor for fungal disease.",
    alert: "Moderate rain risk",
  },

  Onion: {
    emoji: "🧅",
    title: "Onion",
    advice:
      "Humidity may increase over the next few days. Ensure good field drainage and avoid waterlogging.",
    alert: "Humidity alert",
  },

  "Green Chilli": {
    emoji: "🌶️",
    title: "Green Chilli",
    advice:
      "Warm conditions are expected. Monitor soil moisture and provide irrigation during dry periods.",
    alert: "Normal conditions",
  },
};

function Weather() {
  const [crop, setCrop] = useState("Tomato");

  const selectedCrop = cropAdvice[crop];

  return (
    <div className="weather-page">

      {/* HEADER */}

      <div className="weather-header">

        <div>
          <span className="page-eyebrow">
            FARM WEATHER INTELLIGENCE
          </span>

          <h1>Weather</h1>

          <p>
            Weather insights and farming alerts for
            better day-to-day decisions.
          </p>
        </div>

        <div className="weather-location">
          <MapPin size={14} />
          Hyderabad, Telangana
        </div>

      </div>


      {/* CURRENT WEATHER */}

      <section className="current-weather">

        <div className="current-main">

          <div className="current-location">
            <MapPin size={13} />
            Hyderabad
          </div>

          <div className="current-temperature">
            31°
          </div>

          <div className="current-condition">
            <CloudSun size={17} />
            Partly Cloudy
          </div>

          <span className="feels-like">
            Feels like 33°
          </span>

        </div>


        <div className="weather-metrics">

          <div className="weather-metric">

            <div className="metric-icon">
              <Droplets size={16} />
            </div>

            <div>
              <span>Humidity</span>
              <strong>68%</strong>
            </div>

          </div>


          <div className="weather-metric">

            <div className="metric-icon">
              <Wind size={16} />
            </div>

            <div>
              <span>Wind</span>
              <strong>14 km/h</strong>
            </div>

          </div>


          <div className="weather-metric">

            <div className="metric-icon">
              <CloudRain size={16} />
            </div>

            <div>
              <span>Rain chance</span>
              <strong>20%</strong>
            </div>

          </div>


          <div className="weather-metric">

            <div className="metric-icon">
              <Thermometer size={16} />
            </div>

            <div>
              <span>UV Index</span>
              <strong>6 Moderate</strong>
            </div>

          </div>

        </div>

      </section>


      {/* FARM ALERT */}

      <section className="farm-alert">

        <div className="alert-icon">
          <AlertTriangle size={19} />
        </div>

        <div className="alert-content">

          <span>FARMING ALERT</span>

          <h3>
            Rain expected over the next 48 hours
          </h3>

          <p>
            Consider completing harvesting and
            transportation activities before the
            expected rainfall.
          </p>

        </div>

        <div className="alert-rain">
          <CloudRain size={15} />
          60–75%
        </div>

      </section>


      {/* FORECAST */}

      <section className="forecast-section">

        <div className="section-heading">

          <div>
            <h2>7-Day Forecast</h2>

            <p>
              Plan your farm activities around
              upcoming weather conditions.
            </p>
          </div>

          <span className="forecast-updated">
            Updated 10 min ago
          </span>

        </div>


        <div className="forecast-grid">

          {forecast.map((item) => (

            <div
              key={item.day}
              className={
                item.day === "Today"
                  ? "forecast-card today"
                  : "forecast-card"
              }
            >

              <span className="forecast-day">
                {item.day}
              </span>

              <div className="forecast-icon">
                {item.icon}
              </div>

              <strong className="forecast-condition">
                {item.condition}
              </strong>

              <div className="forecast-temperature">
                <strong>{item.high}°</strong>
                <span>{item.low}°</span>
              </div>

              <div className="rain-probability">

                <CloudRain size={11} />

                <span>
                  {item.rain}%
                </span>

              </div>

            </div>

          ))}

        </div>

      </section>


      {/* CROP ADVISORY */}

      <section className="crop-section">

        <div className="section-heading">

          <div>
            <h2>Crop Weather Advisory</h2>

            <p>
              Select your crop to receive
              weather-based guidance.
            </p>
          </div>

        </div>


        <div className="crop-tabs">

          {Object.keys(cropAdvice).map(
            (cropName) => (

              <button
                key={cropName}
                className={
                  crop === cropName
                    ? "crop-tab active"
                    : "crop-tab"
                }
                onClick={() =>
                  setCrop(cropName)
                }
              >

                {cropAdvice[cropName].emoji}

                {cropName}

              </button>

            )
          )}

        </div>


        <div className="crop-advisory">

          <div className="advisory-crop">
            {selectedCrop.emoji}
          </div>

          <div className="advisory-content">

            <div className="advisory-title">

              <h3>
                {selectedCrop.title}
              </h3>

              <span>
                {selectedCrop.alert}
              </span>

            </div>

            <p>
              {selectedCrop.advice}
            </p>

          </div>

        </div>

      </section>


      {/* FARMING CONDITIONS */}

      <section className="conditions-section">

        <div className="section-heading">

          <div>
            <h2>Today's Farming Conditions</h2>

            <p>
              Quick indicators for field activities.
            </p>
          </div>

        </div>


        <div className="condition-grid">

          <div className="condition-card">

            <div className="condition-top">
              <Sun size={17} />
              <span>Field Work</span>
            </div>

            <strong>Good</strong>

            <p>
              Suitable until afternoon
            </p>

          </div>


          <div className="condition-card">

            <div className="condition-top">
              <Droplets size={17} />
              <span>Irrigation</span>
            </div>

            <strong>Low Need</strong>

            <p>
              Soil moisture likely adequate
            </p>

          </div>


          <div className="condition-card">

            <div className="condition-top">
              <CloudRain size={17} />
              <span>Harvesting</span>
            </div>

            <strong>Moderate</strong>

            <p>
              Check rainfall before harvest
            </p>

          </div>


          <div className="condition-card">

            <div className="condition-top">
              <Wind size={17} />
              <span>Spraying</span>
            </div>

            <strong>Good</strong>

            <p>
              Low wind conditions
            </p>

          </div>

        </div>

      </section>


      {/* FOOTER */}

      <div className="weather-footer">

        <CloudSun size={15} />

        <span>
          Weather information shown is indicative
          and should be used together with local
          observations and official advisories.
        </span>

      </div>

    </div>
  );
}

export default Weather;