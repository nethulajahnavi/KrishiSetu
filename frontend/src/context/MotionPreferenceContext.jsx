import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const MotionPreferenceContext = createContext(null);

const STORAGE_KEY = "krishisetu_lite_mode";

function getInitialLiteMode() {
  try {
    return localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

export function MotionPreferenceProvider({ children }) {
  const [systemReduced, setSystemReduced] = useState(false);
  const [manualLite, setManualLite] = useState(getInitialLiteMode);

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    const updatePreference = () => {
      setSystemReduced(mediaQuery.matches);
    };

    updatePreference();

    mediaQuery.addEventListener("change", updatePreference);

    return () => {
      mediaQuery.removeEventListener(
        "change",
        updatePreference
      );
    };
  }, []);

  const reduced = systemReduced || manualLite;

  const toggleLiteMode = () => {
    setManualLite((previous) => {
      const next = !previous;

      try {
        localStorage.setItem(
          STORAGE_KEY,
          String(next)
        );
      } catch {
        // Ignore storage errors.
      }

      return next;
    });
  };

  return (
    <MotionPreferenceContext.Provider
      value={{
        reduced,
        systemReduced,
        manualLite,
        toggleLiteMode,
      }}
    >
      {children}
    </MotionPreferenceContext.Provider>
  );
}

export function useMotionPreference() {
  const context = useContext(MotionPreferenceContext);

  if (!context) {
    return {
      reduced: false,
      systemReduced: false,
      manualLite: false,
      toggleLiteMode: () => {},
    };
  }

  return context;
}