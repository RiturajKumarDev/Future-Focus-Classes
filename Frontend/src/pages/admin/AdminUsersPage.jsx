import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { useApp } from "../../context/AppContext";
import { Users, Search, Shield, Ban, CheckCircle, ArrowUpDown } from "lucide-react";

const AdminUsersPage = () => {
  const { showToast } = useApp();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (search) query.set("search", search);
      if (role) query.set("role", role);
      if (status) query.set("status", status);

      const res = await api.get(`admin/users?${query.toString()}`);
      if (res.success) setUsers(res.data);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [role, status]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    const nextStatus = currentStatus === "blocked" ? "active" : "blocked";
    try {
      const res = await api.patch(`admin/users/${userId}`, { status: nextStatus });
      if (res.success) {
        setUsers(users.map((u) => (u._id === userId ? { ...u, status: nextStatus } : u)));
        showToast(`User is now ${nextStatus}`, "success");
      }
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const handleChangeRole = async (userId, newRole) => {
    try {
      const res = await api.patch(`admin/users/${userId}`, { role: newRole });
      if (res.success) {
        setUsers(users.map((u) => (u._id === userId ? { ...u, role: newRole } : u)));
        showToast(`User role updated to ${newRole}`, "success");
      }
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  return (
    <div>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "26px", fontWeight: "800", marginBottom: "6px" }}>
          User Directory & Moderation
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "14.5px" }}>
          Inspect user accounts, manage role permissions, and suspend bad actors.
        </p>
      </div>

      {/* Filters Bar */}
      <div className="card" style={{ padding: "18px", marginBottom: "24px", display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "center" }}>
        <form onSubmit={handleSearchSubmit} style={{ display: "flex", gap: "8px", flex: 1, minWidth: "220px" }}>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input"
          />
          <button type="submit" className="btn btn-secondary">
            <Search size={16} />
          </button>
        </form>

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="form-input"
          style={{ width: "auto" }}
        >
          <option value="">All Roles</option>
          <option value="student">Student</option>
          <option value="instructor">Instructor</option>
          <option value="admin">Admin</option>
        </select>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="form-input"
          style={{ width: "auto" }}
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="blocked">Blocked</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="card" style={{ padding: "24px" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>Loading users...</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-light)", color: "var(--text-muted)" }}>
                  <th style={{ padding: "12px 16px", fontWeight: "700" }}>User</th>
                  <th style={{ padding: "12px 16px", fontWeight: "700" }}>Email</th>
                  <th style={{ padding: "12px 16px", fontWeight: "700" }}>Role</th>
                  <th style={{ padding: "12px 16px", fontWeight: "700" }}>Status</th>
                  <th style={{ padding: "12px 16px", fontWeight: "700", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} style={{ borderBottom: "1px solid var(--border-light)" }}>
                    <td style={{ padding: "14px 16px", fontWeight: "700", display: "flex", alignItems: "center", gap: "10px" }}>
                      <img
                        src={u.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${u.fullName}`}
                        alt=""
                        style={{ width: "34px", height: "34px", borderRadius: "50%", objectFit: "cover" }}
                      />
                      <span>{u.fullName}</span>
                    </td>
                    <td style={{ padding: "14px 16px", color: "var(--text-secondary)" }}>
                      {u.email}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <select
                        value={u.role}
                        onChange={(e) => handleChangeRole(u._id, e.target.value)}
                        style={{
                          padding: "4px 8px",
                          borderRadius: "6px",
                          border: "1px solid var(--border-light)",
                          fontSize: "13px",
                          fontWeight: "600",
                          textTransform: "capitalize",
                        }}
                      >
                        <option value="student">Student</option>
                        <option value="instructor">Instructor</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <span className={`badge ${u.status === "blocked" ? "badge-danger" : "badge-success"}`}>
                        {u.status}
                      </span>
                    </td>
                    <td style={{ padding: "14px 16px", textAlign: "right" }}>
                      <button
                        onClick={() => handleToggleStatus(u._id, u.status)}
                        className={`btn ${u.status === "blocked" ? "btn-secondary" : "btn-outline"} btn-sm`}
                      >
                        {u.status === "blocked" ? (
                          <>
                            <CheckCircle size={14} color="var(--success)" /> Unblock
                          </>
                        ) : (
                          <>
                            <Ban size={14} color="var(--danger)" /> Suspend
                          </>
                        )}
                      </button>
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

export default AdminUsersPage;
