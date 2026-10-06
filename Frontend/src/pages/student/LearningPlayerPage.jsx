import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import { useApp } from "../../context/AppContext";
import {
  Play,
  CheckCircle,
  Circle,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  FileText,
  Award,
  Download,
  Bot,
  Send,
  Sparkles,
  ArrowLeft,
  HelpCircle,
} from "lucide-react";

const LearningPlayerPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useApp();

  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState({ completedLessons: [], overallPercentage: 0 });
  const [currentLesson, setCurrentLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  // AI Tutor drawer
  const [aiOpen, setAiOpen] = useState(false);
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiMessages, setAiMessages] = useState([
    {
      sender: "ai",
      text: "Hello! I am your Future Focus AI Academic Mentor. Ask me any question regarding this lecture, formulas, concepts, or problem-solving!",
    },
  ]);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    const fetchCourseAndProgress = async () => {
      try {
        const [courseRes, progRes] = await Promise.all([
          api.get(`courses/${courseId}`),
          api.get(`progress/${courseId}`),
        ]);

        if (courseRes.success) {
          setCourse(courseRes.data);

          // Find first lesson across curriculum
          const allLessons = [];
          (courseRes.data.curriculum || []).forEach((sec) => {
            (sec.lessons || []).forEach((l) => allLessons.push(l));
          });

          if (allLessons.length > 0) {
            // Pick last accessed or first incomplete or first lesson
            const firstLesson = allLessons[0];
            setCurrentLesson(firstLesson);
          }
        }

        if (progRes.success) {
          setProgress(progRes.data);
        }
      } catch (err) {
        showToast("Error loading course content: " + err.message, "error");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseAndProgress();
  }, [courseId]);

  // Flatten lessons list for Next / Prev navigation
  const allLessons = [];
  (course?.curriculum || []).forEach((sec) => {
    (sec.lessons || []).forEach((l) => allLessons.push(l));
  });

  const currentIndex = allLessons.findIndex((l) => l._id === currentLesson?._id);
  const isLessonCompleted = (lessonId) =>
    (progress.completedLessons || []).some((id) => String(id) === String(lessonId));

  const toggleLessonCompletion = async (lessonId) => {
    const currentlyDone = isLessonCompleted(lessonId);
    try {
      const res = await api.put(`progress/${courseId}/lesson/${lessonId}`, {
        isCompleted: !currentlyDone,
      });

      if (res.success) {
        setProgress(res.data);
        if (!currentlyDone && res.data.overallPercentage === 100) {
          showToast("🎉 Congratulations! You have completed 100% of the course! Your certificate is generated.", "success");
        } else {
          showToast(!currentlyDone ? "Lesson marked complete!" : "Lesson marked incomplete.", "info");
        }
      }
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const handleNextLesson = () => {
    if (currentIndex < allLessons.length - 1) {
      setCurrentLesson(allLessons[currentIndex + 1]);
    }
  };

  const handlePrevLesson = () => {
    if (currentIndex > 0) {
      setCurrentLesson(allLessons[currentIndex - 1]);
    }
  };

  // AI Tutor Ask
  const handleAskAi = async (e) => {
    e.preventDefault();
    if (!aiQuestion.trim() || aiLoading) return;

    const userText = aiQuestion.trim();
    setAiMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setAiQuestion("");
    setAiLoading(true);

    try {
      const res = await api.post("student/ai/tutor", {
        question: userText,
        courseId,
        lessonTitle: currentLesson?.title,
        lessonContent: currentLesson?.content,
      });

      if (res.success) {
        setAiMessages((prev) => [...prev, { sender: "ai", text: res.answer }]);
      }
    } catch (err) {
      setAiMessages((prev) => [
        ...prev,
        { sender: "ai", text: "Apologies, the AI service is currently unavailable. Please try again shortly." },
      ]);
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="card skeleton" style={{ width: "80%", height: "80%" }} />
      </div>
    );
  }

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#0f172a", color: "#ffffff", overflow: "hidden" }}>
      {/* Top Learning Navigation Bar */}
      <header
        style={{
          height: "60px",
          backgroundColor: "#020617",
          borderBottom: "1px solid #1e293b",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Link to="/student/courses" style={{ color: "#94a3b8", display: "flex", alignItems: "center", gap: "6px", fontSize: "13.5px" }}>
            <ArrowLeft size={16} /> My Courses
          </Link>
          <span style={{ color: "#334155" }}>|</span>
          <span style={{ fontWeight: "700", fontSize: "14px", color: "#f8fafc", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden", maxWidth: "450px" }}>
            {course?.title}
          </span>
        </div>

        {/* Progress & AI Tutor Button */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px" }}>
            <span style={{ color: "#94a3b8" }}>Progress:</span>
            <div style={{ width: "100px", height: "6px", backgroundColor: "#1e293b", borderRadius: "99px", overflow: "hidden" }}>
              <div style={{ width: `${progress.overallPercentage}%`, height: "100%", backgroundColor: "var(--success)" }} />
            </div>
            <span style={{ fontWeight: "700", color: "var(--success)" }}>{progress.overallPercentage}%</span>
          </div>

          <button
            onClick={() => setAiOpen(!aiOpen)}
            className="btn btn-sm"
            style={{
              backgroundColor: aiOpen ? "var(--primary)" : "#1e293b",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Bot size={16} /> AI Tutor Assistant
          </button>
        </div>
      </header>

      {/* Main Workspace (Player + Curriculum Sidebar) */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Left: Video / Content Player & Lesson Notes */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflowY: "auto", padding: "24px", gap: "20px" }}>
          {/* Video Player Frame */}
          <div
            style={{
              width: "100%",
              maxWidth: "1000px",
              margin: "0 auto",
              aspectRatio: "16/9",
              backgroundColor: "#000000",
              borderRadius: "var(--radius-lg)",
              overflow: "hidden",
              boxShadow: "0 20px 25px -5px rgba(0,0,0,0.5)",
              position: "relative",
            }}
          >
            {currentLesson?.videoUrl ? (
              <video
                key={currentLesson._id}
                src={currentLesson.videoUrl}
                controls
                autoPlay
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
                onEnded={() => {
                  if (!isLessonCompleted(currentLesson._id)) {
                    toggleLessonCompletion(currentLesson._id);
                  }
                }}
              />
            ) : (
              <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px", textAlign: "center" }}>
                <BookOpen size={48} color="var(--primary)" style={{ marginBottom: "16px" }} />
                <h3>Reading Article / Resource Lesson</h3>
                <p style={{ color: "#94a3b8", maxWidth: "500px", marginTop: "8px" }}>
                  Please read the notes below and mark the lesson complete when finished.
                </p>
              </div>
            )}
          </div>

          {/* Lesson Navigation & Controls */}
          <div
            style={{
              maxWidth: "1000px",
              width: "100%",
              margin: "0 auto",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "16px",
              paddingBottom: "16px",
              borderBottom: "1px solid #1e293b",
            }}
          >
            <div>
              <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#f8fafc" }}>
                {currentLesson?.title || "Lesson"}
              </h2>
              <div style={{ fontSize: "13px", color: "#94a3b8", marginTop: "4px" }}>
                Estimated time: {currentLesson?.durationMinutes || 10} minutes
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              {currentLesson && (
                <button
                  onClick={() => toggleLessonCompletion(currentLesson._id)}
                  className={`btn ${isLessonCompleted(currentLesson._id) ? "btn-secondary" : "btn-primary"} btn-sm`}
                >
                  {isLessonCompleted(currentLesson._id) ? (
                    <>
                      <CheckCircle size={16} color="var(--success)" /> Completed
                    </>
                  ) : (
                    <>
                      <Circle size={16} /> Mark as Complete
                    </>
                  )}
                </button>
              )}

              <button
                onClick={handlePrevLesson}
                disabled={currentIndex <= 0}
                className="btn btn-secondary btn-sm"
                style={{ opacity: currentIndex <= 0 ? 0.4 : 1 }}
              >
                <ChevronLeft size={16} /> Previous
              </button>

              <button
                onClick={handleNextLesson}
                disabled={currentIndex >= allLessons.length - 1}
                className="btn btn-secondary btn-sm"
                style={{ opacity: currentIndex >= allLessons.length - 1 ? 0.4 : 1 }}
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Lesson Notes & Description */}
          <div style={{ maxWidth: "1000px", width: "100%", margin: "0 auto" }}>
            <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "10px", color: "#f8fafc" }}>
              Lesson Notes & Resources
            </h3>
            <div
              style={{
                backgroundColor: "#1e293b",
                borderRadius: "var(--radius-md)",
                padding: "20px",
                lineHeight: "1.7",
                color: "#cbd5e1",
                fontSize: "14.5px",
              }}
            >
              {currentLesson?.content || currentLesson?.description || (
                <p>No supplementary notes attached for this lesson.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right: Curriculum Navigation Sidebar */}
        <aside
          style={{
            width: "360px",
            backgroundColor: "#020617",
            borderLeft: "1px solid #1e293b",
            display: "flex",
            flexDirection: "column",
            flexShrink: 0,
          }}
        >
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #1e293b", fontWeight: "800", fontSize: "15px" }}>
            Course Curriculum
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "12px" }}>
            {course?.curriculum?.map((section, sIdx) => (
              <div key={section._id} style={{ marginBottom: "16px" }}>
                <div style={{ fontSize: "12.5px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", padding: "6px 8px" }}>
                  {section.title}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  {section.lessons?.map((lesson) => {
                    const isCurrent = currentLesson?._id === lesson._id;
                    const done = isLessonCompleted(lesson._id);

                    return (
                      <button
                        key={lesson._id}
                        onClick={() => setCurrentLesson(lesson)}
                        style={{
                          width: "100%",
                          textAlign: "left",
                          padding: "10px 12px",
                          borderRadius: "var(--radius-sm)",
                          backgroundColor: isCurrent ? "#1e293b" : "transparent",
                          border: isCurrent ? "1px solid var(--primary)" : "1px solid transparent",
                          color: isCurrent ? "#ffffff" : "#94a3b8",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          fontSize: "13.5px",
                          transition: "var(--transition)",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", overflow: "hidden" }}>
                          {done ? (
                            <CheckCircle size={16} color="var(--success)" style={{ flexShrink: 0 }} />
                          ) : (
                            <Play size={14} color={isCurrent ? "var(--primary)" : "#64748b"} style={{ flexShrink: 0 }} />
                          )}
                          <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {lesson.title}
                          </span>
                        </div>
                        <span style={{ fontSize: "12px", color: "#64748b" }}>{lesson.durationMinutes}m</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* AI Tutor Assistant Drawer (Collapsible) */}
        {aiOpen && (
          <aside
            style={{
              width: "380px",
              backgroundColor: "#020617",
              borderLeft: "1px solid #1e293b",
              display: "flex",
              flexDirection: "column",
              flexShrink: 0,
              zIndex: 50,
            }}
          >
            <div
              style={{
                padding: "14px 20px",
                borderBottom: "1px solid #1e293b",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "700", fontSize: "14px" }}>
                <Sparkles size={16} color="var(--accent)" /> AI Tutor Assistant
              </div>
              <button onClick={() => setAiOpen(false)} style={{ color: "#94a3b8" }}>✕</button>
            </div>

            {/* Chat Messages */}
            <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "14px" }}>
              {aiMessages.map((msg, i) => (
                <div
                  key={i}
                  style={{
                    alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                    maxWidth: "85%",
                    padding: "10px 14px",
                    borderRadius: "12px",
                    fontSize: "13.5px",
                    lineHeight: "1.5",
                    backgroundColor: msg.sender === "user" ? "var(--primary)" : "#1e293b",
                    color: "#ffffff",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {msg.text}
                </div>
              ))}
              {aiLoading && (
                <div style={{ alignSelf: "flex-start", padding: "8px 12px", backgroundColor: "#1e293b", borderRadius: "10px", fontSize: "12px", color: "#94a3b8" }}>
                  Thinking...
                </div>
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleAskAi} style={{ padding: "14px", borderTop: "1px solid #1e293b", display: "flex", gap: "8px" }}>
              <input
                type="text"
                placeholder="Ask about this lesson..."
                value={aiQuestion}
                onChange={(e) => setAiQuestion(e.target.value)}
                style={{
                  flex: 1,
                  padding: "10px 12px",
                  borderRadius: "8px",
                  backgroundColor: "#0f172a",
                  border: "1px solid #334155",
                  color: "#ffffff",
                  fontSize: "13px",
                  outline: "none",
                }}
              />
              <button type="submit" disabled={aiLoading} className="btn btn-primary btn-sm">
                <Send size={15} />
              </button>
            </form>
          </aside>
        )}
      </div>
    </div>
  );
};

export default LearningPlayerPage;
