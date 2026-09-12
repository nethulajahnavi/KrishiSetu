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
  User,
} from "lucide-react";

import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    // Temporary navigation.
    // We will connect this to FastAPI later.
    navigate("/login");
  };

  return (
    <div className="register-page">

      {/* LEFT SIDE */}
      <section className="register-visual">

        <div className="register-visual-content">

          <div className="register-brand">
            <div className="register-brand-icon">
              <Leaf size={23} />
            </div>

            <span>KrishiSetu</span>
          </div>

          <div className="register-message">

            <span className="register-badge">
              <CheckCircle2 size={16} />
              Join the smart farming network
            </span>

            <h1>
              Your farm.
              <br />
              Your <span>decisions.</span>
            </h1>

            <p>
              Get better market insights, understand your real earnings,
              find trusted buyers and make smarter selling decisions.
            </p>

            <div className="register-benefits">

              <div className="benefit">
                <div className="benefit-icon">₹</div>

                <div>
                  <strong>Know your real value</strong>
                  <p>Calculate your expected net realisation.</p>
                </div>
              </div>

              <div className="benefit">
                <div className="benefit-icon">✓</div>

                <div>
                  <strong>Find trusted buyers</strong>
                  <p>Make transactions with more confidence.</p>
                </div>
              </div>

              <div className="benefit">
                <div className="benefit-icon">AI</div>

                <div>
                  <strong>Get intelligent guidance</strong>
                  <p>Ask KrishiSetu AI whenever you need help.</p>
                </div>
              </div>

            </div>

          </div>

          <div className="register-footer">
            Built for farmers • Powered by technology 🌱
          </div>

        </div>

      </section>


      {/* RIGHT SIDE */}
      <section className="register-section">

        <div className="register-card">

          {/* Mobile brand */}
          <div className="register-mobile-brand">

            <div className="register-brand-icon">
              <Leaf size={21} />
            </div>

            <span>KrishiSetu</span>

          </div>


          <div className="register-header">

            <h2>Create your account</h2>

            <p>
              Start making smarter agricultural decisions
            </p>

          </div>


          <form onSubmit={handleSubmit}>

            {/* NAME */}
            <div className="register-input-group">

              <label>Full Name</label>

              <div className="register-input">

                <User size={18} />

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />

              </div>

            </div>


            {/* PHONE */}
            <div className="register-input-group">

              <label>Phone Number</label>

              <div className="register-input">

                <Phone size={18} />

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  required
                />

              </div>

            </div>


            {/* EMAIL */}
            <div className="register-input-group">

              <label>Email Address</label>

              <div className="register-input">

                <Mail size={18} />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />

              </div>

            </div>


            {/* PASSWORD */}
            <div className="register-input-group">

              <label>Password</label>

              <div className="register-input">

                <Lock size={18} />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>

            </div>


            {/* CONFIRM PASSWORD */}
            <div className="register-input-group">

              <label>Confirm Password</label>

              <div className="register-input">

                <Lock size={18} />

                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>

            </div>


            {/* TERMS */}
            <label className="terms">

              <input type="checkbox" required />

              <span>
                I agree to the KrishiSetu terms and privacy policy.
              </span>

            </label>


            {/* SUBMIT */}
            <button
              type="submit"
              className="register-button"
            >
              Create Account

              <ArrowRight size={18} />
            </button>

          </form>


          <div className="login-link">

            Already have an account?

            <Link to="/login">
              Sign in
            </Link>

          </div>

        </div>

      </section>

    </div>
  );
}

export default Register;