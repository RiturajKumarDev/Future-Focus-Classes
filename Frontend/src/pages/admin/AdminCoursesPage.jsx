import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { useApp } from "../../context/AppContext";
import { BookOpen, CheckCircle, XCircle, Eye, AlertCircle } from "lucide-react";

const AdminCoursesPage = () => {
  const { showToast } = useApp();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");

  const fetchCourses = async () => {
    setLoading(true);
    try {
      // In admin view, fetch all statuses
      const query = statusFilter ? `?status=${statusFilter}` : "";
      const res = await api.get(`courses${query}`);
      if (res.success) setCourses(res.data);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [statusFilter]);

  const handleUpdateStatus = async (courseId, nextStatus) => {
    let rejectionReason = "";
    if (nextStatus === "REJECTED") {
      rejectionReason = window.prompt("Reason for course rejection:") || "Quality guidelines not met.";
    }

    try {
      const res = await api.patch(`courses/${courseId}/status`, {
        status: nextStatus,
        rejectionReason,
      });

      if (res.success) {
        setCourses(courses.map((c) => (c._id === courseId ? { ...c, status: nextStatus } : c)));
        showToast(`Course status updated to ${nextStatus}`, "success");
      }
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  return (
    <div>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "26px", fontWeight: "800", marginBottom: "6px" }}>
          Course Moderation & Quality Assurance
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "14.5px" }}>
          Review instructor curricula, approve pending courses, or unpublish outdated tracks.
        </p>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
        {[
          { label: "All Statuses", val: "" },
          { label: "Pending Review", val: "PENDING_REVIEW" },
          { label: "Published", val: "PUBLISHED" },
          { label: "Drafts", val: "DRAFT" },
          { label: "Rejected", val: "REJECTED" },
        ].map((tab) => (
          <button
            key={tab.val}
            onClick={() => setStatusFilter(tab.val)}
            className={`btn ${statusFilter === tab.val ? "btn-primary" : "btn-secondary"} btn-sm`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="card" style={{ padding: "24px" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>Loading courses...</div>
        ) : courses.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px" }}>No courses match this filter.</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-light)", color: "var(--text-muted)" }}>
                  <th style={{ padding: "12px 16px", fontWeight: "700" }}>Course</th>
                  <th style={{ padding: "12px 16px", fontWeight: "700" }}>Instructor</th>
                  <th style={{ padding: "12px 16px", fontWeight: "700" }}>Category</th>
                  <th style={{ padding: "12px 16px", fontWeight: "700" }}>Status</th>
                  <th style={{ padding: "12px 16px", fontWeight: "700", textAlign: "right" }}>Moderation</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((c) => (
                  <tr key={c._id} style={{ borderBottom: "1px solid var(--border-light)" }}>
                    <td style={{ padding: "14px 16px", fontWeight: "700", display: "flex", alignItems: "center", gap: "10px" }}>
                      <img src={c.thumbnail} alt="" style={{ width: "40px", height: "30px", borderRadius: "4px", objectFit: "cover" }} />
                      <span>{c.title}</span>
                    </td>
                    <td style={{ padding: "14px 16px", color: "var(--text-secondary)" }}>
                      {c.instructor?.fullName}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      {c.category?.name}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <span
                        className={`badge ${
                          c.status === "PUBLISHED"
                            ? "badge-success"
                            : c.status === "PENDING_REVIEW"
                            ? "badge-warning"
                            : c.status === "REJECTED"
                            ? "badge-danger"
                            : "badge-secondary"
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td style={{ padding: "14px 16px", textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: "8px" }}>
                        <Link to={`/courses/${c.slug || c._id}`} target="_blank" className="btn btn-secondary btn-sm" title="Preview">
                          <Eye size={14} />
                        </Link>
                        {c.status !== "PUBLISHED" && (
                          <button
                            onClick={() => handleUpdateStatus(c._id, "PUBLISHED")}
                            className="btn btn-primary btn-sm"
                            title="Approve & Publish"
                          >
                            <CheckCircle size={14} /> Approve
                          </button>
                        )}
                        {c.status !== "REJECTED" && (
                          <button
                            onClick={() => handleUpdateStatus(c._id, "REJECTED")}
                            className="btn btn-secondary btn-sm"
                            title="Reject"
                          >
                            <XCircle size={14} color="var(--danger)" />
                          </button>
                        )}
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

export default AdminCoursesPage;
