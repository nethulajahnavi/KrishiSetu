import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Leaf,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  ShoppingCart,
  Sprout,
  Truck,
  Users,
  User,
} from "lucide-react";
import "./Register.css";

const ROLES = {
  FARMER: {
    label: "Farmer",
    description: "Sell produce & find better markets",
    icon: Sprout,
    primary: "#2E7D32",
    primaryDark: "#1B5E20",
    light: "#E8F5E9",

    badge: "Join the smart farming network",
    title: "Your farm.",
    highlight: "Your decisions.",
    descriptionText:
      "Get better market insights, understand your real earnings, find trusted buyers and make smarter selling decisions.",

    benefits: [
      ["₹", "Know your real value", "Calculate your expected net realisation."],
      ["✓", "Find trusted buyers", "Make transactions with more confidence."],
      ["AI", "Get intelligent guidance", "Ask KrishiSetu AI whenever you need help."],
    ],
  },

  BUYER: {
    label: "Buyer",
    description: "Source quality produce",
    icon: ShoppingCart,
    primary: "#F57C00",
    primaryDark: "#E65100",
    light: "#FFF3E0",

    badge: "Join the smart procurement network",
    title: "Better sourcing.",
    highlight: "Better decisions.",
    descriptionText:
      "Discover quality produce, connect with trusted sellers and make smarter procurement decisions.",

    benefits: [
      ["✓", "Find quality produce", "Discover produce that matches your requirements."],
      ["₹", "Compare landed costs", "Understand the real cost before procurement."],
      ["AI", "Get intelligent guidance", "Make better sourcing decisions with KrishiSetu AI."],
    ],
  },

  FPO: {
    label: "FPO",
    description: "Aggregate produce collectively",
    icon: Users,
    primary: "#00897B",
    primaryDark: "#00695C",
    light: "#E0F2F1",

    badge: "Build a stronger farmer network",
    title: "Together.",
    highlight: "Stronger markets.",
    descriptionText:
      "Aggregate member produce, discover better markets and improve collective realisation.",

    benefits: [
      ["👥", "Aggregate produce", "Bring farmer produce together efficiently."],
      ["₹", "Improve realisation", "Compare markets and identify better opportunities."],
      ["AI", "Get intelligent guidance", "Use data-driven insights for better decisions."],
    ],
  },

  TRANSPORTER: {
    label: "Transporter",
    description: "Move produce efficiently",
    icon: Truck,
    primary: "#7B1FA2",
    primaryDark: "#4A148C",
    light: "#F3E5F5",

    badge: "Join the agricultural logistics network",
    title: "Every route.",
    highlight: "Every load.",
    descriptionText:
      "Connect with farmers and buyers, manage routes and help agricultural produce move efficiently.",

    benefits: [
      ["🚚", "Find transport opportunities", "Connect with farmers and buyers who need logistics."],
      ["₹", "Manage transport costs", "Understand routes and transportation requirements."],
      ["AI", "Get intelligent guidance", "Make smarter logistics decisions with KrishiSetu AI."],
    ],
  },
};

