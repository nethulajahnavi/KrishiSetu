const API_BASE_URL = "http://127.0.0.1:8000/api";

/* =========================================================
   COMMON API REQUEST
========================================================= */

export async function apiRequest(endpoint, options = {}) {
  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    }
  );

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.detail ||
        data?.message ||
        `API request failed: ${response.status}`
    );
  }

  return data;
}


/* =========================================================
   MARKET PRICES
========================================================= */

export function getMarketPrices() {
  return apiRequest("/market-prices");
}


/* =========================================================
   NET REALISATION
========================================================= */

export function getNetRealisation(
  commodity,
  origin,
  quantity
) {
  return apiRequest(
    `/net-realisation?commodity=${encodeURIComponent(
      commodity
    )}&origin=${encodeURIComponent(
      origin
    )}&quantity=${encodeURIComponent(quantity)}`
  );
}


/* =========================================================
   LOGISTICS
========================================================= */

export function getLogistics() {
  return apiRequest("/logistics");
}


/* =========================================================
   BUYERS
========================================================= */

export function getBuyers() {
  return apiRequest("/buyers");
}


/* =========================================================
   BUYER MATCHING
========================================================= */

export function getBuyerMatching() {
  return apiRequest("/buyer-matching");
}


/* =========================================================
   WEATHER
========================================================= */

export function getWeather() {
  return apiRequest("/weather");
}


/* =========================================================
   FARMER PROFILE
========================================================= */

export function getFarmerProfile() {
  return apiRequest("/farmer-profile");
}