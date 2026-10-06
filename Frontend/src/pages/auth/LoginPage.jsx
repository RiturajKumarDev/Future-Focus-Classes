import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";
import { BookOpen, Mail, Lock, ArrowRight, Eye, EyeOff, ShieldCheck } from "lucide-react";

const LoginPage = () => {
  const { login } = useAuth();
  const { showToast } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const from = location.state?.from || "/";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      const user = await login(formData.email, formData.password);
      showToast(`Welcome back, ${user.fullName}! 👋`, "success");

      // Redirect according to role
      if (user.role === "admin") navigate("/admin/dashboard");
      else if (user.role === "instructor") navigate("/instructor/dashboard");
      else if (from !== "/") navigate(from);
      else navigate("/student/dashboard");
    } catch (err) {
      setError(err.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  // Quick Demo Account Auto-Fill for Recruiters/Evaluators
  const handleQuickLogin = (email, password) => {
    setFormData({ email, password });
    setError("");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        backgroundColor: "var(--bg-main)",
      }}
    >
      <div
        className="card"
        style={{
          width: "100%",
          maxWidth: "460px",
          padding: "40px",
          boxShadow: "var(--shadow-xl)",
        }}
      >
        {/* Logo Header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <Link
            to="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "16px",
            }}
          >
            <img
              src="/img/future focus classes logo.png"
              alt="Future Focus Classes Logo"
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                objectFit: "contain",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              }}
            />
            <div style={{ textAlign: "center" }}>
              <span style={{ fontSize: "22px", fontWeight: "900", display: "block" }}>
                Future Focus <span style={{ color: "var(--primary)" }}>Classes</span>
              </span>
              <span style={{ fontSize: "11px", color: "var(--primary)", fontWeight: "700" }}>
                तमसो माँ ज्योतिर्गमय
              </span>
            </div>
          </Link>

          <h1 style={{ fontSize: "22px", fontWeight: "800", color: "var(--text-main)", marginBottom: "6px" }}>
            Sign in to your account
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
            Welcome back! Select a demo role or enter your credentials.
          </p>
        </div>

        {/* Demo Account Pills (Super handy for Portfolio reviewers!) */}
        <div
          style={{
            backgroundColor: "var(--bg-subtle)",
            borderRadius: "var(--radius-md)",
            padding: "12px",
            marginBottom: "24px",
            border: "1px dashed var(--border-light)",
          }}
        >
          <div style={{ fontSize: "12px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
            <ShieldCheck size={14} color="var(--primary)" /> 1-Click Demo Profiles:
          </div>
          <div style={{ display: "flex", gap: "6px" }}>
            <button
              type="button"
              onClick={() => handleQuickLogin("student@futurefocus.com", "Password@123")}
              className="btn btn-secondary btn-sm"
              style={{ flex: 1, fontSize: "11.5px" }}
            >
              Student Demo
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin("instructor@futurefocus.com", "Password@123")}
              className="btn btn-secondary btn-sm"
              style={{ flex: 1, fontSize: "11.5px" }}
            >
              Faculty Demo
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin("admin@futurefocus.com", "Password@123")}
              className="btn btn-secondary btn-sm"
              style={{ flex: 1, fontSize: "11.5px" }}
            >
              Admin Demo
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div
            style={{
              padding: "12px 14px",
              backgroundColor: "var(--danger-light)",
              color: "var(--danger)",
              borderRadius: "var(--radius-md)",
              fontSize: "13.5px",
              fontWeight: "600",
              marginBottom: "20px",
            }}
          >
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <div style={{ position: "relative" }}>
              <Mail
                size={16}
                style={{
                  position: "absolute",
                  left: "14px",
                  top: "14px",
                  color: "var(--text-muted)",
                }}
              />
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="form-input"
                style={{ paddingLeft: "40px" }}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <label className="form-label" htmlFor="password">Password</label>
              <Link to="/forgot-password" style={{ fontSize: "12.5px", color: "var(--primary)", fontWeight: "600" }}>
                Forgot Password?
              </Link>
            </div>
            <div style={{ position: "relative" }}>
              <Lock
                size={16}
                style={{
                  position: "absolute",
                  left: "14px",
                  top: "14px",
                  color: "var(--text-muted)",
                }}
              />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="form-input"
                style={{ paddingLeft: "40px", paddingRight: "40px" }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "12px",
                  color: "var(--text-muted)",
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-lg"
            style={{ width: "100%", marginTop: "12px" }}
          >
            {loading ? "Signing in..." : "Sign In to Future Focus Classes"} <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "24px", fontSize: "14px", color: "var(--text-secondary)" }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "var(--primary)", fontWeight: "700" }}>
            Sign up for free
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
