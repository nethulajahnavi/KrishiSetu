import { useEffect, useState } from "react";
import {
  BarChart3,
  Bot,
  CloudSun,
  Handshake,
  LayoutDashboard,
  LogOut,
  Settings,
  ShoppingBasket,
  Truck,
  User,
  X,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";

import "./Sidebar.css";

function Sidebar({ mobileOpen, setMobileOpen }) {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  // Load logged-in user
  useEffect(() => {
    function loadUser() {
      try {
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error(
          "Error reading logged-in user:",
          error
        );

        setUser(null);
      }
    }

    loadUser();

    window.addEventListener("storage", loadUser);

    return () => {
      window.removeEventListener("storage", loadUser);
    };
  }, []);

  // Main menu
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

  // User information
  const userName =
    user?.name ||
    user?.full_name ||
    user?.username ||
    "Farmer";

  const userRole =
    user?.role ||
    "Farmer";

  const avatarLetter =
    userName.trim().charAt(0).toUpperCase() || "F";

  // Close mobile sidebar
  const closeMobileSidebar = () => {
    if (setMobileOpen) {
      setMobileOpen(false);
    }
  };

  // SETTINGS
  const handleSettings = (event) => {
    event.preventDefault();
    event.stopPropagation();

    closeMobileSidebar();

    navigate("/dashboard/settings");
  };

  // LOGOUT
  const handleLogout = (event) => {
    event.preventDefault();
    event.stopPropagation();

    // Remove authentication information
    localStorage.removeItem("krishisetu_token");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("rememberMe");
    localStorage.removeItem("selectedRole");

    setUser(null);

    closeMobileSidebar();

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="sidebar-overlay"
          onClick={closeMobileSidebar}
        />
      )}

      <aside
        className={`sidebar ${
          mobileOpen
            ? "sidebar-mobile-open"
            : ""
        }`}
      >

        {/* Logo */}
        <div className="sidebar-header">

          <div className="sidebar-logo">
            🌱
          </div>

          <div className="sidebar-brand">
            <strong>KrishiSetu</strong>

            <span>
              Smart Agriculture
            </span>
          </div>

          <button
            type="button"
            className="sidebar-close"
            onClick={closeMobileSidebar}
            aria-label="Close menu"
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
                  end={
                    item.path === "/dashboard"
                  }
                  onClick={
                    closeMobileSidebar
                  }
                  className={({ isActive }) =>
                    `sidebar-link ${
                      isActive
                        ? "active"
                        : ""
                    }`
                  }
                >
                  <Icon size={19} />

                  <span>
                    {item.label}
                  </span>
                </NavLink>
              );
            })}

          </nav>

        </div>


        {/* Account */}
        <div className="sidebar-bottom">

          <span className="sidebar-title">
            ACCOUNT
          </span>


          {/* Profile */}
          <NavLink
            to="/dashboard/profile"
            onClick={
              closeMobileSidebar
            }
            className={({ isActive }) =>
              `sidebar-link ${
                isActive
                  ? "active"
                  : ""
              }`
            }
          >
            <User size={19} />

            <span>
              Profile
            </span>
          </NavLink>


          {/* Settings */}
          <button
            type="button"
            className="sidebar-link sidebar-button"
            onClick={handleSettings}
          >
            <Settings size={19} />

            <span>
              Settings
            </span>
          </button>


          {/* Logout */}
          <button
            type="button"
            className="sidebar-link sidebar-button logout"
            onClick={handleLogout}
          >
            <LogOut size={19} />

            <span>
              Logout
            </span>
          </button>

        </div>


        {/* Logged-in user */}
        <div className="sidebar-profile">

          <div className="profile-avatar">
            {avatarLetter}
          </div>

          <div className="profile-info">

            <strong>
              {userName}
            </strong>

            <span>
              {userRole}
            </span>

          </div>

        </div>

      </aside>
    </>
  );
}

export default Sidebar;