function Register() {
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState(
    localStorage.getItem("selectedRole") || "FARMER"
  );

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const role = ROLES[selectedRole];
  const RoleIcon = role.icon;

  const handleRoleChange = (roleName) => {
    setSelectedRole(roleName);
    localStorage.setItem("selectedRole", roleName);
    setError("");
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!formData.phone.trim()) {
      setError("Please enter your phone number.");
      return;
    }

    if (!formData.email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!agreeTerms) {
      setError("Please agree to the KrishiSetu terms and privacy policy.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://127.0.0.1:8000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            password: formData.password,
            role: selectedRole,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        let message = "Registration failed.";

        if (typeof data.detail === "string") {
          message = data.detail;
        } else if (Array.isArray(data.detail)) {
          message = data.detail
            .map((item) => item.msg)
            .filter(Boolean)
            .join(", ");
        }

        throw new Error(message);
      }

      setSuccess("Account created successfully! Redirecting to login...");

      localStorage.setItem("selectedRole", selectedRole);

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err) {
      setError(
        err.message ||
          "Unable to connect to the server. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="register-page"
      style={{
        "--register-primary": role.primary,
        "--register-primary-dark": role.primaryDark,
        "--register-light": role.light,
      }}
    >
      {/* =========================================
          LEFT VISUAL
      ========================================= */}

      <section className="register-visual">
        <div className="register-overlay" />

        <div className="register-visual-content">
          <div className="register-brand">
            <div className="register-brand-icon">
              <Leaf size={25} />
            </div>

            <span>KrishiSetu</span>
          </div>

          <div className="register-message">
            <div className="register-badge">
              <CheckCircle2 size={16} />
              <span>{role.badge}</span>
            </div>

            <h1>
              {role.title}
              <br />
              <span>{role.highlight}</span>
            </h1>

            <p>{role.descriptionText}</p>

            <div className="register-benefits">
              {role.benefits.map(([icon, title, text]) => (
                <div className="benefit" key={title}>
                  <div className="benefit-icon">{icon}</div>

                  <div>
                    <strong>{title}</strong>
                    <p>{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="register-footer">
            Built for Indian agriculture • Powered by technology 🌱
          </div>
        </div>
      </section>

      {/* =========================================
          RIGHT REGISTER FORM
      ========================================= */}

      <section className="register-section">
        <div className="register-card">

          <div className="register-mobile-brand">
            <div className="register-brand-icon">
              <Leaf size={22} />
            </div>

            <span>KrishiSetu</span>
          </div>

          <div className="register-header">
            <span className="register-eyebrow">
              GET STARTED
            </span>

            <h2>Create your account</h2>

            <p>
              Join KrishiSetu and start making smarter agricultural decisions.
            </p>
          </div>

          {/* ROLE SELECTOR */}

          <div className="register-role-section">
            <label className="register-section-label">
              Register as
            </label>

            <div className="register-role-grid">
              {Object.entries(ROLES).map(([key, item]) => {
                const Icon = item.icon;
                const selected = selectedRole === key;

                return (
                  <button
                    type="button"
                    key={key}
                    className={`register-role-card ${
                      selected ? "selected" : ""
                    }`}
                    onClick={() => handleRoleChange(key)}
                    style={
                      selected
                        ? {
                            "--role-color": item.primary,
                            "--role-light": item.light,
                          }
                        : {}
                    }
                  >
                    <div className="register-role-icon">
                      <Icon size={21} />
                    </div>

                    <div className="register-role-text">
                      <strong>{item.label}</strong>
                      <span>{item.description}</span>
                    </div>

                    {selected && (
                      <div className="register-selected-check">
                        <CheckCircle2 size={17} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {error && (
            <div className="register-message-box register-error">
              <span>!</span>
              <p>{error}</p>
            </div>
          )}

          {success && (
            <div className="register-message-box register-success">
              <CheckCircle2 size={18} />
              <p>{success}</p>
            </div>
          )}

          <form
            className="register-form"
            onSubmit={handleSubmit}
          >
            {/* NAME */}

            <div className="register-input-group">
              <label htmlFor="name">Full Name</label>

              <div className="register-input">
                <User size={19} />

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  autoComplete="name"
                />
              </div>
            </div>

            {/* PHONE */}

            <div className="register-input-group">
              <label htmlFor="phone">Phone Number</label>

              <div className="register-input">
                <Phone size={19} />

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  autoComplete="tel"
                />
              </div>
            </div>

            {/* EMAIL */}

            <div className="register-input-group">
              <label htmlFor="email">Email Address</label>

              <div className="register-input">
                <Mail size={19} />

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* PASSWORD */}

            <div className="register-input-group">
              <label htmlFor="password">Password</label>

              <div className="register-input">
                <Lock size={19} />

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword((prev) => !prev)
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>
            </div>

            {/* CONFIRM PASSWORD */}

            <div className="register-input-group">
              <label htmlFor="confirmPassword">
                Confirm Password
              </label>

              <div className="register-input">
                <Lock size={19} />

                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowConfirmPassword((prev) => !prev)
                  }
                  aria-label={
                    showConfirmPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>
            </div>

            {/* TERMS */}

            <label className="terms">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) =>
                  setAgreeTerms(e.target.checked)
                }
              />

              <span>
                I agree to the KrishiSetu terms and privacy
                policy.
              </span>
            </label>

            {/* SUBMIT */}

            <button
              type="submit"
              className="register-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="register-spinner" />
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight size={19} />
                </>
              )}
            </button>
          </form>

          <div className="login-link">
            Already have an account?
            <Link to="/login">Sign in</Link>
          </div>

          <div className="register-security">
            <ShieldCheck size={17} />

            <div>
              <strong>Your information is secure</strong>
              <span>
                Your account details are protected by KrishiSetu.
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Register;