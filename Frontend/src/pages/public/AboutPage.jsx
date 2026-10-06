import React from "react";
import { Link } from "react-router-dom";
import { Award, BookOpen, Users, Compass, Code, CheckCircle, Sparkles } from "lucide-react";

const AboutPage = () => {
  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "60px 24px" }}>
      {/* Hero */}
      <div style={{ textAlign: "center", marginBottom: "64px" }}>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "6px 14px",
            borderRadius: "999px",
            backgroundColor: "var(--primary-light)",
            color: "var(--primary)",
            fontSize: "13px",
            fontWeight: "700",
            marginBottom: "16px",
          }}
        >
          <Sparkles size={16} /> तमसो माँ ज्योतिर्गमय • Empowering Every Student
        </span>
        <h1 style={{ fontSize: "2.8rem", fontWeight: "900", color: "var(--text-main)", marginBottom: "16px" }}>
          Empowering Students From School to Professional Heights
        </h1>
        <p style={{ fontSize: "1.15rem", color: "var(--text-secondary)", maxWidth: "720px", margin: "0 auto 32px", lineHeight: 1.6 }}>
          Future Focus Classes was founded to provide rigorous, concept-driven coaching across Class 8th to 12th Board examinations, 
          IIT-JEE & NEET preparation, Technical Graduation (B.Tech / BCA), and modern Computer Programming.
        </p>
      </div>

      {/* Values Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "24px",
          marginBottom: "64px",
        }}
      >
        <div className="card" style={{ padding: "32px", textAlign: "center" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "16px",
              backgroundColor: "var(--primary-light)",
              color: "var(--primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
            }}
          >
            <Code size={28} />
          </div>
          <h3 style={{ fontSize: "1.2rem", fontWeight: "800", marginBottom: "8px" }}>Industry-First Curriculum</h3>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)", margin: 0, lineHeight: 1.6 }}>
            Every syllabus is curated directly around enterprise development stacks: MERN, Cloud Architecture, Next.js, and DevOps.
          </p>
        </div>

        <div className="card" style={{ padding: "32px", textAlign: "center" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "16px",
              backgroundColor: "#ECFDF5",
              color: "var(--accent-green)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
            }}
          >
            <CheckCircle size={28} />
          </div>
          <h3 style={{ fontSize: "1.2rem", fontWeight: "800", marginBottom: "8px" }}>Rigorous Verification</h3>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)", margin: 0, lineHeight: 1.6 }}>
            Certificates are earned through genuine quiz pass rates and code submissions evaluated by instructors, not just clicking 'complete'.
          </p>
        </div>

        <div className="card" style={{ padding: "32px", textAlign: "center" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "16px",
              backgroundColor: "#FFFBEB",
              color: "var(--accent-amber)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
            }}
          >
            <Users size={28} />
          </div>
          <h3 style={{ fontSize: "1.2rem", fontWeight: "800", marginBottom: "8px" }}>Vibrant Community</h3>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)", margin: 0, lineHeight: 1.6 }}>
            Active discussion forums per lesson, student peer interactions, and responsive mentor feedback loops.
          </p>
        </div>
      </div>

      {/* Stats Banner */}
      <div
        className="card"
        style={{
          padding: "48px 32px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "32px",
          textAlign: "center",
          borderRadius: "var(--radius-xl)",
          backgroundColor: "var(--text-main)",
          color: "#fff",
          marginBottom: "64px",
        }}
      >
        <div>
          <div style={{ fontSize: "2.8rem", fontWeight: "900", color: "#60A5FA" }}>15,000+</div>
          <div style={{ fontSize: "14px", color: "#94A3B8", marginTop: "4px" }}>Active Students Enrolled</div>
        </div>
        <div>
          <div style={{ fontSize: "2.8rem", fontWeight: "900", color: "#34D399" }}>94.8%</div>
          <div style={{ fontSize: "14px", color: "#94A3B8", marginTop: "4px" }}>Course Completion Satisfaction</div>
        </div>
        <div>
          <div style={{ fontSize: "2.8rem", fontWeight: "900", color: "#FBBF24" }}>120+</div>
          <div style={{ fontSize: "14px", color: "#94A3B8", marginTop: "4px" }}>Industry Veteran Mentors</div>
        </div>
        <div>
          <div style={{ fontSize: "2.8rem", fontWeight: "900", color: "#A78BFA" }}>8,500+</div>
          <div style={{ fontSize: "14px", color: "#94A3B8", marginTop: "4px" }}>Verified Certificates Issued</div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ textAlign: "center" }}>
        <h2 style={{ fontSize: "2rem", fontWeight: "800", marginBottom: "16px" }}>Ready to elevate your engineering career?</h2>
        <p style={{ fontSize: "1rem", color: "var(--text-secondary)", marginBottom: "28px" }}>
          Join thousands of learners building modern web apps, mastering algorithms, and shipping production code.
        </p>
        <Link to="/courses" className="btn btn-primary btn-lg">
          Browse Course Catalog
        </Link>
      </div>
    </div>
  );
};

export default AboutPage;
