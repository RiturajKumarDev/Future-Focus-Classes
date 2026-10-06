import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";
import { BookOpen, User, Mail, Lock, ArrowRight, Eye, EyeOff, GraduationCap } from "lucide-react";

const RegisterPage = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get("role") === "instructor" ? "instructor" : "student";

  const { register } = useAuth();
  const { showToast } = useApp();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: initialRole,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.password) {
      setError("Please complete all required fields.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const user = await register(formData);
      showToast(`Account created! Welcome, ${user.fullName} 🎉`, "success");

      if (user.role === "instructor") navigate("/instructor/dashboard");
      else navigate("/student/dashboard");
    } catch (err) {
      setError(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
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
          maxWidth: "480px",
          padding: "40px",
          boxShadow: "var(--shadow-xl)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
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
            Create Your Student or Mentor Account
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
            Join thousands of learners in Class 8th-12th Boards, JEE, NEET, College & Coding tracks.
          </p>
        </div>

        {/* Role Toggle Switch */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "8px",
            padding: "4px",
            backgroundColor: "var(--bg-subtle)",
            borderRadius: "var(--radius-md)",
            marginBottom: "24px",
          }}
        >
          <button
            type="button"
            onClick={() => setFormData({ ...formData, role: "student" })}
            style={{
              padding: "10px",
              borderRadius: "var(--radius-sm)",
              fontSize: "13.5px",
              fontWeight: "700",
              color: formData.role === "student" ? "var(--primary)" : "var(--text-secondary)",
              backgroundColor: formData.role === "student" ? "var(--bg-surface)" : "transparent",
              boxShadow: formData.role === "student" ? "var(--shadow-sm)" : "none",
              transition: "var(--transition)",
            }}
          >
            👨‍🎓 I am a Student
          </button>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, role: "instructor" })}
            style={{
              padding: "10px",
              borderRadius: "var(--radius-sm)",
              fontSize: "13.5px",
              fontWeight: "700",
              color: formData.role === "instructor" ? "var(--primary)" : "var(--text-secondary)",
              backgroundColor: formData.role === "instructor" ? "var(--bg-surface)" : "transparent",
              boxShadow: formData.role === "instructor" ? "var(--shadow-sm)" : "none",
              transition: "var(--transition)",
            }}
          >
            👨‍🏫 I am an Instructor
          </button>
        </div>

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

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="fullName">Full Name</label>
            <div style={{ position: "relative" }}>
              <User
                size={16}
                style={{
                  position: "absolute",
                  left: "14px",
                  top: "14px",
                  color: "var(--text-muted)",
                }}
              />
              <input
                id="fullName"
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Alex Rivera"
                className="form-input"
                style={{ paddingLeft: "40px" }}
                required
              />
            </div>
          </div>

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
                placeholder="student@futurefocus.com"
                className="form-input"
                style={{ paddingLeft: "40px" }}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
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
                placeholder="At least 6 characters"
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
            {loading ? "Creating Account..." : "Create Account"} <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "24px", fontSize: "14px", color: "var(--text-secondary)" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "var(--primary)", fontWeight: "700" }}>
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
