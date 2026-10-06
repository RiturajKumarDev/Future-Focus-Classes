import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import {
  BookOpen,
  Users,
  IndianRupee,
  CheckSquare,
  Star,
  PlusCircle,
  Eye,
  Edit,
  ArrowRight,
} from "lucide-react";

const InstructorDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("instructor/dashboard");
        if (res.success) setData(res.data);
      } catch (err) {
        console.error("Instructor dashboard error:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <div className="card skeleton" style={{ height: "100px" }} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="card skeleton" style={{ height: "100px" }} />
          ))}
        </div>
      </div>
    );
  }

  const courses = data?.courses || [];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "36px" }}>
      {/* Header Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontSize: "26px", fontWeight: "800", marginBottom: "4px" }}>
            Instructor Studio Dashboard
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "14.5px" }}>
            Manage curriculum, monitor student engagement, and review submissions.
          </p>
        </div>

        <Link to="/instructor/courses/create" className="btn btn-primary">
          <PlusCircle size={18} /> Create New Course
        </Link>
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
              <BookOpen size={20} />
            </div>
            <div>
              <div style={{ fontSize: "22px", fontWeight: "800" }}>{data?.totalCourses || 0}</div>
              <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>Total Courses</div>
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ padding: "10px", borderRadius: "10px", backgroundColor: "var(--success-light)", color: "var(--success)" }}>
              <Users size={20} />
            </div>
            <div>
              <div style={{ fontSize: "22px", fontWeight: "800" }}>{data?.totalStudents || 0}</div>
              <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>Active Students</div>
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ padding: "10px", borderRadius: "10px", backgroundColor: "#ecfdf5", color: "#059669" }}>
              <IndianRupee size={20} />
            </div>
            <div>
              <div style={{ fontSize: "22px", fontWeight: "800" }}>₹{data?.totalRevenue || 0}</div>
              <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>Earnings Revenue</div>
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ padding: "10px", borderRadius: "10px", backgroundColor: "var(--warning-light)", color: "var(--warning)" }}>
              <CheckSquare size={20} />
            </div>
            <div>
              <div style={{ fontSize: "22px", fontWeight: "800" }}>{data?.pendingSubmissions || 0}</div>
              <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>Pending Submissions</div>
            </div>
          </div>
        </div>
      </div>

      {/* Courses Table */}
      <div className="card" style={{ padding: "28px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "800" }}>My Authored Courses</h2>
          <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>{courses.length} courses total</span>
        </div>

        {courses.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <p style={{ color: "var(--text-muted)", marginBottom: "16px" }}>You haven't authored any courses yet.</p>
            <Link to="/instructor/courses/create" className="btn btn-primary btn-sm">
              Create First Course
            </Link>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-light)", color: "var(--text-muted)" }}>
                  <th style={{ padding: "12px 16px", fontWeight: "700" }}>Course Title</th>
                  <th style={{ padding: "12px 16px", fontWeight: "700" }}>Price</th>
                  <th style={{ padding: "12px 16px", fontWeight: "700" }}>Students</th>
                  <th style={{ padding: "12px 16px", fontWeight: "700" }}>Status</th>
                  <th style={{ padding: "12px 16px", fontWeight: "700", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((c) => (
                  <tr key={c._id} style={{ borderBottom: "1px solid var(--border-light)" }}>
                    <td style={{ padding: "14px 16px", fontWeight: "700", display: "flex", alignItems: "center", gap: "10px" }}>
                      <img src={c.thumbnail} alt="" style={{ width: "40px", height: "30px", borderRadius: "4px", objectFit: "cover" }} />
                      <span>{c.title}</span>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      {c.pricing?.isFree ? "Free" : `₹${c.pricing?.discountPrice || c.pricing?.price}`}
                    </td>
                    <td style={{ padding: "14px 16px" }}>{c.enrollmentCount || 0}</td>
                    <td style={{ padding: "14px 16px" }}>
                      <span
                        className={`badge ${
                          c.status === "PUBLISHED"
                            ? "badge-success"
                            : c.status === "PENDING_REVIEW"
                            ? "badge-warning"
                            : "badge-secondary"
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td style={{ padding: "14px 16px", textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: "8px" }}>
                        <Link to={`/courses/${c.slug || c._id}`} className="btn btn-secondary btn-sm" title="Preview">
                          <Eye size={14} />
                        </Link>
                        <Link to={`/instructor/courses/${c._id}/edit`} className="btn btn-secondary btn-sm" title="Edit">
                          <Edit size={14} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorDashboard;
