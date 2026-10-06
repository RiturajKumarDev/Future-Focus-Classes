import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../services/api";
import { Award, CheckCircle, Shield, Printer, ExternalLink, ArrowLeft } from "lucide-react";

const CertificateVerifyPage = () => {
  const { certificateId } = useParams();
  const [cert, setCert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCert = async () => {
      try {
        const res = await api.get(`certificates/verify/${certificateId}`);
        if (res.success) {
          setCert(res.data);
        }
      } catch (err) {
        setError(err.message || "Certificate record not found or invalid.");
      } finally {
        setLoading(false);
      }
    };

    fetchCert();
  }, [certificateId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: "100px 24px", textAlign: "center" }}>
        <div className="card skeleton" style={{ height: "450px", maxWidth: "800px", margin: "0 auto" }} />
      </div>
    );
  }

  if (error || !cert) {
    return (
      <div className="container" style={{ padding: "100px 24px", textAlign: "center" }}>
        <div
          className="card"
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            padding: "50px 30px",
            borderTop: "4px solid var(--danger)",
          }}
        >
          <Shield size={48} color="var(--danger)" style={{ marginBottom: "16px" }} />
          <h2 style={{ fontSize: "24px", fontWeight: "800", marginBottom: "8px" }}>
            Verification Failed
          </h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: "24px" }}>
            No certificate was found with ID: <code>{certificateId}</code>. Please check the URL or contact Future Focus Classes support.
          </p>
          <Link to="/" className="btn btn-primary">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const issueDateFormatted = new Date(cert.issueDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="container" style={{ padding: "50px 24px 80px" }}>
      {/* Verification Badge Header */}
      <div
        style={{
          maxWidth: "860px",
          margin: "0 auto 30px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              backgroundColor: "var(--success-light)",
              color: "var(--success)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CheckCircle size={22} />
          </div>
          <div>
            <div style={{ fontWeight: "800", fontSize: "16px", color: "var(--success)" }}>
              Officially Verified Credential
            </div>
            <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>
              Certificate ID: {cert.certificateId}
            </div>
          </div>
        </div>

        <button onClick={handlePrint} className="btn btn-secondary btn-sm print-hide">
          <Printer size={16} /> Print / Save as PDF
        </button>
      </div>

      {/* Visual Certificate Frame */}
      <div
        className="certificate-print-area"
        style={{
          maxWidth: "860px",
          margin: "0 auto",
          backgroundColor: "#ffffff",
          border: "12px double #4f46e5",
          borderRadius: "var(--radius-lg)",
          padding: "60px 50px",
          textAlign: "center",
          boxShadow: "var(--shadow-xl)",
          position: "relative",
          backgroundImage: "radial-gradient(#f1f5f9 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      >
        {/* Certificate Watermark / Header */}
        <div style={{ marginBottom: "30px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              fontWeight: "900",
              fontSize: "24px",
              color: "var(--text-main)",
              marginBottom: "8px",
            }}
          >
            <img
              src="/img/future focus classes logo.png"
              alt="Future Focus Classes Logo"
              style={{ width: "64px", height: "64px", borderRadius: "50%", objectFit: "contain", marginBottom: "8px" }}
            />
            <div style={{ fontWeight: "900", fontSize: "24px", color: "var(--text-main)" }}>
              FUTURE FOCUS <span style={{ color: "var(--primary)" }}>CLASSES</span>
            </div>
            <div style={{ fontSize: "12px", color: "var(--primary)", fontWeight: "700", letterSpacing: "1px", marginBottom: "4px" }}>
              तमसो माँ ज्योतिर्गमय • Offline & Online Institute
            </div>
          </div>
          <div style={{ fontSize: "13px", letterSpacing: "3px", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: "700" }}>
            Certificate of Completion & Academic Mastery
          </div>
        </div>

        <p style={{ fontSize: "15px", color: "var(--text-secondary)", marginBottom: "16px" }}>
          This is proudly presented to
        </p>

        <h1
          style={{
            fontSize: "clamp(30px, 4vw, 44px)",
            fontWeight: "800",
            color: "var(--primary)",
            marginBottom: "20px",
            borderBottom: "2px solid #e2e8f0",
            display: "inline-block",
            paddingBottom: "8px",
          }}
        >
          {cert.completionData?.studentName || cert.student?.fullName || cert.studentName || "Verified Graduate"}
        </h1>

        <p style={{ fontSize: "16px", color: "var(--text-secondary)", maxWidth: "600px", margin: "0 auto 30px", lineHeight: "1.6" }}>
          for successfully fulfilling all curriculum requirements, hands-on programming assignments, and passing the comprehensive evaluation for
        </p>

        <h2 style={{ fontSize: "24px", fontWeight: "800", color: "var(--text-main)", marginBottom: "36px" }}>
          {cert.completionData?.courseName || cert.course?.title || cert.courseTitle || "Mastery Certification"}
        </h2>

        {/* Footer Details (Instructor Signature & Verification URL) */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            borderTop: "1px solid var(--border-light)",
            paddingTop: "30px",
            marginTop: "30px",
          }}
        >
          {/* Instructor Sign */}
          <div style={{ textAlign: "left" }}>
            <div
              style={{
                fontFamily: "cursive",
                fontSize: "22px",
                color: "#1e293b",
                marginBottom: "4px",
              }}
            >
              {cert.completionData?.instructorName || cert.instructor?.fullName}
            </div>
            <div style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: "700" }}>
              Lead Course Instructor
            </div>
          </div>

          {/* QR Code / ID */}
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
              Issued on: <strong>{issueDateFormatted}</strong>
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>
              Verification: <code>{cert.verificationUrl}</code>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          .print-hide, header, footer {
            display: none !important;
          }
          .certificate-print-area {
            border: 4px double #4f46e5 !important;
            box-shadow: none !important;
            margin: 0 !important;
            width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
};

export default CertificateVerifyPage;
