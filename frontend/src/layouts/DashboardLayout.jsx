import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import "./DashboardLayout.css";

function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState(null);

  /*
   * Load the logged-in user.
   *
   * The role is stored by Login.jsx in:
   *
   * localStorage.user
   *
   * and:
   *
   * localStorage.selectedRole
   */

  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser =
          localStorage.getItem("user");

        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error(
          "Unable to load logged-in user:",
          error
        );

        setUser(null);
      }
    };

    loadUser();

    window.addEventListener(
      "storage",
      loadUser
    );

    return () => {
      window.removeEventListener(
        "storage",
        loadUser
      );
    };
  }, []);


  /*
   * Determine current role.
   *
   * Examples:
   *
   * FARMER      -> role-farmer
   * FPO         -> role-fpo
   * BUYER       -> role-buyer
   * TRANSPORTER -> role-transporter
   * ADMIN       -> role-admin
   */

  const role =
    user?.role ||
    localStorage.getItem("selectedRole") ||
    "FARMER";

  const normalizedRole =
    String(role).toLowerCase();


  return (
    <div
      className={`dashboard-layout role-${normalizedRole}`}
    >

      {/* =====================================================
          SUBTLE ROLE ATMOSPHERE

          This does NOT recolour the dashboard.

          It only creates a very soft role-specific glow.
      ===================================================== */}

      <div className="dashboard-atmosphere" />


      {/* SIDEBAR */}

      <Sidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />


      {/* MAIN DASHBOARD */}

      <div className="dashboard-main">

        <Navbar
          onMenuClick={() =>
            setMobileOpen(true)
          }
        />

        <main className="dashboard-content">
          <Outlet />
        </main>

      </div>

    </div>
  );
}

export default DashboardLayout;