import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";
import {
  BookOpen,
  Heart,
  Bell,
  User,
  LogOut,
  LayoutDashboard,
  Award,
  PlusCircle,
  Shield,
  Menu,
  X,
  Search,
} from "lucide-react";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { unreadNotifications, wishlistIds } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
    navigate("/login");
  };

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        backgroundColor: "var(--bg-surface)",
        borderBottom: "1px solid var(--border-light)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "72px",
          gap: "24px",
        }}
      >
        {/* Brand Logo */}
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            textDecoration: "none",
          }}
        >
          <img
            src="/img/future focus classes logo.png"
            alt="Future Focus Classes Logo"
            style={{
              width: "44px",
              height: "44px",
              objectFit: "contain",
              borderRadius: "50%",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          />
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.15 }}>
            <span
              style={{
                fontSize: "18px",
                fontWeight: "800",
                letterSpacing: "-0.5px",
                color: "var(--text-main)",
                whiteSpace: "nowrap",
              }}
            >
              Future Focus <span style={{ color: "var(--primary)" }}>Classes</span>
            </span>
            <span style={{ fontSize: "10.5px", fontWeight: "600", color: "var(--text-muted)", letterSpacing: "0.2px" }}>
              Classes 8-12 • JEE • NEET • Coding
            </span>
          </div>
        </Link>

        {/* Global Search */}
        <form
          onSubmit={handleSearch}
          style={{
            flex: "1",
            maxWidth: "400px",
            position: "relative",
            display: "flex",
            alignItems: "center",
          }}
          className="desktop-search"
        >
          <Search
            size={18}
            style={{
              position: "absolute",
              left: "14px",
              color: "var(--text-muted)",
              pointerEvents: "none",
            }}
          />
          <input
            type="text"
            placeholder="Search courses, skills, topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 14px 10px 42px",
              borderRadius: "var(--radius-full)",
              backgroundColor: "var(--bg-subtle)",
              border: "1px solid var(--border-light)",
              fontSize: "14px",
              outline: "none",
              transition: "var(--transition)",
            }}
          />
        </form>

        {/* Navigation Links (Desktop) */}
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
          }}
          className="desktop-nav"
        >
          <Link
            to="/courses"
            style={{
              fontSize: "14.5px",
              fontWeight: "600",
              color: location.pathname === "/courses" ? "var(--primary)" : "var(--text-secondary)",
              transition: "var(--transition)",
            }}
          >
            Explore Courses
          </Link>

          <Link
            to="/categories"
            style={{
              fontSize: "14.5px",
              fontWeight: "600",
              color: location.pathname === "/categories" ? "var(--primary)" : "var(--text-secondary)",
              transition: "var(--transition)",
            }}
          >
            Categories
          </Link>

          <Link
            to="/pricing"
            style={{
              fontSize: "14.5px",
              fontWeight: "600",
              color: location.pathname === "/pricing" ? "var(--primary)" : "var(--text-secondary)",
              transition: "var(--transition)",
            }}
          >
            Pricing
          </Link>

          {/* Role specific quick action button */}
          {user?.role === "instructor" ? (
            <Link to="/instructor/courses/create" className="btn btn-outline btn-sm">
              <PlusCircle size={16} /> New Course
            </Link>
          ) : user?.role === "admin" ? (
            <Link to="/admin/dashboard" className="btn btn-outline btn-sm">
              <Shield size={16} /> Admin Panel
            </Link>
          ) : (
            <Link
              to="/courses?filter=featured"
              style={{
                fontSize: "14.5px",
                fontWeight: "600",
                color: "var(--text-secondary)",
              }}
            >
              Enterprise
            </Link>
          )}

          {/* Right Action Area */}
          {isAuthenticated ? (
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              {/* Wishlist Link (for students) */}
              {user?.role === "student" && (
                <Link
                  to="/student/wishlist"
                  title="My Wishlist"
                  style={{
                    position: "relative",
                    color: "var(--text-secondary)",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Heart size={20} />
                  {wishlistIds.size > 0 && (
                    <span
                      style={{
                        position: "absolute",
                        top: "-6px",
                        right: "-8px",
                        background: "var(--danger)",
                        color: "#fff",
                        fontSize: "11px",
                        fontWeight: "700",
                        width: "18px",
                        height: "18px",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {wishlistIds.size}
                    </span>
                  )}
                </Link>
              )}

              {/* Notifications Icon */}
              <Link
                to={
                  user?.role === "admin"
                    ? "/admin/dashboard"
                    : user?.role === "instructor"
                    ? "/instructor/dashboard"
                    : "/student/notifications"
                }
                title="Notifications"
                style={{
                  position: "relative",
                  color: "var(--text-secondary)",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Bell size={20} />
                {unreadNotifications > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: "-6px",
                      right: "-8px",
                      background: "var(--primary)",
                      color: "#fff",
                      fontSize: "11px",
                      fontWeight: "700",
                      width: "18px",
                      height: "18px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {unreadNotifications}
                  </span>
                )}
              </Link>

              {/* User Avatar with Dropdown */}
              <div style={{ position: "relative" }}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "4px",
                    borderRadius: "var(--radius-full)",
                    border: "2px solid var(--border-light)",
                  }}
                >
                  <img
                    src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.fullName}`}
                    alt={user.fullName}
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div
                    style={{
                      position: "absolute",
                      right: 0,
                      top: "48px",
                      width: "230px",
                      backgroundColor: "var(--bg-surface)",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--border-light)",
                      boxShadow: "var(--shadow-xl)",
                      padding: "8px 0",
                      zIndex: 200,
                      animation: "fadeIn 0.15s ease",
                    }}
                  >
                    <div
                      style={{
                        padding: "10px 16px",
                        borderBottom: "1px solid var(--border-light)",
                      }}
                    >
                      <div style={{ fontWeight: "700", fontSize: "14px" }}>
                        {user.fullName}
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "var(--text-muted)",
                          textTransform: "capitalize",
                        }}
                      >
                        {user.role} Account
                      </div>
                    </div>

                    <Link
                      to={
                        user.role === "admin"
                          ? "/admin/dashboard"
                          : user.role === "instructor"
                          ? "/instructor/dashboard"
                          : "/student/dashboard"
                      }
                      onClick={() => setDropdownOpen(false)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "10px 16px",
                        fontSize: "14px",
                        color: "var(--text-main)",
                      }}
                    >
                      <LayoutDashboard size={16} /> Dashboard
                    </Link>

                    {user.role === "student" && (
                      <>
                        <Link
                          to="/student/courses"
                          onClick={() => setDropdownOpen(false)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            padding: "10px 16px",
                            fontSize: "14px",
                            color: "var(--text-main)",
                          }}
                        >
                          <BookOpen size={16} /> My Enrolled Courses
                        </Link>
                        <Link
                          to="/student/certificates"
                          onClick={() => setDropdownOpen(false)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            padding: "10px 16px",
                            fontSize: "14px",
                            color: "var(--text-main)",
                          }}
                        >
                          <Award size={16} /> My Certificates
                        </Link>
                      </>
                    )}

                    <Link
                      to="/student/profile"
                      onClick={() => setDropdownOpen(false)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "10px 16px",
                        fontSize: "14px",
                        color: "var(--text-main)",
                      }}
                    >
                      <User size={16} /> Account Profile
                    </Link>

                    <div style={{ borderTop: "1px solid var(--border-light)", margin: "4px 0" }} />

                    <button
                      onClick={handleLogout}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "10px 16px",
                        fontSize: "14px",
                        color: "var(--danger)",
                        textAlign: "left",
                      }}
                    >
                      <LogOut size={16} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Log In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Get Started
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{ display: "none" }}
          className="mobile-toggle"
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: "var(--bg-surface)",
            borderBottom: "1px solid var(--border-light)",
            padding: "20px 24px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <form onSubmit={handleSearch} style={{ display: "flex", gap: "8px" }}>
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
            />
            <button type="submit" className="btn btn-primary">
              <Search size={18} />
            </button>
          </form>

          <Link to="/courses" onClick={() => setMobileMenuOpen(false)}>
            Explore Courses
          </Link>
          <Link to="/categories" onClick={() => setMobileMenuOpen(false)}>
            Categories
          </Link>
          <Link to="/pricing" onClick={() => setMobileMenuOpen(false)}>
            Pricing
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to={
                  user?.role === "admin"
                    ? "/admin/dashboard"
                    : user?.role === "instructor"
                    ? "/instructor/dashboard"
                    : "/student/dashboard"
                }
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-primary"
              >
                Dashboard
              </Link>
              <button onClick={handleLogout} className="btn btn-secondary">
                Sign Out
              </button>
            </>
          ) : (
            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <Link
                to="/login"
                className="btn btn-secondary"
                style={{ flex: 1 }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="btn btn-primary"
                style={{ flex: 1 }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Media query overrides in inline style tag for responsive navbar */}
      <style>{`
        @media (max-width: 868px) {
          .desktop-search, .desktop-nav {
            display: none !important;
          }
          .mobile-toggle {
            display: block !important;
            color: var(--text-main);
          }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
