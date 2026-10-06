import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, Heart, Globe } from "lucide-react";

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: "var(--bg-surface)",
        borderTop: "1px solid var(--border-light)",
        padding: "60px 0 30px",
        marginTop: "auto",
      }}
    >
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "40px",
            marginBottom: "50px",
          }}
        >
          {/* Brand Info */}
          <div>
            <Link
              to="/"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "16px",
              }}
            >
              <img
                src="/img/future focus classes logo.png"
                alt="Future Focus Classes Logo"
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  objectFit: "contain",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                }}
              />
              <div>
                <span style={{ fontSize: "19px", fontWeight: "800", display: "block" }}>
                  Future Focus <span style={{ color: "var(--primary)" }}>Classes</span>
                </span>
                <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: "600" }}>
                  तमसो माँ ज्योतिर्गमय • Offline & Online
                </span>
              </div>
            </Link>
            <p
              style={{
                fontSize: "14px",
                color: "var(--text-secondary)",
                lineHeight: "1.6",
                marginBottom: "20px",
              }}
            >
              Premier educational platform and coaching for Class 8th to 12th (CBSE/State Boards), 
              IIT-JEE & NEET preparation, Graduation (B.Tech, BCA, B.Sc) and modern Software Coding.
            </p>
            <div style={{ display: "flex", gap: "14px", color: "var(--text-muted)" }}>
              <a href="https://github.com" target="_blank" rel="noreferrer" title="GitHub" style={{ color: "var(--text-secondary)" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" title="Twitter" style={{ color: "var(--text-secondary)" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" title="LinkedIn" style={{ color: "var(--text-secondary)" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
              <a href="https://learnx.com" target="_blank" rel="noreferrer" title="Web" style={{ color: "var(--text-secondary)" }}>
                <Globe size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: "15px", fontWeight: "700", marginBottom: "16px" }}>
              Explore
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "14px", color: "var(--text-secondary)" }}>
              <Link to="/courses">All Courses</Link>
              <Link to="/categories">Browse Categories</Link>
              <Link to="/pricing">Pricing Plans</Link>
              <Link to="/courses?level=beginner">Beginner Tracks</Link>
            </div>
          </div>

          {/* User Portals */}
          <div>
            <h4 style={{ fontSize: "15px", fontWeight: "700", marginBottom: "16px" }}>
              Portals
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "14px", color: "var(--text-secondary)" }}>
              <Link to="/student/dashboard">Student Dashboard</Link>
              <Link to="/instructor/dashboard">Instructor Studio</Link>
              <Link to="/admin/dashboard">Admin Central</Link>
              <Link to="/verify/LX-SAMPLE-1234">Certificate Verification</Link>
            </div>
          </div>

          {/* Platform Standards */}
          <div>
            <h4 style={{ fontSize: "15px", fontWeight: "700", marginBottom: "16px" }}>
              Our Educational Promise
            </h4>
            <p style={{ fontSize: "13.5px", color: "var(--text-secondary)", lineHeight: "1.6" }}>
              Concept-clarity focused teaching, daily practice questions (DPPs), interactive quizzes, and verified certification for college tracks.
            </p>
            <div
              style={{
                marginTop: "16px",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 12px",
                borderRadius: "var(--radius-sm)",
                backgroundColor: "var(--success-light)",
                color: "var(--success)",
                fontSize: "12px",
                fontWeight: "700",
              }}
            >
              ✓ Quality Coaching Guaranteed
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: "1px solid var(--border-light)",
            paddingTop: "24px",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "13px",
            color: "var(--text-muted)",
            gap: "12px",
          }}
        >
          <div>
            © {new Date().getFullYear()} Future Focus Classes. All rights reserved.
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            Guided by <Heart size={14} color="#ef4444" fill="#ef4444" /> for Every Aspiring Student
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
