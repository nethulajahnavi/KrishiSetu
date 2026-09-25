import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.jsx";

import { MotionPreferenceProvider } from "./context/MotionPreferenceContext";
import { RoleThemeProvider } from "./context/RoleThemeProvider";

import "./index.css";
import "./App.css";
import "./styles/theme.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <MotionPreferenceProvider>
      <RoleThemeProvider>
        <App />
      </RoleThemeProvider>
    </MotionPreferenceProvider>
  </StrictMode>
);