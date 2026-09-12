import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Profile from "./pages/Profile";
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
function ComingSoon({ title }) {
  return (
    <div style={{ padding: "30px" }}>
      <h1>{title}</h1>
      <p style={{ marginTop: "10px", color: "#6b756b" }}>
        This KrishiSetu module is coming next.
      </p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* AUTH */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />


        {/* DASHBOARD */}

        <Route
          path="/dashboard"
          element={<DashboardLayout />}
        >

          {/* Dashboard Home */}

          <Route
            index
            element={<Dashboard />}
          />


          {/* Market Prices */}

          <Route
            path="market-prices"
            element={<MarketPrices />}
          />


          {/* Other Modules */}

          <Route
            path="net-realisation"
            element={<NetRealisation />}
          />

          <Route
            path="logistics"
            element={
              <Logistics />
            }
          />

          <Route
            path="buyer-trust"
            element={
              <BuyerTrust />
            }
          />

          <Route
            path="weather"
            element={
              <Weather />
            }
          />

          <Route
            path="assistant"
            element={
              <Assistant />
            }
          />

          <Route
  path="profile"
  element={<Profile />}
/>

        </Route>


        {/* FALLBACK */}

        <Route
          path="*"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;