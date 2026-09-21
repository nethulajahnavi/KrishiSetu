const API_BASE_URL = "http://127.0.0.1:8000/api";

/* =========================================================
   COMMON API REQUEST
========================================================= */

export async function apiRequest(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

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
   AUTHENTICATION
========================================================= */

export function registerUser(userData) {
  return apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}


export async function loginUser(email, password) {
  const body = new URLSearchParams();

  body.append("username", email);
  body.append("password", password);

  const response = await fetch(
    `${API_BASE_URL}/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    }
  );

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.detail ||
        data?.message ||
        `Login failed: ${response.status}`
    );
  }

  return data;
}


/* =========================================================
   AUTHENTICATED REQUEST
========================================================= */

export function authenticatedRequest(endpoint, options = {}) {
  const token = localStorage.getItem("krishisetu_token");

  return apiRequest(endpoint, {
    ...options,
    headers: {
      ...(options.headers || {}),
      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),
    },
  });
}


/* =========================================================
   CURRENT USER
========================================================= */

export function getCurrentUser() {
  return authenticatedRequest("/users/me");
}


/* =========================================================
   MARKET PRICES
========================================================= */

export function getMarketPrices(params = {}) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.append(key, value);
    }
  });

  const queryString = query.toString();

  return authenticatedRequest(
    `/market-prices${queryString ? `?${queryString}` : ""}`
  );
}


/* =========================================================
   PRICE HISTORY — API v1
========================================================= */

export function getPriceHistory(params = {}) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.append(key, value);
    }
  });

  const queryString = query.toString();

  return authenticatedRequest(
    `/v1/price-history${queryString ? `?${queryString}` : ""}`
  );
}


/* =========================================================
   NET REALISATION
========================================================= */

export function getNetRealisation(
  commodity,
  origin,
  quantity
) {
  return authenticatedRequest(
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

export function getLogistics(params = {}) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.append(key, value);
    }
  });

  const queryString = query.toString();

  return authenticatedRequest(
    `/logistics${queryString ? `?${queryString}` : ""}`
  );
}


/* =========================================================
   BUYERS
========================================================= */

export function getBuyers() {
  return authenticatedRequest("/buyers");
}


/* =========================================================
   BUYER MATCHING
========================================================= */

export function getBuyerMatching() {
  return authenticatedRequest("/buyer-matching");
}


/* =========================================================
   WEATHER
========================================================= */

export function getWeather() {
  return authenticatedRequest("/weather");
}


/* =========================================================
   FARMER PROFILE
========================================================= */

export function getFarmerProfile() {
  return authenticatedRequest("/farmer-profile");
}