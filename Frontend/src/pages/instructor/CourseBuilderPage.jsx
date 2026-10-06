import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import { useApp } from "../../context/AppContext";
import {
  Save,
  Plus,
  Trash2,
  Play,
  Layers,
  ArrowLeft,
  CheckCircle,
  Clock,
} from "lucide-react";

const CourseBuilderPage = () => {
  const { id } = useParams(); // If present, edit mode
  const navigate = useNavigate();
  const { showToast } = useApp();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    category: "",
    level: "all",
    isFree: false,
    price: 1999,
    discountPrice: 999,
    thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800",
    description: "",
    requirements: [""],
    learningOutcomes: [""],
  });

  // Curriculum state (used when editing or after course is created)
  const [createdCourseId, setCreatedCourseId] = useState(id || null);
  const [sections, setSections] = useState([]);
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [newLessonData, setNewLessonData] = useState({
    sectionId: "",
    title: "",
    videoUrl: "",
    durationMinutes: 15,
    isFreePreview: false,
  });

  useEffect(() => {
    api.get("categories").then((res) => {
      if (res.success && res.data.length > 0) {
        setCategories(res.data);
        if (!formData.category) {
          setFormData((prev) => ({ ...prev, category: res.data[0]._id }));
        }
      }
    });

    if (id) {
      api.get(`courses/${id}`).then((res) => {
        if (res.success) {
          const c = res.data;
          setFormData({
            title: c.title,
            subtitle: c.subtitle || "",
            category: c.category?._id || c.category,
            level: c.level,
            isFree: c.pricing?.isFree,
            price: c.pricing?.price || 0,
            discountPrice: c.pricing?.discountPrice || 0,
            thumbnail: c.thumbnail,
            description: c.description,
            requirements: c.requirements?.length > 0 ? c.requirements : [""],
            learningOutcomes: c.learningOutcomes?.length > 0 ? c.learningOutcomes : [""],
          });
          setSections(c.curriculum || []);
          setCreatedCourseId(c._id);
        }
      });
    }
  }, [id]);

  const handleArrayChange = (field, index, value) => {
    const list = [...formData[field]];
    list[index] = value;
    setFormData({ ...formData, [field]: list });
  };

  const handleAddArrayItem = (field) => {
    setFormData({ ...formData, [field]: [...formData[field], ""] });
  };

  const handleRemoveArrayItem = (field, index) => {
    const list = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: list.length > 0 ? list : [""] });
  };

  // Submit Course Basic Info
  const handleSaveCourse = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.category) {
      showToast("Please fill in course title, category, and description", "error");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        title: formData.title,
        subtitle: formData.subtitle,
        category: formData.category,
        level: formData.level,
        description: formData.description,
        thumbnail: formData.thumbnail,
        pricing: {
          isFree: formData.isFree,
          price: Number(formData.price),
          discountPrice: Number(formData.discountPrice),
        },
        requirements: formData.requirements.filter(Boolean),
        learningOutcomes: formData.learningOutcomes.filter(Boolean),
      };

      let res;
      if (createdCourseId) {
        res = await api.put(`courses/${createdCourseId}`, payload);
      } else {
        res = await api.post("courses", payload);
      }

      if (res.success) {
        setCreatedCourseId(res.data._id);
        showToast(createdCourseId ? "Course updated!" : "Course draft created! Now add your lessons below.", "success");
      }
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // Add Section to Course
  const handleAddSection = async () => {
    if (!newSectionTitle.trim() || !createdCourseId) return;

    try {
      const res = await api.post(`courses/${createdCourseId}/sections`, {
        title: newSectionTitle.trim(),
        order: sections.length + 1,
      });

      if (res.success) {
        setSections([...sections, { ...res.data, lessons: [] }]);
        setNewSectionTitle("");
        showToast("Section added!", "success");
      }
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  // Add Lesson to Section
  const handleAddLesson = async (sectionId) => {
    if (!newLessonData.title.trim() || !createdCourseId) return;

    try {
      const res = await api.post(`courses/${createdCourseId}/sections/${sectionId}/lessons`, {
        title: newLessonData.title.trim(),
        videoUrl: newLessonData.videoUrl.trim() || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        durationMinutes: Number(newLessonData.durationMinutes) || 15,
        isFreePreview: newLessonData.isFreePreview,
      });

      if (res.success) {
        setSections((prev) =>
          prev.map((s) =>
            s._id === sectionId ? { ...s, lessons: [...(s.lessons || []), res.data] } : s
          )
        );
        setNewLessonData({ sectionId: "", title: "", videoUrl: "", durationMinutes: 15, isFreePreview: false });
        showToast("Lesson added to section!", "success");
      }
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  // Publish / Submit for Review
  const handleSubmitReview = async () => {
    if (!createdCourseId) return;
    try {
      const res = await api.patch(`courses/${createdCourseId}/status`, {
        status: "PENDING_REVIEW",
      });
      if (res.success) {
        showToast("Course submitted for admin moderation! 🎉", "success");
        navigate("/instructor/dashboard");
      }
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  return (
    <div style={{ maxWidth: "900px", display: "flex", flexDirection: "column", gap: "36px" }}>
      {/* Top Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <button onClick={() => navigate(-1)} style={{ color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "6px", fontSize: "13.5px", marginBottom: "8px" }}>
            <ArrowLeft size={16} /> Back
          </button>
          <h1 style={{ fontSize: "26px", fontWeight: "800" }}>
            {id ? "Edit Course Curriculum" : "Create New Course"}
          </h1>
        </div>

        {createdCourseId && (
          <button onClick={handleSubmitReview} className="btn btn-primary">
            <CheckCircle size={16} /> Submit for Review
          </button>
        )}
      </div>

      {/* Basic Course Info Form */}
      <div className="card" style={{ padding: "32px" }}>
        <h2 style={{ fontSize: "18px", fontWeight: "800", marginBottom: "20px" }}>
          1. Course Essentials
        </h2>

        <form onSubmit={handleSaveCourse}>
          <div className="form-group">
            <label className="form-label">Course Title *</label>
            <input
              type="text"
              placeholder="e.g. Master Full Stack Engineering with React & Node.js"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Subtitle / Hook</label>
            <input
              type="text"
              placeholder="A short compelling overview of the course"
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              className="form-input"
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="form-input"
                required
              >
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Target Level</label>
              <select
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                className="form-input"
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Price (INR)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Thumbnail URL</label>
            <input
              type="text"
              value={formData.thumbnail}
              onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Comprehensive Description *</label>
            <textarea
              rows="4"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="form-input"
              required
            />
          </div>

          {/* Learning Outcomes Builder */}
          <div style={{ marginBottom: "20px" }}>
            <label className="form-label">What Students Will Learn</label>
            {formData.learningOutcomes.map((item, index) => (
              <div key={index} style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                <input
                  type="text"
                  placeholder="e.g. Build production microservices with Docker"
                  value={item}
                  onChange={(e) => handleArrayChange("learningOutcomes", index, e.target.value)}
                  className="form-input"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveArrayItem("learningOutcomes", index)}
                  className="btn btn-secondary btn-sm"
                >
                  <Trash2 size={16} color="var(--danger)" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleAddArrayItem("learningOutcomes")}
              className="btn btn-secondary btn-sm"
              style={{ marginTop: "4px" }}
            >
              <Plus size={14} /> Add Outcome
            </button>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary">
            <Save size={16} /> {loading ? "Saving..." : createdCourseId ? "Update Details" : "Save & Proceed to Curriculum"}
          </button>
        </form>
      </div>

      {/* Curriculum Builder (Sections & Lessons) */}
      {createdCourseId && (
        <div className="card" style={{ padding: "32px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "800", marginBottom: "20px" }}>
            2. Curriculum & Lesson Builder
          </h2>

          {/* Existing Sections List */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "30px" }}>
            {sections.map((sec, sIdx) => (
              <div
                key={sec._id}
                style={{
                  border: "1px solid var(--border-light)",
                  borderRadius: "var(--radius-md)",
                  padding: "20px",
                  backgroundColor: "var(--bg-subtle)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                  <h3 style={{ fontSize: "16px", fontWeight: "700" }}>
                    {sec.title}
                  </h3>
                  <span className="badge badge-secondary">{sec.lessons?.length || 0} Lessons</span>
                </div>

                {/* Lessons list inside section */}
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
                  {sec.lessons?.map((l) => (
                    <div
                      key={l._id}
                      style={{
                        padding: "10px 14px",
                        backgroundColor: "var(--bg-surface)",
                        borderRadius: "var(--radius-sm)",
                        border: "1px solid var(--border-light)",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontSize: "14px",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <Play size={14} color="var(--primary)" />
                        <span>{l.title}</span>
                      </div>
                      <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>{l.durationMinutes}m</span>
                    </div>
                  ))}
                </div>

                {/* Add Lesson Form */}
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center", backgroundColor: "var(--bg-surface)", padding: "12px", borderRadius: "var(--radius-sm)" }}>
                  <input
                    type="text"
                    placeholder="Lesson title..."
                    value={newLessonData.sectionId === sec._id ? newLessonData.title : ""}
                    onChange={(e) => setNewLessonData({ ...newLessonData, sectionId: sec._id, title: e.target.value })}
                    className="form-input"
                    style={{ flex: 1, minWidth: "180px" }}
                  />
                  <input
                    type="text"
                    placeholder="Video MP4 URL..."
                    value={newLessonData.sectionId === sec._id ? newLessonData.videoUrl : ""}
                    onChange={(e) => setNewLessonData({ ...newLessonData, sectionId: sec._id, videoUrl: e.target.value })}
                    className="form-input"
                    style={{ flex: 1, minWidth: "180px" }}
                  />
                  <button
                    type="button"
                    onClick={() => handleAddLesson(sec._id)}
                    className="btn btn-primary btn-sm"
                  >
                    <Plus size={14} /> Add Lesson
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add New Section */}
          <div style={{ display: "flex", gap: "10px" }}>
            <input
              type="text"
              placeholder="New Section Title (e.g. Module 2: State Management & Redux)..."
              value={newSectionTitle}
              onChange={(e) => setNewSectionTitle(e.target.value)}
              className="form-input"
            />
            <button type="button" onClick={handleAddSection} className="btn btn-secondary">
              <Plus size={16} /> Add Section
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseBuilderPage;
