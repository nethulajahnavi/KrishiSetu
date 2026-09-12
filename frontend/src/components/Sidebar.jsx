import {
  BarChart3,
  Bot,
  ChevronLeft,
  ChevronRight,
  CloudSun,
  Handshake,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  ShoppingBasket,
  Truck,
  User,
  X,
} from "lucide-react";

import { NavLink } from "react-router-dom";

import "./Sidebar.css";

function Sidebar({ mobileOpen, setMobileOpen }) {
  const menuItems = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      label: "Market Prices",
      icon: ShoppingBasket,
      path: "/dashboard/market-prices",
    },
    {
      label: "Net Realisation",
      icon: BarChart3,
      path: "/dashboard/net-realisation",
    },
    {
      label: "Logistics",
      icon: Truck,
      path: "/dashboard/logistics",
    },
    {
      label: "Buyer Trust",
      icon: Handshake,
      path: "/dashboard/buyer-trust",
    },
    {
      label: "Weather",
      icon: CloudSun,
      path: "/dashboard/weather",
    },
    {
      label: "AI Assistant",
      icon: Bot,
      path: "/dashboard/assistant",
    },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`sidebar ${
          mobileOpen ? "sidebar-mobile-open" : ""
        }`}
      >

        {/* Logo */}
        <div className="sidebar-header">

          <div className="sidebar-logo">
            🌱
          </div>

          <div className="sidebar-brand">
            <strong>KrishiSetu</strong>
            <span>Smart Agriculture</span>
          </div>

          <button
            className="sidebar-close"
            onClick={() => setMobileOpen(false)}
          >
            <X size={21} />
          </button>

        </div>


        {/* Main Navigation */}
        <div className="sidebar-section">

          <span className="sidebar-title">
            MAIN MENU
          </span>

          <nav className="sidebar-nav">

            {menuItems.map((item) => {

              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/dashboard"}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `sidebar-link ${
                      isActive ? "active" : ""
                    }`
                  }
                >

                  <Icon size={19} />

                  <span>{item.label}</span>

                </NavLink>
              );

            })}

          </nav>

        </div>


        {/* Bottom */}
        <div className="sidebar-bottom">

          <span className="sidebar-title">
            ACCOUNT
          </span>

          <NavLink
            to="/dashboard/profile"
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `sidebar-link ${
                isActive ? "active" : ""
              }`
            }
          >
            <User size={19} />
            <span>Profile</span>
          </NavLink>

          <button className="sidebar-link sidebar-button">
            <Settings size={19} />
            <span>Settings</span>
          </button>

          <button className="sidebar-link sidebar-button logout">
            <LogOut size={19} />
            <span>Logout</span>
          </button>

        </div>


        {/* Farmer mini profile */}
        <div className="sidebar-profile">

          <div className="profile-avatar">
            R
          </div>

          <div className="profile-info">
            <strong>Ramesh Kumar</strong>
            <span>Farmer</span>
          </div>

        </div>

      </aside>
    </>
  );
}

export default Sidebar;