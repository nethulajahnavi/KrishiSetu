import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  Settings,
  Volume2,
  VolumeX,
  User,
  X,
} from "lucide-react";
import "./Navbar.css";

const ROLE_CONFIG = {
  admin: {
    label: "Admin",
    color: "#1565C0",
    soft: "#EAF2FF",
  },
  farmer: {
    label: "Farmer",
    color: "#2E7D32",
    soft: "#EAF7EA",
  },
  buyer: {
    label: "Buyer",
    color: "#FB8C00",
    soft: "#FFF4E5",
  },
  fpo: {
    label: "FPO",
    color: "#00897B",
    soft: "#E7F8F5",
  },
  transporter: {
    label: "Transporter",
    color: "#7B1FA2",
    soft: "#F5EAF9",
  },
};

const PAGE_TITLES = {
  "/dashboard": "Dashboard",
  "/dashboard/market-prices": "Market Prices",
  "/dashboard/net-realisation": "Net Realisation",
  "/dashboard/buyer-matching": "Buyer Matching",
  "/dashboard/buyer-trust": "Buyer Trust",
  "/dashboard/logistics": "Logistics",
  "/dashboard/weather": "Weather",
  "/dashboard/assistant": "Assistant",
  "/dashboard/profile": "Profile",
  "/dashboard/settings": "Settings",
  "/dashboard/transactions": "Transactions",
};

function getStoredRole() {
  const role =
    localStorage.getItem("selectedRole") ||
    localStorage.getItem("role") ||
    "farmer";

  return role.toLowerCase().replace(/[\s_-]+/g, "");
}

function getPageTitle() {
  const path = window.location.pathname;

  if (PAGE_TITLES[path]) {
    return PAGE_TITLES[path];
  }

  const lastPart = path.split("/").filter(Boolean).pop();

  if (!lastPart) {
    return "Dashboard";
  }

  return lastPart
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function Navbar({ onMenuClick }) {
  const [role, setRole] = useState(getStoredRole());
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const [soundEnabled, setSoundEnabled] = useState(() => {
    const saved = localStorage.getItem("krishisetu_sound");

    return saved === null ? true : saved === "true";
  });

  const roleConfig = ROLE_CONFIG[role] || ROLE_CONFIG.farmer;

  const pageTitle = useMemo(() => getPageTitle(), []);

  useEffect(() => {
    const updateRole = () => {
      setRole(getStoredRole());
    };

    window.addEventListener("storage", updateRole);

    return () => {
      window.removeEventListener("storage", updateRole);
    };
  }, []);

  const toggleSound = () => {
    const newValue = !soundEnabled;

    setSoundEnabled(newValue);
    localStorage.setItem("krishisetu_sound", String(newValue));
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("token");
    localStorage.removeItem("selectedRole");
    localStorage.removeItem("role");

    window.location.href = "/login";
  };

  const closeMenus = () => {
    setNotificationsOpen(false);
    setProfileOpen(false);
  };

  return (
    <header
      className="navbar"
      style={{
        "--role-color": roleConfig.color,
        "--role-soft": roleConfig.soft,
      }}
    >
      {/* Mobile menu */}
      <button
        className="navbar-menu-button"
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        <Menu size={22} />
      </button>

      {/* Page information */}
      <div className="navbar-page-info">
        <div
          className="navbar-page-accent"
          style={{ background: roleConfig.color }}
        />

        <div>
          <h1>{pageTitle}</h1>
          <p>KrishiSetu agricultural marketplace</p>
        </div>
      </div>

      {/* Right side */}
      <div className="navbar-actions">
        {/* Role */}
        <div
          className="navbar-role"
          style={{
            background: roleConfig.soft,
            color: roleConfig.color,
          }}
        >
          <span
            className="navbar-role-dot"
            style={{ background: roleConfig.color }}
          />

          <span>{roleConfig.label}</span>
        </div>

        {/* Sound */}
        <button
          className="navbar-icon-button"
          onClick={toggleSound}
          title={soundEnabled ? "Sound on" : "Sound off"}
          aria-label={soundEnabled ? "Turn sound off" : "Turn sound on"}
        >
          {soundEnabled ? (
            <Volume2 size={19} />
          ) : (
            <VolumeX size={19} />
          )}
        </button>

        {/* Notifications */}
        <div className="navbar-dropdown-wrapper">
          <button
            className={`navbar-icon-button ${
              notificationsOpen ? "active" : ""
            }`}
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              setProfileOpen(false);
            }}
            aria-label="Notifications"
          >
            <Bell size={19} />

            <span className="notification-badge">3</span>
          </button>

          {notificationsOpen && (
            <div className="navbar-dropdown notification-dropdown">
              <div className="dropdown-header">
                <div>
                  <h3>Notifications</h3>
                  <span>3 new updates</span>
                </div>

                <button onClick={closeMenus}>
                  <X size={16} />
                </button>
              </div>

              <div className="notification-list">
                <div className="notification-item">
                  <div
                    className="notification-icon"
                    style={{
                      background: roleConfig.soft,
                      color: roleConfig.color,
                    }}
                  >
                    <Bell size={16} />
                  </div>

                  <div>
                    <strong>Market price updated</strong>
                    <p>New market prices are available.</p>
                    <span>Just now</span>
                  </div>
                </div>

                <div className="notification-item">
                  <div className="notification-icon notification-blue">
                    <Settings size={16} />
                  </div>

                  <div>
                    <strong>KrishiSetu update</strong>
                    <p>Your marketplace data has been refreshed.</p>
                    <span>10 min ago</span>
                  </div>
                </div>

                <div className="notification-item">
                  <div className="notification-icon notification-orange">
                    <Bell size={16} />
                  </div>

                  <div>
                    <strong>New recommendation</strong>
                    <p>A new market recommendation is available.</p>
                    <span>30 min ago</span>
                  </div>
                </div>
              </div>

              <button className="view-all-notifications">
                View all notifications
              </button>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="navbar-dropdown-wrapper">
          <button
            className={`navbar-profile-button ${
              profileOpen ? "active" : ""
            }`}
            onClick={() => {
              setProfileOpen(!profileOpen);
              setNotificationsOpen(false);
            }}
          >
            <div
              className="navbar-avatar"
              style={{
                background: roleConfig.soft,
                color: roleConfig.color,
              }}
            >
              <User size={18} />
            </div>

            <div className="navbar-user-info">
              <strong>My Account</strong>
              <span>{roleConfig.label}</span>
            </div>

            <ChevronDown
              className={`profile-chevron ${
                profileOpen ? "rotate" : ""
              }`}
              size={17}
            />
          </button>

          {profileOpen && (
            <div className="navbar-dropdown profile-dropdown">
              <div className="profile-dropdown-header">
                <div
                  className="large-avatar"
                  style={{
                    background: roleConfig.soft,
                    color: roleConfig.color,
                  }}
                >
                  <User size={22} />
                </div>

                <div>
                  <strong>My Account</strong>
                  <span>{roleConfig.label}</span>
                </div>
              </div>

              <div className="profile-menu">
                <button
                  onClick={() => {
                    window.location.href = "/dashboard/profile";
                  }}
                >
                  <User size={17} />
                  <span>Profile</span>
                </button>

                <button
                  onClick={() => {
                    window.location.href = "/dashboard/settings";
                  }}
                >
                  <Settings size={17} />
                  <span>Settings</span>
                </button>

                <div className="profile-divider" />

                <button
                  className="logout-button"
                  onClick={handleLogout}
                >
                  <LogOut size={17} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;