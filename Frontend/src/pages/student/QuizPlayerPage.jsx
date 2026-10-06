import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import { useApp } from "../../context/AppContext";
import {
  HelpCircle,
  Clock,
  Award,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Check,
} from "lucide-react";

const QuizPlayerPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useApp();

  const [quiz, setQuiz] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { [qId]: [selectedOptionIndex] }
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await api.get(`quizzes/${id}`);
        if (res.success) {
          setQuiz(res.data);
        }
      } catch (err) {
        showToast("Error loading quiz: " + err.message, "error");
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id]);

  const handleSelectOption = (questionId, optionIndex) => {
    if (result) return; // Locked once evaluated
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: [optionIndex],
    }));
  };

  const handleSubmitQuiz = async () => {
    if (!quiz) return;

    // Check if all answered
    const answeredCount = Object.keys(selectedAnswers).length;
    if (answeredCount < quiz.questions.length) {
      if (!window.confirm(`You answered ${answeredCount} of ${quiz.questions.length} questions. Submit anyway?`)) {
        return;
      }
    }

    setSubmitting(true);
    try {
      const payloadAnswers = Object.entries(selectedAnswers).map(([qId, indices]) => ({
        questionId: qId,
        selectedOptions: indices,
      }));

      const res = await api.post(`quizzes/${id}/submit`, { answers: payloadAnswers });
      if (res.success) {
        setResult(res.data);
        showToast(res.message, res.data.passed ? "success" : "warning");
      }
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetry = () => {
    setSelectedAnswers({});
    setResult(null);
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: "80px 24px", textAlign: "center" }}>
        <div className="card skeleton" style={{ height: "400px", maxWidth: "760px", margin: "0 auto" }} />
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="container" style={{ padding: "80px 24px", textAlign: "center" }}>
        <h2>Quiz Not Found</h2>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: "800px", padding: "40px 24px 80px" }}>
      {/* Quiz Header */}
      <div className="card" style={{ padding: "28px", marginBottom: "28px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <span className="badge badge-primary" style={{ marginBottom: "8px" }}>Assessment</span>
            <h1 style={{ fontSize: "24px", fontWeight: "800", color: "var(--text-main)", marginBottom: "6px" }}>
              {quiz.title}
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
              {quiz.description || "Answer the questions below to test your understanding."}
            </p>
          </div>

          <div style={{ display: "flex", gap: "16px", fontSize: "13px", color: "var(--text-muted)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Clock size={16} /> {quiz.timeLimitMinutes} Mins
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Award size={16} /> Passing: {quiz.passingPercentage}%
            </div>
          </div>
        </div>
      </div>

      {/* Result Card (shown after submission) */}
      {result && (
        <div
          className="card"
          style={{
            padding: "30px",
            marginBottom: "32px",
            borderLeft: `6px solid ${result.passed ? "var(--success)" : "var(--danger)"}`,
            backgroundColor: result.passed ? "#f0fdf4" : "#fef2f2",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                {result.passed ? (
                  <CheckCircle2 size={28} color="var(--success)" />
                ) : (
                  <XCircle size={28} color="var(--danger)" />
                )}
                <h2 style={{ fontSize: "22px", fontWeight: "800", color: result.passed ? "var(--success)" : "var(--danger)" }}>
                  {result.passed ? "Passed! Excellent Job! 🎉" : "Did Not Pass - Keep Learning!"}
                </h2>
              </div>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
                Score: <strong>{result.totalScore} / {result.maxScore}</strong> ({result.percentage}%) • Required: {result.passingPercentage}%
              </p>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              {quiz.canAttempt && (
                <button onClick={handleRetry} className="btn btn-secondary btn-sm">
                  <RotateCcw size={15} /> Retake Quiz
                </button>
              )}
              <button onClick={() => navigate(-1)} className="btn btn-primary btn-sm">
                Continue Learning
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Questions List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {quiz.questions.map((q, qIndex) => {
          const evalResult = result?.evaluatedAnswers?.find((ea) => ea.questionId === q._id);
          const selected = selectedAnswers[q._id] || [];

          return (
            <div key={q._id} className="card" style={{ padding: "26px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                <span style={{ fontSize: "13px", fontWeight: "700", color: "var(--primary)" }}>
                  Question {qIndex + 1} of {quiz.questions.length}
                </span>
                <span style={{ fontSize: "12.5px", color: "var(--text-muted)" }}>
                  {q.marks || 1} Marks
                </span>
              </div>

              <h3 style={{ fontSize: "16px", fontWeight: "700", lineHeight: "1.5", marginBottom: "20px" }}>
                {q.questionText}
              </h3>

              {/* Options */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {q.options.map((opt, optIndex) => {
                  const isChosen = selected.includes(optIndex);
                  let optStyle = {
                    border: "1px solid var(--border-light)",
                    backgroundColor: "var(--bg-surface)",
                  };

                  if (result && evalResult) {
                    if (evalResult.correctOptions.includes(optIndex)) {
                      optStyle = {
                        border: "2px solid var(--success)",
                        backgroundColor: "var(--success-light)",
                        color: "#065f46",
                      };
                    } else if (isChosen && !evalResult.isCorrect) {
                      optStyle = {
                        border: "2px solid var(--danger)",
                        backgroundColor: "var(--danger-light)",
                        color: "#991b1b",
                      };
                    }
                  } else if (isChosen) {
                    optStyle = {
                      border: "2px solid var(--primary)",
                      backgroundColor: "var(--primary-light)",
                      color: "var(--primary)",
                    };
                  }

                  return (
                    <button
                      key={optIndex}
                      type="button"
                      disabled={!!result}
                      onClick={() => handleSelectOption(q._id, optIndex)}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        padding: "14px 18px",
                        borderRadius: "var(--radius-md)",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        fontSize: "14.5px",
                        fontWeight: isChosen ? "700" : "500",
                        transition: "var(--transition)",
                        cursor: result ? "default" : "pointer",
                        ...optStyle,
                      }}
                    >
                      <div
                        style={{
                          width: "22px",
                          height: "22px",
                          borderRadius: "50%",
                          border: isChosen ? "2px solid currentColor" : "2px solid #cbd5e1",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        {isChosen && <Check size={14} />}
                      </div>
                      <span>{opt.text}</span>
                    </button>
                  );
                })}
              </div>

              {/* Explanation after submission */}
              {evalResult?.explanation && (
                <div
                  style={{
                    marginTop: "16px",
                    padding: "12px 16px",
                    borderRadius: "var(--radius-md)",
                    backgroundColor: "var(--bg-subtle)",
                    fontSize: "13.5px",
                    color: "var(--text-secondary)",
                    lineHeight: "1.5",
                  }}
                >
                  <strong>Explanation:</strong> {evalResult.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Submit Button */}
      {!result && (
        <div style={{ marginTop: "32px", textAlign: "right" }}>
          <button
            onClick={handleSubmitQuiz}
            disabled={submitting}
            className="btn btn-primary btn-lg"
          >
            {submitting ? "Evaluating Score..." : "Submit Assessment"} <ArrowRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizPlayerPage;
