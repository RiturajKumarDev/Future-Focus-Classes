import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { Users, Mail, BookOpen } from "lucide-react";

const InstructorStudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("instructor/students").then((res) => {
      if (res.success) setStudents(res.data);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "26px", fontWeight: "800", marginBottom: "6px" }}>
          Enrolled Students Directory
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "14.5px" }}>
          Monitor students enrolled in your published courses.
        </p>
      </div>

      <div className="card" style={{ padding: "24px" }}>
        {students.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <Users size={40} color="var(--text-muted)" style={{ marginBottom: "12px" }} />
            <p style={{ color: "var(--text-muted)" }}>No students enrolled yet.</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-light)", color: "var(--text-muted)" }}>
                  <th style={{ padding: "12px 16px", fontWeight: "700" }}>Student</th>
                  <th style={{ padding: "12px 16px", fontWeight: "700" }}>Email</th>
                  <th style={{ padding: "12px 16px", fontWeight: "700" }}>Enrolled Course</th>
                  <th style={{ padding: "12px 16px", fontWeight: "700" }}>Enrolled Date</th>
                </tr>
              </thead>
              <tbody>
                {students.map((item) => (
                  <tr key={item._id} style={{ borderBottom: "1px solid var(--border-light)" }}>
                    <td style={{ padding: "14px 16px", fontWeight: "700", display: "flex", alignItems: "center", gap: "10px" }}>
                      <img
                        src={item.student?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${item.student?.fullName}`}
                        alt=""
                        style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover" }}
                      />
                      <span>{item.student?.fullName}</span>
                    </td>
                    <td style={{ padding: "14px 16px", color: "var(--text-secondary)" }}>
                      {item.student?.email}
                    </td>
                    <td style={{ padding: "14px 16px", fontWeight: "600" }}>
                      {item.course?.title}
                    </td>
                    <td style={{ padding: "14px 16px", color: "var(--text-muted)" }}>
                      {new Date(item.enrolledAt).toLocaleDateString()}
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

export default InstructorStudentsPage;
