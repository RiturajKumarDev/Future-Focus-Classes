import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import {
  Users,
  BookOpen,
  IndianRupee,
  Clock,
  ShieldAlert,
  Activity,
  CheckCircle,
  XCircle,
  ArrowRight,
} from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const res = await api.get("admin/dashboard");
        if (res.success) setStats(res.data);
      } catch (err) {
        console.error("Admin dashboard error:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <div className="card skeleton" style={{ height: "120px" }} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="card skeleton" style={{ height: "100px" }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "36px" }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: "26px", fontWeight: "800", marginBottom: "6px" }}>
          Platform Administrator Central
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "14.5px" }}>
          Monitor system health, review instructor submissions, and inspect security audit events.
        </p>
      </div>

      {/* Metrics Row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
        }}
      >
        <div className="card" style={{ padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ padding: "10px", borderRadius: "10px", backgroundColor: "var(--primary-light)", color: "var(--primary)" }}>
              <Users size={20} />
            </div>
            <div>
              <div style={{ fontSize: "22px", fontWeight: "800" }}>{stats?.totalUsers || 0}</div>
              <div style={{ fontSize: "12.5px", color: "var(--text-muted)" }}>Total Users ({stats?.totalStudents} students)</div>
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ padding: "10px", borderRadius: "10px", backgroundColor: "#ecfdf5", color: "#059669" }}>
              <IndianRupee size={20} />
            </div>
            <div>
              <div style={{ fontSize: "22px", fontWeight: "800" }}>₹{stats?.totalRevenue || 0}</div>
              <div style={{ fontSize: "12.5px", color: "var(--text-muted)" }}>Platform Gross Revenue</div>
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ padding: "10px", borderRadius: "10px", backgroundColor: "var(--warning-light)", color: "var(--warning)" }}>
              <Clock size={20} />
            </div>
            <div>
              <div style={{ fontSize: "22px", fontWeight: "800" }}>{stats?.pendingCourses || 0}</div>
              <div style={{ fontSize: "12.5px", color: "var(--text-muted)" }}>Pending Moderation</div>
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ padding: "10px", borderRadius: "10px", backgroundColor: "var(--success-light)", color: "var(--success)" }}>
              <BookOpen size={20} />
            </div>
            <div>
              <div style={{ fontSize: "22px", fontWeight: "800" }}>{stats?.publishedCourses || 0}</div>
              <div style={{ fontSize: "12.5px", color: "var(--text-muted)" }}>Published Curriculum</div>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Performance Trends & Quick Moderation */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }} className="admin-split-grid">
        {/* Monthly Revenue Overview */}
        <div className="card" style={{ padding: "24px" }}>
          <h2 style={{ fontSize: "17px", fontWeight: "800", marginBottom: "16px" }}>
            Monthly Revenue & Enrollment Growth
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {stats?.monthlyStats?.map((m) => (
              <div key={m.month} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "13.5px" }}>
                <span style={{ fontWeight: "700", width: "50px" }}>{m.month}</span>
                <div style={{ flex: 1, margin: "0 16px", height: "8px", backgroundColor: "var(--bg-subtle)", borderRadius: "99px", overflow: "hidden" }}>
                  <div style={{ width: `${Math.min(100, (m.revenue / 5000) * 100)}%`, height: "100%", backgroundColor: "var(--primary)" }} />
                </div>
                <span style={{ fontWeight: "700", color: "var(--text-main)" }}>₹{m.revenue}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Audit Feed */}
        <div className="card" style={{ padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h2 style={{ fontSize: "17px", fontWeight: "800" }}>Security Audit Trail</h2>
            <Link to="/admin/audit-logs" style={{ fontSize: "13px", color: "var(--primary)", fontWeight: "600" }}>
              View All
            </Link>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {stats?.recentLogs?.map((log) => (
              <div
                key={log._id}
                style={{
                  padding: "10px 14px",
                  borderRadius: "var(--radius-sm)",
                  backgroundColor: "var(--bg-subtle)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: "13px",
                }}
              >
                <div>
                  <span style={{ fontWeight: "700" }}>{log.action}</span>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                    User: {log.user?.fullName || "System"}
                  </div>
                </div>
                <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                  {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 868px) {
          .admin-split-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
