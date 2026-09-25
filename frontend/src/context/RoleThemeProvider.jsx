import { createContext, useContext, useEffect, useState } from "react";
import { MotionConfig } from "framer-motion";
import { useMotionPreference } from "./MotionPreferenceContext";

const RoleThemeContext = createContext(null);

const ROLE_CONFIG = {
  farmer: {
    label: "Farmer",
    primary: "#2E7D32",
    primaryDark: "#1B5E20",
  },

  buyer: {
    label: "Buyer",
    primary: "#FB8C00",
    primaryDark: "#E65100",
  },

  transporter: {
    label: "Transporter",
    primary: "#7B1FA2",
    primaryDark: "#4A148C",
  },

  admin: {
    label: "Admin",
    primary: "#334155",
    primaryDark: "#1E293B",
  },
};

function normalizeRole(role) {
  return String(role || "farmer")
    .toLowerCase()
    .replace(/[\s_-]+/g, "");
}

function getStoredRole() {
  try {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const user = JSON.parse(storedUser);

      if (user?.role) {
        return normalizeRole(user.role);
      }
    }
  } catch (error) {
    console.error("Unable to read stored user:", error);
  }

  const selectedRole =
    localStorage.getItem("selectedRole") ||
    localStorage.getItem("role");

  return normalizeRole(selectedRole);
}

export function RoleThemeProvider({ children }) {
  const [role, setRole] = useState(getStoredRole);

  const { reduced, systemReduced, manualLite } =
    useMotionPreference();

  useEffect(() => {
    const updateRole = () => {
      setRole(getStoredRole());
    };

    updateRole();

    window.addEventListener("storage", updateRole);

    return () => {
      window.removeEventListener("storage", updateRole);
    };
  }, []);

  const normalizedRole =
    ROLE_CONFIG[role] ? role : "farmer";

  const theme = ROLE_CONFIG[normalizedRole];

  useEffect(() => {
    document.documentElement.dataset.role = normalizedRole;

    document.documentElement.dataset.motion =
      reduced ? "reduced" : "full";

    return () => {
      delete document.documentElement.dataset.role;
      delete document.documentElement.dataset.motion;
    };
  }, [normalizedRole, reduced]);

  const contextValue = {
    role: normalizedRole,
    theme,
  };

  /*
   * MotionConfig controls Framer Motion globally.
   *
   * Manual Lite Mode:
   *   always reduce motion
   *
   * System Reduced Motion:
   *   respect user's OS preference
   *
   * Normal:
   *   normal animations
   */
  const reducedMotionMode = manualLite
    ? "always"
    : systemReduced
      ? "user"
      : "never";

  return (
    <RoleThemeContext.Provider value={contextValue}>
      <MotionConfig reducedMotion={reducedMotionMode}>
        {children}
      </MotionConfig>
    </RoleThemeContext.Provider>
  );
}

export function useRoleTheme() {
  const context = useContext(RoleThemeContext);

  if (!context) {
    return {
      role: "farmer",
      theme: ROLE_CONFIG.farmer,
    };
  }

  return context;
}