import { useEffect, useState } from "react";
import {
  BarChart3,
  Bell,
  Bot,
  CloudSun,
  Handshake,
  LayoutDashboard,
  LogOut,
  PackageSearch,
  Settings,
  ShoppingBasket,
  Truck,
  User,
  Users,
  WalletCards,
  X,
  Leaf,
  ClipboardList,
  MapPinned,
  ShieldCheck,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";
import "./Sidebar.css";

function Sidebar({ mobileOpen, setMobileOpen }) {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

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
        console.error("Error reading logged-in user:", error);
        setUser(null);
      }
    }

    loadUser();

    window.addEventListener("storage", loadUser);

    return () => {
      window.removeEventListener("storage", loadUser);
    };
  }, []);

  const userName =
    user?.name ||
    user?.full_name ||
    user?.username ||
    "User";

  const userRole =
    user?.role ||
    localStorage.getItem("selectedRole") ||
    "Farmer";

  const normalizedRole = String(userRole)
    .toLowerCase()
    .replace(/[\s_-]+/g, "");

  const roleLabelMap = {
    farmer: "Farmer",
    buyer: "Buyer",
    transporter: "Transporter",
    admin: "Admin",
  };

  const displayRole =
    roleLabelMap[normalizedRole] || "Farmer";

  /*
   * =========================================================
   * ROLE-BASED WORKSPACE MENUS
   * =========================================================
   *
   * Farmer:
   * Decision making + market discovery
   *
   * Buyer:
   * Procurement + offers + transactions
   *
   * Transporter:
   * Jobs + active deliveries + logistics
   *
   * Admin:
   * Platform monitoring + users + transactions
   */

  const ROLE_MENUS = {
    farmer: [
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
    ],

    buyer: [
      {
        label: "Dashboard",
        icon: LayoutDashboard,
        path: "/dashboard",
      },
      {
        label: "Marketplace",
        icon: PackageSearch,
        path: "/dashboard/marketplace",
      },
      {
        label: "Requirements",
        icon: ClipboardList,
        path: "/dashboard/requirements",
      },
      {
        label: "Offers",
        icon: Handshake,
        path: "/dashboard/offers",
      },
      {
        label: "Transactions",
        icon: WalletCards,
        path: "/dashboard/transactions",
      },
      {
        label: "Logistics",
        icon: Truck,
        path: "/dashboard/logistics",
      },
    ],

    transporter: [
      {
        label: "Dashboard",
        icon: LayoutDashboard,
        path: "/dashboard",
      },
      {
        label: "Available Jobs",
        icon: PackageSearch,
        path: "/dashboard/jobs",
      },
      {
        label: "Active Deliveries",
        icon: Truck,
        path: "/dashboard/deliveries",
      },
      {
        label: "Routes",
        icon: MapPinned,
        path: "/dashboard/routes",
      },
      {
        label: "Completed Jobs",
        icon: ClipboardList,
        path: "/dashboard/completed-jobs",
      },
    ],

    admin: [
      {
        label: "Dashboard",
        icon: LayoutDashboard,
        path: "/dashboard",
      },
      {
        label: "Users",
        icon: Users,
        path: "/dashboard/users",
      },
      {
        label: "Verification",
        icon: ShieldCheck,
        path: "/dashboard/verification",
      },
      {
        label: "Transactions",
        icon: WalletCards,
        path: "/dashboard/transactions",
      },
      {
        label: "Logistics",
        icon: Truck,
        path: "/dashboard/logistics",
      },
      {
        label: "Notifications",
        icon: Bell,
        path: "/dashboard/notifications",
      },
    ],
  };

  const menuItems =
    ROLE_MENUS[normalizedRole] ||
    ROLE_MENUS.farmer;

  const avatarLetter =
    userName.trim().charAt(0).toUpperCase() || "U";

  const closeMobileSidebar = () => {
    if (setMobileOpen) {
      setMobileOpen(false);
    }
  };

  const handleSettings = (event) => {
    event.preventDefault();
    event.stopPropagation();

    closeMobileSidebar();

    navigate("/dashboard/settings");
  };

  const handleLogout = (event) => {
    console.log("🔥 LOGOUT HANDLER CALLED");
    event.preventDefault();
    event.stopPropagation();

    localStorage.removeItem("krishisetu_token");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("rememberMe");
    localStorage.removeItem("selectedRole");
    localStorage.removeItem("role");

    setUser(null);

    closeMobileSidebar();

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <>
      {mobileOpen && (
        <div
          className="sidebar-overlay"
          onClick={closeMobileSidebar}
        />
      )}

      <aside
        className={`sidebar ${
          mobileOpen ? "sidebar-mobile-open" : ""
        }`}
      >

        {/* =================================================
            BRAND
        ================================================= */}

        <div className="sidebar-header">

          <div className="sidebar-logo">
            <Leaf size={20} strokeWidth={2.2} />
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
            <X size={20} />
          </button>

        </div>


        {/* =================================================
            NAVIGATION
        ================================================= */}

        <div className="sidebar-section">

          <span className="sidebar-title">
            WORKSPACE
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
                  onClick={closeMobileSidebar}
                  className={({ isActive }) =>
                    `sidebar-link ${
                      isActive ? "active" : ""
                    }`
                  }
                >
                  <span className="sidebar-icon">
                    <Icon size={18} />
                  </span>

                  <span className="sidebar-link-label">
                    {item.label}
                  </span>
                </NavLink>
              );
            })}

          </nav>

        </div>


        {/* =================================================
            ACCOUNT
        ================================================= */}

        <div className="sidebar-bottom">

          <span className="sidebar-title">
            ACCOUNT
          </span>

          <NavLink
            to="/dashboard/profile"
            onClick={closeMobileSidebar}
            className={({ isActive }) =>
              `sidebar-link ${
                isActive ? "active" : ""
              }`
            }
          >
            <span className="sidebar-icon">
              <User size={18} />
            </span>

            <span className="sidebar-link-label">
              Profile
            </span>
          </NavLink>


          <button
            type="button"
            className="sidebar-link sidebar-button"
            onClick={handleSettings}
          >
            <span className="sidebar-icon">
              <Settings size={18} />
            </span>

            <span className="sidebar-link-label">
              Settings
            </span>
          </button>


          <button
            type="button"
            className="sidebar-link sidebar-button logout"
            onClick={handleLogout}
          >
            <span className="sidebar-icon">
              <LogOut size={18} />
            </span>

            <span className="sidebar-link-label">
              Logout
            </span>
          </button>

        </div>


        {/* =================================================
            USER PROFILE
        ================================================= */}

        <div className="sidebar-profile">

          <div className="profile-avatar">
            {avatarLetter}
          </div>

          <div className="profile-info">

            <strong>
              {userName}
            </strong>

            <span>
              {displayRole}
            </span>

          </div>

        </div>

      </aside>
    </>
  );
}

export default Sidebar;