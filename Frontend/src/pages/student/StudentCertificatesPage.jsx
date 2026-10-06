import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { Award, ExternalLink, Calendar, CheckCircle } from "lucide-react";

const StudentCertificatesPage = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCerts = async () => {
      try {
        const res = await api.get("certificates/my");
        if (res.success) setCertificates(res.data);
      } catch (err) {
        console.error("Could not load certificates:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCerts();
  }, []);

  if (loading) {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "24px" }}>
        {[1, 2].map((n) => (
          <div key={n} className="card skeleton" style={{ height: "200px" }} />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "26px", fontWeight: "800", marginBottom: "6px" }}>
          My Verified Certificates
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "14.5px" }}>
          Share your verifiable achievements directly to LinkedIn or download PDF copies.
        </p>
      </div>

      {certificates.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "60px 20px" }}>
          <Award size={48} color="var(--primary)" style={{ marginBottom: "16px" }} />
          <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "8px" }}>
            No certificates earned yet
          </h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginBottom: "20px" }}>
            Complete 100% of any enrolled course to automatically receive an official credential.
          </p>
          <Link to="/student/courses" className="btn btn-primary">
            Go to My Courses
          </Link>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "24px" }}>
          {certificates.map((cert) => (
            <div key={cert._id} className="card" style={{ padding: "26px", display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "12px",
                    backgroundColor: "var(--warning-light)",
                    color: "var(--warning)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Award size={24} />
                </div>
                <span className="badge badge-success">Verified</span>
              </div>

              <h3 style={{ fontSize: "17px", fontWeight: "700", marginBottom: "8px" }}>
                {cert.course?.title || cert.completionData?.courseName}
              </h3>

              <div style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "4px" }}>
                Instructor: {cert.instructor?.fullName || cert.completionData?.instructorName}
              </div>

              <div style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "20px", display: "flex", alignItems: "center", gap: "6px" }}>
                <Calendar size={14} /> Issued: {new Date(cert.issueDate).toLocaleDateString()}
              </div>

              <div style={{ marginTop: "auto", paddingTop: "16px", borderTop: "1px solid var(--border-light)" }}>
                <Link
                  to={`/verify/${cert.certificateId}`}
                  target="_blank"
                  className="btn btn-primary btn-sm"
                  style={{ width: "100%" }}
                >
                  <ExternalLink size={15} /> View & Verify Credential
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentCertificatesPage;
