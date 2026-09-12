import {
  Bell,
  ChevronDown,
  Menu,
  Search,
} from "lucide-react";

import "./Navbar.css";

function Navbar({ onMenuClick }) {
  // Get logged-in user
  let user = null;

  try {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      user = JSON.parse(storedUser);
    }
  } catch (error) {
    console.error("Error reading logged-in user:", error);
  }

  // Support both `name` and possible `full_name`
  const userName =
    user?.name ||
    user?.full_name ||
    "Farmer";

  const userRole =
    user?.role ||
    "Farmer";

  // Generate avatar from user's actual name
  const avatarLetter =
    userName.trim().charAt(0).toUpperCase();

  return (
    <header className="navbar">

      {/* Mobile menu */}
      <button
        className="mobile-menu-button"
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        <Menu size={22} />
      </button>


      {/* Search */}
      <div className="navbar-search">

        <Search size={18} />

        <input
          type="text"
          placeholder="Search KrishiSetu..."
        />

        <span className="search-shortcut">
          /
        </span>

      </div>


      {/* Right side */}
      <div className="navbar-actions">

        {/* Notifications */}
        <button
          className="notification-button"
          aria-label="Notifications"
        >
          <Bell size={20} />
          <span className="notification-dot" />
        </button>


        {/* User */}
        <div className="navbar-user">

          <div className="navbar-avatar">
            {avatarLetter}
          </div>

          <div className="navbar-user-info">

            <strong>
              {userName}
            </strong>

            <span>
              {userRole}
            </span>

          </div>

          <ChevronDown size={16} />

        </div>

      </div>

    </header>
  );
}

export default Navbar;