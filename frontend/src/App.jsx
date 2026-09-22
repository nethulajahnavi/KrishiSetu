
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Logistics from "./pages/Logistics";
import NetRealisation from "./pages/NetRealisation";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BuyerTrust from "./pages/BuyerTrust";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import MarketPrices from "./pages/MarketPrices";
import Weather from "./pages/Weather";
import Assistant from "./pages/Assistant";
import Marketplace from "./pages/Marketplace";
function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =========================
            AUTH
        ========================== */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />


        {/* =========================
            DASHBOARD
        ========================== */}

        <Route
          path="/dashboard"
          element={<DashboardLayout />}
        >

          {/* Dashboard */}

          <Route
            index
            element={<Dashboard />}
          />


          {/* Market Prices */}

          <Route
            path="market-prices"
            element={<MarketPrices />}
          />


          {/* Net Realisation */}

          <Route
            path="net-realisation"
            element={<NetRealisation />}
          />


          {/* Logistics */}

          <Route
            path="logistics"
            element={<Logistics />}
          />


          {/* Buyer Trust */}

          <Route
            path="buyer-trust"
            element={<BuyerTrust />}
          />


          {/* Weather */}

          <Route
            path="weather"
            element={<Weather />}
          />


          {/* AI Assistant */}

          <Route
            path="assistant"
            element={<Assistant />}
          />


          {/* Profile */}

          <Route
            path="profile"
            element={<Profile />}
          />


          {/* Settings */}

          <Route
            path="settings"
            element={<Settings />}
          />

        </Route>


        {/* =========================
            FALLBACK
        ========================== */}

        <Route
          path="*"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />
        <Route path="marketplace" element={<Marketplace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;

