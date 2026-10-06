import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { BookOpen, Play, CheckCircle2, Award } from "lucide-react";

const MyCoursesPage = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const res = await api.get("enrollments/my");
        if (res.success) setEnrollments(res.data);
      } catch (err) {
        console.error("Could not load enrollments:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, []);

  if (loading) {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "24px" }}>
        {[1, 2, 3].map((n) => (
          <div key={n} className="card skeleton" style={{ height: "300px" }} />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "26px", fontWeight: "800", marginBottom: "6px" }}>
          My Enrolled Courses
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "14.5px" }}>
          Resume your learning progress or review completed modules.
        </p>
      </div>

      {enrollments.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "60px 20px" }}>
          <BookOpen size={44} color="var(--primary)" style={{ marginBottom: "16px" }} />
          <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "8px" }}>
            No enrolled courses yet
          </h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginBottom: "20px" }}>
            Explore our curriculum of high-impact courses and start learning today.
          </p>
          <Link to="/courses" className="btn btn-primary">
            Explore Courses
          </Link>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px" }}>
          {enrollments.map((enr) => {
            const course = enr.course;
            if (!course) return null;
            const progress = enr.progress || 0;
            const isCompleted = progress === 100;

            return (
              <div key={enr._id} className="card" style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  style={{ width: "100%", height: "170px", objectFit: "cover" }}
                />

                <div style={{ padding: "20px", display: "flex", flexDirection: "column", flex: 1 }}>
                  <div style={{ fontSize: "12px", fontWeight: "700", color: "var(--primary)", textTransform: "uppercase", marginBottom: "6px" }}>
                    {course.category?.name || "Curriculum"}
                  </div>

                  <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "12px", lineHeight: "1.4" }}>
                    {course.title}
                  </h3>

                  <div style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "16px" }}>
                    Instructor: {course.instructor?.fullName}
                  </div>

                  {/* Progress Bar */}
                  <div style={{ marginTop: "auto" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: "600", marginBottom: "6px" }}>
                      <span>Progress</span>
                      <span>{progress}%</span>
                    </div>
                    <div style={{ width: "100%", height: "6px", backgroundColor: "var(--bg-subtle)", borderRadius: "99px", overflow: "hidden", marginBottom: "16px" }}>
                      <div
                        style={{
                          width: `${progress}%`,
                          height: "100%",
                          backgroundColor: isCompleted ? "var(--success)" : "var(--primary)",
                        }}
                      />
                    </div>

                    <Link
                      to={`/student/learning/${course._id}`}
                      className={`btn ${isCompleted ? "btn-secondary" : "btn-primary"}`}
                      style={{ width: "100%" }}
                    >
                      {isCompleted ? (
                        <>
                          <CheckCircle2 size={16} color="var(--success)" /> Review Course
                        </>
                      ) : (
                        <>
                          <Play size={16} /> Continue Learning
                        </>
                      )}
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyCoursesPage;
