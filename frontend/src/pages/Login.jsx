import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Leaf,
  Lock,
  Mail,
  ShieldCheck,
  ShoppingCart,
  Sprout,
  Truck,
  Users,
} from "lucide-react";

import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState("FARMER");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const roles = [
    {
      id: "ADMIN",
      title: "Admin",
      description: "Manage the platform",
      icon: ShieldCheck,

      eyebrow: "PLATFORM CONTROL CENTER",

      titleLine1: "Manage Smarter.",
      titleLine2: "Keep KrishiSetu",
      highlight: "Trusted.",

      descriptionText:
        "Monitor users, marketplace activity and platform operations from one secure control center.",

      panelTitle: "Platform Administration",
      panelText:
        "Manage users, verify activity and maintain a trusted agricultural marketplace.",

      theme: "admin",
    },

    {
      id: "FARMER",
      title: "Farmer",
      description: "Sell produce & find better markets",
      icon: Sprout,

      eyebrow: "YOUR FARM. YOUR OPPORTUNITY.",

      titleLine1: "From Your Farm",
      titleLine2: "to the",
      highlight: "Right Market.",

      descriptionText:
        "Discover better prices, trusted buyers and smarter routes to get more value from every harvest.",

      panelTitle: "Farmer Experience",
      panelText:
        "Compare markets, calculate net realisation and connect with trusted buyers.",

      theme: "farmer",
    },

    {
      id: "BUYER",
      title: "Buyer",
      description: "Source quality produce",
      icon: ShoppingCart,

      eyebrow: "SOURCE WITH CONFIDENCE.",

      titleLine1: "Find Quality.",
      titleLine2: "Buy at the",
      highlight: "Right Price.",

      descriptionText:
        "Connect with reliable farmers and FPOs, compare offers and simplify agricultural procurement.",

      panelTitle: "Buyer Marketplace",
      panelText:
        "Find trusted suppliers, compare offers and reduce your procurement cost.",

      theme: "buyer",
    },

    {
      id: "TRANSPORTER",
      title: "Transporter",
      description: "Move produce efficiently",
      icon: Truck,

      eyebrow: "MOVE SMART. DELIVER BETTER.",

      titleLine1: "The Right Route.",
      titleLine2: "The Right Load.",
      highlight: "The Right Time.",

      descriptionText:
        "Connect transport capacity with agricultural demand and make every journey more efficient.",

      panelTitle: "Smart Logistics",
      panelText:
        "Find transport opportunities, manage routes and help produce reach the right market.",

      theme: "transporter",
    },
  ];

  const activeRole =
    roles.find((role) => role.id === selectedRole) ||
    roles[1];

  const ActiveIcon = activeRole.icon;

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const body = new URLSearchParams();

      body.append("username", email);
      body.append("password", password);
      body.append("role", selectedRole);

      const response = await fetch(
        "http://127.0.0.1:8000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/x-www-form-urlencoded",
          },
          body: body.toString(),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof data.detail === "string"
            ? data.detail
            : "Incorrect email, password or role."
        );
      }

      const actualRole = String(
        data.user?.role || ""
      ).toUpperCase();

      if (actualRole !== selectedRole) {
        throw new Error(
          `This account is registered as ${actualRole}.`
        );
      }

      localStorage.setItem(
        "krishisetu_token",
        data.access_token
      );

      localStorage.setItem(
        "token",
        data.access_token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      localStorage.setItem(
        "selectedRole",
        selectedRole
      );

      localStorage.setItem(
        "rememberMe",
        String(rememberMe)
      );

      navigate("/dashboard");
    } catch (err) {
      setError(
        err.message ||
          "Unable to sign in. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`login-page role-${activeRole.theme}`}
      style={{
        "--role-primary": activeRole.primary,
      }}
    >
      {/* ==================================================
          LEFT SIDE
      ================================================== */}

      <section className="login-left">

        {/* Animated background */}

        <div className="background-effects">

          <div className="glow glow-one" />
          <div className="glow glow-two" />
          <div className="glow glow-three" />

          <div className="grid-overlay" />

          <span className="floating-dot dot-one" />
          <span className="floating-dot dot-two" />
          <span className="floating-dot dot-three" />
          <span className="floating-dot dot-four" />

          <div className="decor-ring ring-one" />
          <div className="decor-ring ring-two" />

        </div>


        <div className="left-content">

          {/* Brand */}

          <div className="brand">

            <div className="brand-logo">
              <Leaf size={32} />
            </div>

            <div>
              <h2>
                Krishi<span>Setu</span>
              </h2>

              <p>
                Right Market. Right Buyer. Right Price.
              </p>
            </div>

          </div>


          {/* Hero */}

          <div
            className="hero"
            key={selectedRole}
          >

            <div className="hero-eyebrow">
              {activeRole.eyebrow}
            </div>

            <h1>
              {activeRole.titleLine1}

              <br />

              {activeRole.titleLine2}{" "}

              <span>
                {activeRole.highlight}
              </span>
            </h1>

            <p>
              {activeRole.descriptionText}
            </p>

          </div>


          {/* Dynamic role card */}

          <div
            className="role-highlight"
            key={`highlight-${selectedRole}`}
          >

            <div className="role-highlight-icon">
              <ActiveIcon size={26} />
            </div>

            <div className="role-highlight-content">

              <small>
                {activeRole.title}
              </small>

              <strong>
                {activeRole.panelTitle}
              </strong>

              <p>
                {activeRole.panelText}
              </p>

            </div>

            <div className="active-indicator">
              <span />
              Active
            </div>

          </div>


          {/* Feature cards */}

          <div className="feature-grid">

            <div className="feature-card">

              <div className="feature-icon feature-green">
                <Sprout size={19} />
              </div>

              <div>
                <strong>Better Prices</strong>

                <span>
                  Discover better markets
                </span>
              </div>

            </div>


            <div className="feature-card">

              <div className="feature-icon feature-blue">
                <Users size={19} />
              </div>

              <div>
                <strong>Trusted Network</strong>

                <span>
                  Connect with verified users
                </span>
              </div>

            </div>


            <div className="feature-card">

              <div className="feature-icon feature-orange">
                <Truck size={19} />
              </div>

              <div>
                <strong>Smart Logistics</strong>

                <span>
                  Reduce delivery costs
                </span>
              </div>

            </div>

          </div>


          {/* Bottom statement */}

          <div className="left-bottom">

            <div className="check-circle">
              <Check size={13} />
            </div>

            <span>
              One connected ecosystem for India's
              agricultural marketplace
            </span>

          </div>

        </div>

      </section>


      {/* ==================================================
          RIGHT SIDE
      ================================================== */}

      <section className="login-right">

        <div className="login-card">

          <div className="card-accent" />


          {/* Small logo */}

          <div className="mini-logo">
            <Leaf size={21} />
          </div>


          {/* Header */}

          <div className="login-header">

            <div className="welcome">
              WELCOME BACK
            </div>

            <h2>
              Sign in to{" "}
              <span>KrishiSetu</span>
            </h2>

            <p>
              Continue your journey towards better
              markets and better opportunities.
            </p>

          </div>


          {/* Role selector */}

          <div className="role-section">

            <div className="section-label">
              Continue as
            </div>

            <div className="role-grid">

              {roles.map((role) => {

                const Icon = role.icon;

                const active =
                  selectedRole === role.id;

                return (
                  <button
                    key={role.id}
                    type="button"
                    className={`role-card ${
                      active ? "selected" : ""
                    }`}
                    onClick={() =>
                      handleRoleChange(role.id)
                    }
                  >

                    {active && (
                      <div className="selected-check">
                        <Check size={10} />
                      </div>
                    )}

                    <div className="role-card-icon">
                      <Icon size={18} />
                    </div>

                    <strong>
                      {role.title}
                    </strong>

                    <span>
                      {role.description}
                    </span>

                  </button>
                );

              })}

            </div>

          </div>


          {/* Error */}

          {error && (
            <div className="login-error">
              <span>!</span>
              {error}
            </div>
          )}


          {/* Login form */}

          <form
            className="login-form"
            onSubmit={handleLogin}
          >

            <div className="form-field">

              <label>
                Email or Phone Number
              </label>

              <div className="input-box">

                <Mail size={17} />

                <input
                  type="text"
                  placeholder="Enter your email or phone"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  required
                />

              </div>

            </div>


            <div className="form-field">

              <label>
                Password
              </label>

              <div className="input-box">

                <Lock size={17} />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  required
                />

                <button
                  type="button"
                  className="eye-button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                >
                  {showPassword ? (
                    <EyeOff size={17} />
                  ) : (
                    <Eye size={17} />
                  )}
                </button>

              </div>

            </div>


            <div className="form-options">

              <label className="remember">

                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) =>
                    setRememberMe(
                      e.target.checked
                    )
                  }
                />

                <span className="checkbox">
                  {rememberMe && (
                    <Check size={10} />
                  )}
                </span>

                Remember me

              </label>


              <button
                type="button"
                className="forgot"
              >
                Forgot password?
              </button>

            </div>


            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >

              {loading
                ? "Signing in..."
                : `Sign in as ${activeRole.title}`}

              {!loading && (
                <ArrowRight size={17} />
              )}

            </button>

          </form>


          {/* Register */}

          <div className="register-section">

            <div className="divider">
              <span />
              <small>
                New to KrishiSetu?
              </small>
              <span />
            </div>

            <Link
              to="/register"
              className="register-button"
            >
              Create an Account
              <ArrowRight size={16} />
            </Link>

          </div>


          {/* Security */}

          <div className="security">

            <div className="security-icon">
              <ShieldCheck size={18} />
            </div>

            <div>

              <strong>
                Your information is secure
              </strong>

              <span>
                Your account and marketplace
                information are protected.
              </span>

            </div>

          </div>

        </div>

      </section>

    </div>
  );
}

export default Login;