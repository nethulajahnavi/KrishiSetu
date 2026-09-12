import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Leaf,
  Lock,
  Mail,
} from "lucide-react";

import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");

  const [rememberMe, setRememberMe] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();

    setError("");

    // Basic validation
    if (!emailOrPhone.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      /*
       * FastAPI OAuth2PasswordRequestForm expects:
       *
       * username
       * password
       *
       * with application/x-www-form-urlencoded
       */

      const formData = new URLSearchParams();

      formData.append(
        "username",
        emailOrPhone.trim()
      );

      formData.append(
        "password",
        password
      );

      const response = await fetch(
        "http://127.0.0.1:8000/api/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/x-www-form-urlencoded",
          },

          body: formData,
        }
      );

      const data = await response.json();

      console.log("Login response:", data);

      if (!response.ok) {
        let errorMessage = "Login failed.";

        if (typeof data?.detail === "string") {
          errorMessage = data.detail;
        } else if (Array.isArray(data?.detail)) {
          errorMessage = data.detail
            .map((item) => item.msg)
            .join(", ");
        }

        throw new Error(errorMessage);
      }

      /*
       * Backend response:
       *
       * {
       *   access_token: "...",
       *   token_type: "bearer",
       *   user: {
       *     id,
       *     name,
       *     email,
       *     phone,
       *     role
       *   }
       * }
       */

      if (!data.access_token) {
        throw new Error(
          "Login succeeded but no access token was received."
        );
      }

      if (!data.user) {
        throw new Error(
          "Login succeeded but user information was not received."
        );
      }

      /*
       * SAVE TOKEN
       */
      localStorage.setItem(
        "token",
        data.access_token
      );

      /*
       * SAVE ACTUAL REGISTERED USER
       *
       * Navbar.jsx and Profile.jsx will
       * read this information.
       */
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      /*
       * Optional: save remember-me preference
       */
      localStorage.setItem(
        "rememberMe",
        rememberMe ? "true" : "false"
      );

      console.log(
        "Logged-in user:",
        data.user
      );

      /*
       * Go to dashboard
       */
      navigate("/dashboard", {
        replace: true,
      });

    } catch (err) {
      console.error(
        "Login error:",
        err
      );

      setError(
        err.message ||
        "Unable to login. Please try again."
      );

    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">

      {/* =========================
          LEFT HERO SECTION
      ========================== */}

      <section className="login-hero">

        <div className="hero-overlay">

          {/* Brand */}

          <div className="brand">

            <div className="brand-icon">
              <Leaf size={24} />
            </div>

            <span>
              KrishiSetu
            </span>

          </div>


          {/* Hero content */}

          <div className="hero-content">

            <span className="hero-badge">

              <Leaf size={15} />

              Smart Agriculture Platform

            </span>


            <h1>

              Grow smarter.

              <br />

              <span>
                Sell better.
              </span>

            </h1>


            <p>
              One intelligent platform connecting
              farmers with better markets, trusted
              buyers, logistics and smarter decisions.
            </p>


            <div className="hero-features">

              <div>
                <strong>₹</strong>

                <span>
                  Better price discovery
                </span>
              </div>


              <div>
                <strong>✓</strong>

                <span>
                  Trusted buyers
                </span>
              </div>


              <div>
                <strong>AI</strong>

                <span>
                  Smart recommendations
                </span>
              </div>

            </div>

          </div>


          {/* Footer */}

          <p className="hero-footer">
            Empowering farmers through technology 🌱
          </p>

        </div>

      </section>


      {/* =========================
          LOGIN SECTION
      ========================== */}

      <section className="login-section">

        <div className="login-card">


          {/* Mobile brand */}

          <div className="mobile-brand">

            <div className="brand-icon">
              <Leaf size={22} />
            </div>

            <span>
              KrishiSetu
            </span>

          </div>


          {/* Header */}

          <div className="login-header">

            <h2>
              Welcome back 👋
            </h2>

            <p>
              Sign in to access your farmer dashboard
            </p>

          </div>


          {/* Login form */}

          <form onSubmit={handleLogin}>

            {/* EMAIL */}

            <div className="input-group">

              <label>
                Email
              </label>

              <div className="input-wrapper">

                <Mail size={19} />

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={emailOrPhone}
                  onChange={(e) =>
                    setEmailOrPhone(
                      e.target.value
                    )
                  }
                  autoComplete="email"
                  disabled={loading}
                />

              </div>

            </div>


            {/* PASSWORD */}

            <div className="input-group">

              <div className="password-label">

                <label>
                  Password
                </label>

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  disabled={loading}
                >
                  {showPassword
                    ? "Hide"
                    : "Show"}
                </button>

              </div>


              <div className="input-wrapper">

                <Lock size={19} />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                  autoComplete="current-password"
                  disabled={loading}
                />

              </div>

            </div>


            {/* ERROR */}

            {error && (
              <div
                style={{
                  marginTop: "10px",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  background: "#fff1f1",
                  color: "#c62828",
                  fontSize: "14px",
                }}
              >
                {error}
              </div>
            )}


            {/* OPTIONS */}

            <div className="login-options">

              <label>

                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) =>
                    setRememberMe(
                      e.target.checked
                    )
                  }
                  disabled={loading}
                />

                <span>
                  Remember me
                </span>

              </label>


              <button
                type="button"
                onClick={() =>
                  setError(
                    "Password recovery will be available soon."
                  )
                }
              >
                Forgot password?
              </button>

            </div>


            {/* LOGIN BUTTON */}

            <button
              className="login-button"
              type="submit"
              disabled={loading}
            >

              {loading
                ? "Signing in..."
                : "Sign in"}

              {!loading && (
                <ArrowRight size={19} />
              )}

            </button>

          </form>


          {/* REGISTER */}

          <div className="register-text">

            Don't have an account?

            <Link to="/register">
              Create one
            </Link>

          </div>

        </div>

      </section>

    </div>
  );
}

export default Login;