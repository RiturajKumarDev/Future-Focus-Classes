import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import CourseCard from "../../components/common/CourseCard";
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  Award,
  CheckCircle,
  Users,
  Code,
  GraduationCap,
  Target,
  Library,
  Star,
  PlayCircle,
  Clock,
  Compass,
} from "lucide-react";

const HomePage = () => {
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseRes, catRes] = await Promise.all([
          api.get("courses?limit=6"),
          api.get("categories"),
        ]);
        if (courseRes.success) setFeaturedCourses(courseRes.data);
        if (catRes.success) setCategories(catRes.data);
      } catch (err) {
        console.warn("Could not load homepage data:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getCategoryIcon = (iconName) => {
    switch (iconName) {
      case "BookOpen":
        return <BookOpen size={24} />;
      case "GraduationCap":
        return <GraduationCap size={24} />;
      case "Target":
        return <Target size={24} />;
      case "Library":
        return <Library size={24} />;
      case "Code":
      default:
        return <Code size={24} />;
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "70px" }}>
      {/* Hero Section */}
      <section
        style={{
          padding: "70px 0 50px",
          background: "radial-gradient(ellipse at 50% -20%, rgba(79, 70, 229, 0.12), transparent 70%)",
        }}
      >
        <div className="container" style={{ textAlign: "center", maxWidth: "980px" }}>
          {/* Institution Logo & Sanskrit Motto Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              padding: "8px 18px",
              borderRadius: "var(--radius-full)",
              backgroundColor: "var(--bg-surface)",
              boxShadow: "var(--shadow-sm)",
              border: "1px solid var(--border-light)",
              marginBottom: "24px",
            }}
          >
            <img
              src="/img/future focus classes logo.png"
              alt="Future Focus Classes Logo"
              style={{ width: "28px", height: "28px", borderRadius: "50%", objectFit: "contain" }}
            />
            <span style={{ fontSize: "13px", fontWeight: "700", color: "var(--primary)" }}>
              तमसो माँ ज्योतिर्गमय • Offline & Online Institute
            </span>
          </div>

          <h1
            style={{
              fontSize: "clamp(34px, 5vw, 56px)",
              fontWeight: "900",
              lineHeight: "1.18",
              letterSpacing: "-1.2px",
              color: "var(--text-main)",
              marginBottom: "18px",
            }}
          >
            Shape Your Academic Future With{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Future Focus Classes
            </span>
          </h1>

          <p
            style={{
              fontSize: "clamp(16px, 2vw, 18.5px)",
              color: "var(--text-secondary)",
              lineHeight: "1.6",
              marginBottom: "32px",
              maxWidth: "760px",
              margin: "0 auto 32px",
            }}
          >
            Quality education spanning <strong>Class 8th to 12th Boards</strong>, 
            <strong> IIT-JEE & NEET</strong> target batches, <strong>Graduation (B.Tech / BCA / B.Sc)</strong>, 
            and modern <strong>Full-Stack Coding & Computer Skills</strong>.
          </p>

          {/* Quick Track Filter Pills */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "10px",
              flexWrap: "wrap",
              marginBottom: "36px",
            }}
          >
            <Link to="/courses?category=class-8-10-foundation" className="btn btn-secondary btn-sm" style={{ borderRadius: "999px" }}>
              🏫 Class 8-10 Boards
            </Link>
            <Link to="/courses?category=class-11-12-boards" className="btn btn-secondary btn-sm" style={{ borderRadius: "999px" }}>
              🔬 Class 11-12 PCM/PCB
            </Link>
            <Link to="/courses?category=competition-exams" className="btn btn-secondary btn-sm" style={{ borderRadius: "999px" }}>
              🎯 IIT-JEE & NEET
            </Link>
            <Link to="/courses?category=graduation-college" className="btn btn-secondary btn-sm" style={{ borderRadius: "999px" }}>
              🎓 College / B.Tech
            </Link>
            <Link to="/courses?category=coding-skills" className="btn btn-secondary btn-sm" style={{ borderRadius: "999px" }}>
              💻 Coding & Software
            </Link>
          </div>

          {/* Primary CTA Buttons */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "16px",
              flexWrap: "wrap",
            }}
          >
            <Link to="/courses" className="btn btn-primary btn-lg">
              Explore All Batches & Courses <ArrowRight size={18} />
            </Link>
            <Link to="/courses?priceType=free" className="btn btn-secondary btn-lg">
              <PlayCircle size={18} /> Free Foundation Previews
            </Link>
          </div>

          {/* Quick Metrics */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: "20px",
              marginTop: "50px",
              padding: "24px",
              borderRadius: "var(--radius-lg)",
              backgroundColor: "var(--bg-surface)",
              boxShadow: "var(--shadow-md)",
              border: "1px solid var(--border-light)",
            }}
          >
            <div>
              <div style={{ fontSize: "28px", fontWeight: "800", color: "var(--primary)" }}>5,000+</div>
              <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>Enrolled Students</div>
            </div>
            <div>
              <div style={{ fontSize: "28px", fontWeight: "800", color: "var(--text-main)" }}>95%+</div>
              <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>Board Exam Success</div>
            </div>
            <div>
              <div style={{ fontSize: "28px", fontWeight: "800", color: "var(--success)" }}>14+</div>
              <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>Years Teaching Legacy</div>
            </div>
            <div>
              <div style={{ fontSize: "28px", fontWeight: "800", color: "var(--warning)" }}>4.9★</div>
              <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>Student & Parent Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Academic Streams & Categories */}
      <section className="container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "32px" }}>
          <div>
            <span style={{ fontSize: "13px", fontWeight: "700", color: "var(--primary)", textTransform: "uppercase" }}>
              Our Academic Streams
            </span>
            <h2 style={{ fontSize: "30px", fontWeight: "800", marginTop: "4px" }}>
              Coaching & Curriculum Tracks
            </h2>
          </div>
          <Link to="/categories" className="btn btn-secondary btn-sm">
            View All Streams <ArrowRight size={14} />
          </Link>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px",
          }}
        >
          {categories.map((cat) => (
            <Link
              key={cat._id}
              to={`/courses?category=${cat.slug}`}
              className="card"
              style={{
                padding: "24px",
                display: "flex",
                alignItems: "flex-start",
                gap: "16px",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "14px",
                  backgroundColor: "var(--primary-light)",
                  color: "var(--primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {getCategoryIcon(cat.icon)}
              </div>
              <div>
                <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "4px" }}>
                  {cat.name}
                </h3>
                <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.4, margin: "0 0 6px" }}>
                  {cat.description?.slice(0, 75)}...
                </p>
                <span style={{ fontSize: "12px", color: "var(--primary)", fontWeight: "600" }}>
                  Browse Batches →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Courses / Batches */}
      <section className="container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "32px" }}>
          <div>
            <span style={{ fontSize: "13px", fontWeight: "700", color: "var(--primary)", textTransform: "uppercase" }}>
              Featured Batches
            </span>
            <h2 style={{ fontSize: "30px", fontWeight: "800", marginTop: "4px" }}>
              Popular Courses & Test Series
            </h2>
          </div>
          <Link to="/courses" className="btn btn-secondary btn-sm">
            Browse All Batches <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
            {[1, 2, 3].map((n) => (
              <div key={n} className="card skeleton" style={{ height: "360px" }} />
            ))}
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "24px",
            }}
          >
            {featuredCourses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        )}
      </section>

      {/* Educational Pillars Section */}
      <section style={{ backgroundColor: "var(--bg-surface)", padding: "70px 0", borderTop: "1px solid var(--border-light)", borderBottom: "1px solid var(--border-light)" }}>
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: "680px", margin: "0 auto 48px" }}>
            <span style={{ fontSize: "13px", fontWeight: "700", color: "var(--primary)", textTransform: "uppercase" }}>
              Why Future Focus Classes
            </span>
            <h2 style={{ fontSize: "32px", fontWeight: "800", marginTop: "6px" }}>
              The Future Focus Advantage
            </h2>
            <p style={{ fontSize: "15px", color: "var(--text-secondary)", marginTop: "8px" }}>
              Combining traditional classroom discipline with modern LMS technology to empower every learner.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "28px",
            }}
          >
            <div className="card" style={{ padding: "30px" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  backgroundColor: "var(--primary-light)",
                  color: "var(--primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "20px",
                }}
              >
                <BookOpen size={24} />
              </div>
              <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "10px" }}>
                Crystal Clear Concept Lectures
              </h3>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: "1.6" }}>
                Detailed derivations, step-by-step proofs, and practical demonstrations that make complex concepts easy to absorb.
              </p>
            </div>

            <div className="card" style={{ padding: "30px" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  backgroundColor: "var(--success-light)",
                  color: "var(--success)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "20px",
                }}
              >
                <Target size={24} />
              </div>
              <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "10px" }}>
                DPPs & Timed Mock Tests
              </h3>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: "1.6" }}>
                Chapter-wise Daily Practice Problems (DPPs), board exam question banks, and competitive test series with instant score analysis.
              </p>
            </div>

            <div className="card" style={{ padding: "30px" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  backgroundColor: "var(--warning-light)",
                  color: "var(--warning)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "20px",
                }}
              >
                <Award size={24} />
              </div>
              <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "10px" }}>
                Recognized Certificates & Badges
              </h3>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: "1.6" }}>
                Earn verified certificates with unique cryptographic IDs for college graduation tracks, coding bootcamps, and board achievements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Offline Coaching & Admissions Banner */}
      <section className="container">
        <div
          style={{
            backgroundColor: "var(--secondary)",
            borderRadius: "var(--radius-lg)",
            padding: "50px 40px",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "24px",
          }}
        >
          <div style={{ maxWidth: "600px" }}>
            <span style={{ fontSize: "13px", fontWeight: "700", color: "var(--accent)", textTransform: "uppercase" }}>
              Admissions Open 2026-27
            </span>
            <h2 style={{ fontSize: "28px", fontWeight: "800", margin: "8px 0 12px" }}>
              Join Future Focus Classes Offline & Online Batches
            </h2>
            <p style={{ fontSize: "15px", color: "var(--text-muted)", lineHeight: "1.6" }}>
              Enroll today in our comprehensive coaching batches for Class 8th-12th Boards, IIT-JEE, NEET, and Computer Programming.
            </p>
          </div>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Link to="/contact" className="btn btn-secondary btn-lg" style={{ color: "var(--text-main)" }}>
              Contact Institute
            </Link>
            <Link to="/courses" className="btn btn-primary btn-lg">
              Explore Batches <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
