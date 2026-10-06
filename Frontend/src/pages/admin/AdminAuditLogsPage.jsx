import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { Activity, Shield, Calendar, Terminal } from "lucide-react";

const AdminAuditLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("admin/audit-logs").then((res) => {
      if (res.success) setLogs(res.data);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "26px", fontWeight: "800", marginBottom: "6px" }}>
          System Security & Audit Trail
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "14.5px" }}>
          Immutable logs tracking authentication, administrative changes, and moderation events.
        </p>
      </div>

      <div className="card" style={{ padding: "24px" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>Loading audit records...</div>
        ) : logs.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px" }}>No audit records found.</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13.5px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-light)", color: "var(--text-muted)" }}>
                  <th style={{ padding: "12px 16px", fontWeight: "700" }}>Timestamp</th>
                  <th style={{ padding: "12px 16px", fontWeight: "700" }}>Action</th>
                  <th style={{ padding: "12px 16px", fontWeight: "700" }}>Actor User</th>
                  <th style={{ padding: "12px 16px", fontWeight: "700" }}>Target Type</th>
                  <th style={{ padding: "12px 16px", fontWeight: "700" }}>IP Address</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log._id} style={{ borderBottom: "1px solid var(--border-light)" }}>
                    <td style={{ padding: "12px 16px", color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span
                        className="badge"
                        style={{
                          backgroundColor: "#f1f5f9",
                          color: "#1e293b",
                          fontFamily: "var(--font-mono)",
                          fontSize: "12px",
                        }}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px", fontWeight: "600" }}>
                      {log.user?.fullName || "Anonymous/System"} ({log.user?.role || "guest"})
                    </td>
                    <td style={{ padding: "12px 16px", color: "var(--text-secondary)" }}>
                      {log.targetType} {log.targetId ? `(${log.targetId.slice(-6)})` : ""}
                    </td>
                    <td style={{ padding: "12px 16px", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                      {log.ipAddress || "::1"}
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

export default AdminAuditLogsPage;
