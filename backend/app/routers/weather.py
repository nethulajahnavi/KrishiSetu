from datetime import datetime
from urllib.parse import urlencode
from urllib.request import Request, urlopen
import json

from fastapi import APIRouter, HTTPException


router = APIRouter(
    prefix="/api/weather",
    tags=["Weather"],
)


# Default KrishiSetu weather location.
# We can later replace this with the farmer's saved location.
DEFAULT_LOCATION = {
    "name": "Hyderabad",
    "district": "Hyderabad",
    "state": "Telangana",
    "latitude": 17.3850,
    "longitude": 78.4867,
}


def get_weather_description(weather_code):
    """
    Convert Open-Meteo WMO weather codes into
    human-readable descriptions.
    """

    code = int(weather_code)

    descriptions = {
        0: "Clear Sky",
        1: "Mainly Clear",
        2: "Partly Cloudy",
        3: "Overcast",
        45: "Fog",
        48: "Depositing Rime Fog",
        51: "Light Drizzle",
        53: "Moderate Drizzle",
        55: "Dense Drizzle",
        56: "Light Freezing Drizzle",
        57: "Dense Freezing Drizzle",
        61: "Slight Rain",
        63: "Moderate Rain",
        65: "Heavy Rain",
        66: "Light Freezing Rain",
        67: "Heavy Freezing Rain",
        71: "Slight Snow",
        73: "Moderate Snow",
        75: "Heavy Snow",
        77: "Snow Grains",
        80: "Slight Rain Showers",
        81: "Moderate Rain Showers",
        82: "Violent Rain Showers",
        85: "Slight Snow Showers",
        86: "Heavy Snow Showers",
        95: "Thunderstorm",
        96: "Thunderstorm with Slight Hail",
        99: "Thunderstorm with Heavy Hail",
    }

    return descriptions.get(code, "Weather conditions unavailable")


def fetch_open_meteo(latitude, longitude):
    """
    Fetch real weather data from Open-Meteo.

    Uses only Python's standard library so no additional
    backend dependency is required.
    """

    params = {
        "latitude": latitude,
        "longitude": longitude,
        "current": ",".join(
            [
                "temperature_2m",
                "relative_humidity_2m",
                "apparent_temperature",
                "precipitation",
                "weather_code",
                "wind_speed_10m",
                "uv_index",
            ]
        ),
        "daily": ",".join(
            [
                "weather_code",
                "temperature_2m_max",
                "temperature_2m_min",
                "precipitation_sum",
                "precipitation_probability_max",
                "uv_index_max",
                "wind_speed_10m_max",
            ]
        ),
        "timezone": "auto",
        "forecast_days": 7,
        "temperature_unit": "celsius",
        "wind_speed_unit": "kmh",
        "precipitation_unit": "mm",
    }

    url = (
        "https://api.open-meteo.com/v1/forecast?"
        + urlencode(params)
    )

    request = Request(
        url,
        headers={
            "User-Agent": "KrishiSetu/1.0"
        },
    )

    try:
        with urlopen(request, timeout=15) as response:
            return json.loads(response.read().decode("utf-8"))

    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Weather service unavailable: {exc}",
        )


@router.get("")
def get_weather():
    """
    Return current weather and a 7-day forecast
    for the configured KrishiSetu location.
    """

    location = DEFAULT_LOCATION

    data = fetch_open_meteo(
        location["latitude"],
        location["longitude"],
    )

    current = data.get("current", {})
    daily = data.get("daily", {})

    daily_times = daily.get("time", [])

    forecast = []

    for index, forecast_date in enumerate(daily_times):

        weather_codes = daily.get("weather_code", [])
        max_temperatures = daily.get("temperature_2m_max", [])
        min_temperatures = daily.get("temperature_2m_min", [])
        precipitation = daily.get("precipitation_sum", [])
        precipitation_probability = daily.get(
            "precipitation_probability_max",
            [],
        )
        uv_index = daily.get("uv_index_max", [])
        wind_speed = daily.get("wind_speed_10m_max", [])

        weather_code = (
            weather_codes[index]
            if index < len(weather_codes)
            else None
        )

        forecast.append(
            {
                "date": forecast_date,
                "condition": (
                    get_weather_description(weather_code)
                    if weather_code is not None
                    else "Unavailable"
                ),
                "weather_code": weather_code,
                "high": (
                    max_temperatures[index]
                    if index < len(max_temperatures)
                    else None
                ),
                "low": (
                    min_temperatures[index]
                    if index < len(min_temperatures)
                    else None
                ),
                "rain_probability": (
                    precipitation_probability[index]
                    if index < len(precipitation_probability)
                    else None
                ),
                "rainfall_mm": (
                    precipitation[index]
                    if index < len(precipitation)
                    else None
                ),
                "uv_index": (
                    uv_index[index]
                    if index < len(uv_index)
                    else None
                ),
                "max_wind_kmh": (
                    wind_speed[index]
                    if index < len(wind_speed)
                    else None
                ),
            }
        )

    return {
        "location": {
            "name": location["name"],
            "district": location["district"],
            "state": location["state"],
            "latitude": location["latitude"],
            "longitude": location["longitude"],
        },
        "current": {
            "temperature": current.get("temperature_2m"),
            "humidity": current.get("relative_humidity_2m"),
            "apparent_temperature": current.get(
                "apparent_temperature"
            ),
            "precipitation_mm": current.get("precipitation"),
            "weather_code": current.get("weather_code"),
            "condition": get_weather_description(
                current["weather_code"]
            )
            if current.get("weather_code") is not None
            else "Unavailable",
            "wind_speed_kmh": current.get("wind_speed_10m"),
            "uv_index": current.get("uv_index"),
            "observed_at": current.get("time"),
        },
        "forecast": forecast,
        "source": "Open-Meteo",
        "fetched_at": datetime.utcnow().isoformat(),
    }