import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import CourseCard from "../../components/common/CourseCard";
import {
  BookOpen,
  Award,
  CheckCircle,
  Clock,
  ArrowRight,
  Play,
  TrendingUp,
  Sparkles,
} from "lucide-react";

const StudentDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [statsRes, enrollRes] = await Promise.all([
          api.get("student/dashboard-stats"),
          api.get("enrollments/my"),
        ]);

        if (statsRes.success) setStats(statsRes.data);
        if (enrollRes.success) setEnrollments(enrollRes.data);
      } catch (err) {
        console.error("Dashboard error:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <div className="card skeleton" style={{ height: "120px" }} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="card skeleton" style={{ height: "100px" }} />
          ))}
        </div>
      </div>
    );
  }

  // Find most recent course with progress
  const activeCourse = enrollments.find((e) => e.progress < 100) || enrollments[0];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "36px" }}>
      {/* Welcome Banner */}
      <div
        className="card"
        style={{
          padding: "32px 36px",
          background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)",
          color: "#ffffff",
          borderRadius: "var(--radius-lg)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "20px",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "var(--accent)", fontWeight: "700", marginBottom: "6px" }}>
            <Sparkles size={16} /> STUDENT DASHBOARD
          </div>
          <h1 style={{ fontSize: "28px", fontWeight: "800", marginBottom: "8px" }}>
            Welcome back, {user?.fullName}! 👋
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "15px", maxWidth: "600px" }}>
            You've completed {stats?.learningHours || 0} hours of technical study this month. Keep up the great momentum!
          </p>
        </div>

        <Link to="/courses" className="btn btn-primary btn-lg">
          Browse Catalog <ArrowRight size={16} />
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
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
            <div style={{ padding: "10px", borderRadius: "10px", backgroundColor: "var(--primary-light)", color: "var(--primary)" }}>
              <BookOpen size={20} />
            </div>
            <div>
              <div style={{ fontSize: "22px", fontWeight: "800" }}>{stats?.totalEnrolled || enrollments.length}</div>
              <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>Enrolled Courses</div>
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
            <div style={{ padding: "10px", borderRadius: "10px", backgroundColor: "var(--success-light)", color: "var(--success)" }}>
              <CheckCircle size={20} />
            </div>
            <div>
              <div style={{ fontSize: "22px", fontWeight: "800" }}>{stats?.completedCourses || 0}</div>
              <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>Completed Courses</div>
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
            <div style={{ padding: "10px", borderRadius: "10px", backgroundColor: "var(--warning-light)", color: "var(--warning)" }}>
              <Award size={20} />
            </div>
            <div>
              <div style={{ fontSize: "22px", fontWeight: "800" }}>{stats?.certificatesCount || 0}</div>
              <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>Certificates Earned</div>
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
            <div style={{ padding: "10px", borderRadius: "10px", backgroundColor: "#f3e8ff", color: "#9333ea" }}>
              <Clock size={20} />
            </div>
            <div>
              <div style={{ fontSize: "22px", fontWeight: "800" }}>{stats?.learningHours || 12}h</div>
              <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>Learning Hours</div>
            </div>
          </div>
        </div>
      </div>

      {/* Continue Learning Widget */}
      {activeCourse ? (
        <div className="card" style={{ padding: "28px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "20px" }}>
            <div>
              <span style={{ fontSize: "12px", fontWeight: "700", color: "var(--primary)", textTransform: "uppercase" }}>
                Active Module
              </span>
              <h2 style={{ fontSize: "20px", fontWeight: "800", marginTop: "2px" }}>
                Continue Learning
              </h2>
            </div>
            <Link to="/student/courses" style={{ fontSize: "13.5px", fontWeight: "600", color: "var(--primary)" }}>
              View All ({enrollments.length})
            </Link>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "24px",
              flexWrap: "wrap",
            }}
          >
            <img
              src={activeCourse.course?.thumbnail}
              alt={activeCourse.course?.title}
              style={{ width: "160px", height: "100px", borderRadius: "var(--radius-md)", objectFit: "cover" }}
            />

            <div style={{ flex: 1, minWidth: "240px" }}>
              <h3 style={{ fontSize: "17px", fontWeight: "700", marginBottom: "6px" }}>
                {activeCourse.course?.title}
              </h3>
              <p style={{ fontSize: "13.5px", color: "var(--text-muted)", marginBottom: "14px" }}>
                Instructor: {activeCourse.course?.instructor?.fullName}
              </p>

              {/* Progress Bar */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: "600", marginBottom: "6px" }}>
                  <span>Course Progress</span>
                  <span>{activeCourse.progress}% Completed</span>
                </div>
                <div style={{ width: "100%", height: "8px", backgroundColor: "var(--bg-subtle)", borderRadius: "var(--radius-full)", overflow: "hidden" }}>
                  <div
                    style={{
                      width: `${activeCourse.progress}%`,
                      height: "100%",
                      backgroundColor: "var(--primary)",
                      borderRadius: "var(--radius-full)",
                      transition: "width 0.4s ease",
                    }}
                  />
                </div>
              </div>
            </div>

            <Link
              to={`/student/learning/${activeCourse.course?._id}`}
              className="btn btn-primary"
            >
              <Play size={16} /> Resume Lesson
            </Link>
          </div>
        </div>
      ) : (
        <div className="card" style={{ textAlign: "center", padding: "50px 20px" }}>
          <BookOpen size={40} color="var(--primary)" style={{ marginBottom: "12px" }} />
          <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "6px" }}>
            You haven't enrolled in any courses yet
          </h3>
          <p style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "20px" }}>
            Start your learning path today by browsing our catalog of full-stack engineering courses.
          </p>
          <Link to="/courses" className="btn btn-primary">
            Explore Courses
          </Link>
        </div>
      )}

      {/* Recommended Courses Section */}
      {stats?.recommendedCourses?.length > 0 && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "20px" }}>
            <div>
              <span style={{ fontSize: "12px", fontWeight: "700", color: "var(--primary)", textTransform: "uppercase" }}>
                AI Recommendations
              </span>
              <h2 style={{ fontSize: "20px", fontWeight: "800", marginTop: "2px" }}>
                Recommended For You
              </h2>
            </div>
            <Link to="/courses" style={{ fontSize: "13.5px", fontWeight: "600", color: "var(--primary)" }}>
              Explore More
            </Link>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "24px",
            }}
          >
            {stats.recommendedCourses.map((c) => (
              <CourseCard key={c._id} course={c} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
