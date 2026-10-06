import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { useApp } from "../../context/AppContext";
import { CheckSquare, ExternalLink, Award, User } from "lucide-react";

const InstructorSubmissionsPage = () => {
  const { showToast } = useApp();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gradingId, setGradingId] = useState(null);
  const [gradeData, setGradeData] = useState({ score: 90, feedback: "Great work!" });

  useEffect(() => {
    // For demo purposes, we fetch submissions for the first course
    api.get("instructor/dashboard").then(async (res) => {
      if (res.success && res.data.courses?.length > 0) {
        // Fetch submissions
        setSubmissions([
          {
            _id: "sub_1",
            assignmentTitle: "Capstone Project: Build an RBAC Protected Microservice",
            studentName: "Alex Rivera",
            studentEmail: "student@learnx.com",
            githubUrl: "https://github.com/alexrivera/learnx-rbac-service",
            liveUrl: "https://rbac-service-demo.render.com",
            submissionText: "Implemented full JWT cookie handling, role authorization middleware, and automated unit tests.",
            status: "submitted",
            score: null,
            maxMarks: 100,
          },
        ]);
      }
      setLoading(false);
    });
  }, []);

  const handleGrade = (subId) => {
    setSubmissions((prev) =>
      prev.map((s) =>
        s._id === subId ? { ...s, status: "graded", score: gradeData.score, feedback: gradeData.feedback } : s
      )
    );
    setGradingId(null);
    showToast("Submission successfully graded and student notified! 📝", "success");
  };

  return (
    <div>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "26px", fontWeight: "800", marginBottom: "6px" }}>
          Student Assignment Submissions
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "14.5px" }}>
          Review student project code repositories, assign scores, and provide actionable feedback.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {submissions.map((sub) => (
          <div key={sub._id} className="card" style={{ padding: "28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px", marginBottom: "16px" }}>
              <div>
                <span className="badge badge-primary" style={{ marginBottom: "6px" }}>
                  {sub.assignmentTitle}
                </span>
                <div style={{ fontSize: "16px", fontWeight: "700" }}>
                  Submitted by {sub.studentName} ({sub.studentEmail})
                </div>
              </div>

              <span className={`badge ${sub.status === "graded" ? "badge-success" : "badge-warning"}`}>
                {sub.status === "graded" ? `Graded: ${sub.score}/${sub.maxMarks}` : "Needs Grading"}
              </span>
            </div>

            <p style={{ color: "var(--text-secondary)", fontSize: "14.5px", lineHeight: "1.6", marginBottom: "16px" }}>
              {sub.submissionText}
            </p>

            <div style={{ display: "flex", gap: "16px", marginBottom: "20px" }}>
              {sub.githubUrl && (
                <a
                  href={sub.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary btn-sm"
                >
                  <ExternalLink size={14} /> View GitHub Repo
                </a>
              )}
              {sub.liveUrl && (
                <a
                  href={sub.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary btn-sm"
                >
                  <ExternalLink size={14} /> Live Deployment
                </a>
              )}
            </div>

            {/* Grading Form Modal or Toggle */}
            {gradingId === sub._id ? (
              <div style={{ padding: "20px", backgroundColor: "var(--bg-subtle)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-light)" }}>
                <h4 style={{ fontSize: "15px", fontWeight: "700", marginBottom: "12px" }}>Grade Submission</h4>
                <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: "14px", marginBottom: "14px" }}>
                  <div>
                    <label className="form-label">Score (Max {sub.maxMarks})</label>
                    <input
                      type="number"
                      value={gradeData.score}
                      onChange={(e) => setGradeData({ ...gradeData, score: Number(e.target.value) })}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="form-label">Feedback</label>
                    <input
                      type="text"
                      value={gradeData.feedback}
                      onChange={(e) => setGradeData({ ...gradeData, feedback: e.target.value })}
                      className="form-input"
                    />
                  </div>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button onClick={() => handleGrade(sub._id)} className="btn btn-primary btn-sm">
                    Submit Grade
                  </button>
                  <button onClick={() => setGradingId(null)} className="btn btn-secondary btn-sm">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <button onClick={() => setGradingId(sub._id)} className="btn btn-outline btn-sm">
                  <CheckSquare size={14} /> {sub.status === "graded" ? "Update Score" : "Grade This Submission"}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default InstructorSubmissionsPage;
