import React, { useState } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/common/Navbar";
import {
  LayoutDashboard,
  BookOpen,
  Award,
  Heart,
  Bell,
  User,
  PlusCircle,
  Users,
  CheckSquare,
  Shield,
  Layers,
  CreditCard,
  Tag,
  Activity,
  LogOut,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";

const DashboardLayout = ({ roleRequired }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Role verification guard
  if (!isAuthenticated) {
    navigate("/login", { state: { from: location.pathname } });
    return null;
  }

  if (roleRequired && user?.role !== roleRequired && user?.role !== "admin") {
    return (
      <div style={{ textAlign: "center", padding: "100px 20px" }}>
        <h2>Access Restricted</h2>
        <p>You need {roleRequired} privileges to access this portal.</p>
        <Link to="/" className="btn btn-primary" style={{ marginTop: "16px" }}>
          Return Home
        </Link>
      </div>
    );
  }

  // Navigation Items by Role
  const studentLinks = [
    { name: "Overview", path: "/student/dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "My Enrolled Courses", path: "/student/courses", icon: <BookOpen size={18} /> },
    { name: "Certificates", path: "/student/certificates", icon: <Award size={18} /> },
    { name: "Wishlist", path: "/student/wishlist", icon: <Heart size={18} /> },
    { name: "Notifications", path: "/student/notifications", icon: <Bell size={18} /> },
    { name: "Account Profile", path: "/student/profile", icon: <User size={18} /> },
  ];

  const instructorLinks = [
    { name: "Instructor Studio", path: "/instructor/dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "My Courses", path: "/instructor/courses", icon: <BookOpen size={18} /> },
    { name: "Create New Course", path: "/instructor/courses/create", icon: <PlusCircle size={18} /> },
    { name: "Enrolled Students", path: "/instructor/students", icon: <Users size={18} /> },
    { name: "Assignment Submissions", path: "/instructor/submissions", icon: <CheckSquare size={18} /> },
    { name: "Profile", path: "/student/profile", icon: <User size={18} /> },
  ];

  const adminLinks = [
    { name: "Admin Overview", path: "/admin/dashboard", icon: <Shield size={18} /> },
    { name: "User Directory", path: "/admin/users", icon: <Users size={18} /> },
    { name: "Course Approvals", path: "/admin/courses", icon: <BookOpen size={18} /> },
    { name: "Course Categories", path: "/admin/categories", icon: <Layers size={18} /> },
    { name: "Payment Transactions", path: "/admin/payments", icon: <CreditCard size={18} /> },
    { name: "Coupons & Offers", path: "/admin/coupons", icon: <Tag size={18} /> },
    { name: "Audit Trail", path: "/admin/audit-logs", icon: <Activity size={18} /> },
  ];

  const currentLinks =
    user?.role === "admin"
      ? location.pathname.startsWith("/instructor")
        ? instructorLinks
        : location.pathname.startsWith("/student")
        ? studentLinks
        : adminLinks
      : user?.role === "instructor"
      ? instructorLinks
      : studentLinks;

  const portalTitle =
    user?.role === "admin"
      ? "Admin Portal"
      : user?.role === "instructor"
      ? "Instructor Studio"
      : "Student Portal";

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "var(--bg-main)" }}>
      <Navbar />

      <div style={{ display: "flex", flex: 1, position: "relative" }}>
        {/* Mobile Sidebar Toggle Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{
            display: "none",
            position: "fixed",
            bottom: "20px",
            left: "20px",
            zIndex: 99,
            backgroundColor: "var(--primary)",
            color: "#fff",
            padding: "12px",
            borderRadius: "50%",
            boxShadow: "var(--shadow-lg)",
          }}
          className="mobile-sidebar-toggle"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Sidebar */}
        <aside
          style={{
            width: "260px",
            backgroundColor: "var(--bg-surface)",
            borderRight: "1px solid var(--border-light)",
            display: "flex",
            flexDirection: "column",
            padding: "24px 16px",
            flexShrink: 0,
          }}
          className={`dashboard-sidebar ${sidebarOpen ? "open" : ""}`}
        >
          {/* User mini badge */}
          <div
            style={{
              padding: "12px",
              borderRadius: "var(--radius-md)",
              backgroundColor: "var(--bg-subtle)",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <img
              src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.fullName}`}
              alt={user?.fullName}
              style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }}
            />
            <div style={{ overflow: "hidden" }}>
              <div style={{ fontSize: "14px", fontWeight: "700", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>
                {user?.fullName}
              </div>
              <div style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "capitalize" }}>
                {portalTitle}
              </div>
            </div>
          </div>

          {/* Nav List */}
          <nav style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1 }}>
            {currentLinks.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "10px 14px",
                    borderRadius: "var(--radius-md)",
                    fontSize: "14px",
                    fontWeight: isActive ? "700" : "500",
                    color: isActive ? "var(--primary)" : "var(--text-secondary)",
                    backgroundColor: isActive ? "var(--primary-light)" : "transparent",
                    transition: "var(--transition)",
                  }}
                >
                  <span style={{ color: isActive ? "var(--primary)" : "var(--text-muted)" }}>
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Quick Switch (if admin) or Logout */}
          <div style={{ borderTop: "1px solid var(--border-light)", paddingTop: "14px" }}>
            {user?.role === "admin" && (
              <div style={{ marginBottom: "10px", display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: "700", textTransform: "uppercase" }}>
                  Switch View:
                </span>
                <div style={{ display: "flex", gap: "6px" }}>
                  <Link to="/student/dashboard" className="btn btn-secondary btn-sm" style={{ flex: 1, fontSize: "11px" }}>
                    Student
                  </Link>
                  <Link to="/instructor/dashboard" className="btn btn-secondary btn-sm" style={{ flex: 1, fontSize: "11px" }}>
                    Instructor
                  </Link>
                </div>
              </div>
            )}

            <button
              onClick={() => logout()}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                width: "100%",
                padding: "8px 12px",
                fontSize: "13.5px",
                color: "var(--danger)",
                fontWeight: "600",
              }}
            >
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main style={{ flex: 1, padding: "32px 40px", overflowX: "hidden" }} className="dashboard-content">
          <Outlet />
        </main>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .mobile-sidebar-toggle {
            display: flex !important;
          }
          .dashboard-sidebar {
            position: fixed !important;
            top: 72px;
            bottom: 0;
            left: -280px;
            z-index: 90;
            transition: left 0.3s ease;
            box-shadow: var(--shadow-xl);
          }
          .dashboard-sidebar.open {
            left: 0 !important;
          }
          .dashboard-content {
            padding: 20px 16px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default DashboardLayout;
