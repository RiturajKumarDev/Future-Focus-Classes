import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";
import {
  Star,
  Clock,
  Users,
  Award,
  BookOpen,
  CheckCircle,
  Play,
  Lock,
  ChevronDown,
  ChevronUp,
  Heart,
  Share2,
  Tag,
  ShieldCheck,
} from "lucide-react";

const CourseDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { wishlistIds, toggleWishlist, showToast } = useApp();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [openSections, setOpenSections] = useState({ 0: true });

  const isWishlisted = course ? wishlistIds.has(course._id) : false;

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const res = await api.get(`courses/${slug}`);
        if (res.success) {
          setCourse(res.data);

          // Check if user is enrolled
          if (isAuthenticated && res.data._id) {
            const enrollRes = await api.get(`enrollments/check/${res.data._id}`);
            if (enrollRes.success) setIsEnrolled(enrollRes.isEnrolled);
          }
        }
      } catch (err) {
        showToast("Course could not be loaded: " + err.message, "error");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [slug, isAuthenticated]);

  const toggleSection = (index) => {
    setOpenSections((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  // Coupon validation
  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    try {
      const priceToDiscount = course.pricing.discountPrice || course.pricing.price || 0;
      const res = await api.post("coupons/validate", {
        code: couponCode.trim(),
        amount: priceToDiscount,
      });

      if (res.success) {
        setAppliedCoupon(res.data);
        showToast(res.message, "success");
      }
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  // Enrollment / Checkout Flow (Supports both Mock mode and instant free enrollment)
  const handleEnrollment = async () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/courses/${slug}` } });
      return;
    }

    setEnrolling(true);
    try {
      if (course.pricing?.isFree) {
        // Free course direct enrollment
        const res = await api.post("enrollments", { courseId: course._id });
        if (res.success) {
          showToast("Successfully enrolled! Welcome to the course.", "success");
          navigate(`/student/learning/${course._id}`);
        }
      } else {
        // Create order
        const orderRes = await api.post("payments/create-order", {
          courseId: course._id,
          couponCode: appliedCoupon?.code || "",
        });

        if (orderRes.success) {
          const { orderId, isMock } = orderRes.data;

          // Process payment verification (Mock mode for instant testing)
          const verifyRes = await api.post("payments/verify", {
            orderId,
            paymentId: `pay_mock_${Date.now()}`,
            isMock: true,
          });

          if (verifyRes.success) {
            showToast("Payment verified! Enrollment complete. 🎉", "success");
            navigate(`/student/learning/${course._id}`);
          }
        }
      }
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: "80px 24px", textAlign: "center" }}>
        <div className="card skeleton" style={{ height: "400px", maxWidth: "900px", margin: "0 auto" }} />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container" style={{ padding: "100px 24px", textAlign: "center" }}>
        <h2>Course Not Found</h2>
        <Link to="/courses" className="btn btn-primary" style={{ marginTop: "20px" }}>
          Back to Courses
        </Link>
      </div>
    );
  }

  const price = course.pricing?.price || 0;
  const discountPrice = course.pricing?.discountPrice || 0;
  const finalPrice = appliedCoupon
    ? appliedCoupon.finalAmount
    : discountPrice > 0
    ? discountPrice
    : price;

  return (
    <div style={{ paddingBottom: "100px" }}>
      {/* Hero Header */}
      <div style={{ backgroundColor: "var(--secondary)", color: "#ffffff", padding: "60px 0" }}>
        <div className="container">
          <div style={{ maxWidth: "800px" }}>
            <span
              className="badge"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.15)",
                color: "#ffffff",
                marginBottom: "16px",
              }}
            >
              {course.category?.name || "Curriculum"} • {course.level}
            </span>

            <h1 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: "800", lineHeight: "1.2", marginBottom: "16px" }}>
              {course.title}
            </h1>

            <p style={{ fontSize: "16.5px", color: "var(--text-muted)", lineHeight: "1.6", marginBottom: "24px" }}>
              {course.subtitle || course.description.slice(0, 160)}...
            </p>

            <div style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap", fontSize: "14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Star size={16} color="#f59e0b" fill="#f59e0b" />
                <span style={{ fontWeight: "700" }}>{course.rating?.average?.toFixed(1) || "4.9"}</span>
                <span style={{ color: "var(--text-muted)" }}>({course.rating?.count || 120} reviews)</span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Users size={16} />
                <span>{course.enrollmentCount} Enrolled Students</span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Clock size={16} />
                <span>{course.durationHours} Hours on-demand content</span>
              </div>

              <div>
                Instructor: <strong>{course.instructor?.fullName}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout (Overview + Sticky Pricing Card) */}
      <div className="container" style={{ marginTop: "-30px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "40px" }} className="course-detail-grid">
          {/* Left Column: Details, Syllabus, Instructor */}
          <div style={{ display: "flex", flexDirection: "column", gap: "36px" }}>
            {/* Learning Outcomes */}
            <div className="card" style={{ padding: "30px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: "800", marginBottom: "20px" }}>
                What you'll master in this course
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "14px" }}>
                {course.learningOutcomes?.map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "14.5px" }}>
                    <CheckCircle size={18} color="var(--success)" style={{ flexShrink: 0, marginTop: "2px" }} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Course Curriculum */}
            <div className="card" style={{ padding: "30px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "20px" }}>
                <h2 style={{ fontSize: "20px", fontWeight: "800" }}>Course Curriculum</h2>
                <span style={{ fontSize: "13.5px", color: "var(--text-muted)" }}>
                  {course.curriculum?.length || 0} Sections
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {course.curriculum?.map((section, sIdx) => {
                  const isOpen = !!openSections[sIdx];
                  return (
                    <div
                      key={section._id}
                      style={{
                        border: "1px solid var(--border-light)",
                        borderRadius: "var(--radius-md)",
                        overflow: "hidden",
                      }}
                    >
                      <button
                        onClick={() => toggleSection(sIdx)}
                        style={{
                          width: "100%",
                          padding: "16px 20px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          backgroundColor: isOpen ? "var(--bg-subtle)" : "var(--bg-surface)",
                          fontWeight: "700",
                          fontSize: "15px",
                        }}
                      >
                        <span>{section.title}</span>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <span style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: "400" }}>
                            {section.lessons?.length || 0} lessons
                          </span>
                          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </div>
                      </button>

                      {isOpen && (
                        <div style={{ padding: "10px 20px", backgroundColor: "var(--bg-surface)" }}>
                          {section.lessons?.map((lesson) => (
                            <div
                              key={lesson._id}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                padding: "10px 0",
                                borderBottom: "1px solid var(--border-light)",
                                fontSize: "14px",
                              }}
                            >
                              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <Play size={15} color="var(--primary)" />
                                <span>{lesson.title}</span>
                              </div>
                              <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", color: "var(--text-muted)" }}>
                                <span>{lesson.durationMinutes}m</span>
                                {lesson.isFreePreview ? (
                                  <span className="badge badge-success" style={{ fontSize: "10px" }}>Preview</span>
                                ) : (
                                  <Lock size={14} />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Description & Requirements */}
            <div className="card" style={{ padding: "30px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: "800", marginBottom: "16px" }}>Requirements</h2>
              <ul style={{ paddingLeft: "20px", marginBottom: "28px", color: "var(--text-secondary)", fontSize: "14.5px" }}>
                {course.requirements?.map((req, i) => (
                  <li key={i} style={{ marginBottom: "6px" }}>{req}</li>
                ))}
              </ul>

              <h2 style={{ fontSize: "20px", fontWeight: "800", marginBottom: "16px" }}>Description</h2>
              <p style={{ color: "var(--text-secondary)", lineHeight: "1.7", fontSize: "15px", whiteSpace: "pre-line" }}>
                {course.description}
              </p>
            </div>

            {/* Instructor Profile */}
            <div className="card" style={{ padding: "30px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: "800", marginBottom: "20px" }}>About the Instructor</h2>
              <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                <img
                  src={course.instructor?.avatar || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400"}
                  alt={course.instructor?.fullName}
                  style={{ width: "72px", height: "72px", borderRadius: "50%", objectFit: "cover" }}
                />
                <div>
                  <h3 style={{ fontSize: "17px", fontWeight: "700" }}>{course.instructor?.fullName}</h3>
                  <div style={{ fontSize: "13.5px", color: "var(--text-muted)", marginBottom: "8px" }}>
                    {course.instructor?.headline || "Senior Engineering Mentor"}
                  </div>
                  <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: "1.5" }}>
                    {course.instructor?.bio || "Dedicated to empowering the next generation of engineers with real-world architectural experience."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Pricing & Enrollment Card */}
          <div>
            <div
              className="card"
              style={{
                position: "sticky",
                top: "92px",
                overflow: "hidden",
                boxShadow: "var(--shadow-xl)",
              }}
            >
              {/* Preview Media */}
              <div style={{ position: "relative", width: "100%", height: "210px" }}>
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                {course.previewVideoUrl && (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      backgroundColor: "rgba(0,0,0,0.35)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div
                      style={{
                        width: "56px",
                        height: "56px",
                        borderRadius: "50%",
                        backgroundColor: "#ffffff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "var(--primary)",
                        boxShadow: "var(--shadow-lg)",
                      }}
                    >
                      <Play size={24} style={{ marginLeft: "4px" }} />
                    </div>
                  </div>
                )}
              </div>

              {/* Price Content */}
              <div style={{ padding: "28px" }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "20px" }}>
                  {course.pricing?.isFree ? (
                    <span style={{ fontSize: "32px", fontWeight: "800", color: "var(--success)" }}>FREE</span>
                  ) : (
                    <>
                      <span style={{ fontSize: "32px", fontWeight: "800", color: "var(--text-main)" }}>
                        ₹{finalPrice}
                      </span>
                      {price > finalPrice && (
                        <span style={{ fontSize: "16px", color: "var(--text-muted)", textDecoration: "line-through" }}>
                          ₹{price}
                        </span>
                      )}
                      {appliedCoupon && (
                        <span className="badge badge-success" style={{ fontSize: "12px" }}>
                          {appliedCoupon.code} Applied
                        </span>
                      )}
                    </>
                  )}
                </div>

                {/* Primary Action Button */}
                {isEnrolled ? (
                  <button
                    onClick={() => navigate(`/student/learning/${course._id}`)}
                    className="btn btn-primary btn-lg"
                    style={{ width: "100%", marginBottom: "12px" }}
                  >
                    <BookOpen size={18} /> Continue Learning
                  </button>
                ) : (
                  <button
                    onClick={handleEnrollment}
                    disabled={enrolling}
                    className="btn btn-primary btn-lg"
                    style={{ width: "100%", marginBottom: "12px" }}
                  >
                    {enrolling
                      ? "Processing..."
                      : course.pricing?.isFree
                      ? "Enroll for Free"
                      : "Buy Now (Mock Razorpay)"}
                  </button>
                )}

                {/* Wishlist toggle */}
                <button
                  onClick={() => toggleWishlist(course._id)}
                  className="btn btn-secondary"
                  style={{ width: "100%", marginBottom: "20px" }}
                >
                  <Heart size={16} fill={isWishlisted ? "#ef4444" : "none"} color={isWishlisted ? "#ef4444" : "inherit"} />
                  {isWishlisted ? "In Wishlist" : "Add to Wishlist"}
                </button>

                {/* Coupon Code Input */}
                {!isEnrolled && !course.pricing?.isFree && (
                  <form onSubmit={handleApplyCoupon} style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
                    <input
                      type="text"
                      placeholder="Coupon Code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      className="form-input"
                      style={{ textTransform: "uppercase" }}
                    />
                    <button type="submit" className="btn btn-secondary">
                      Apply
                    </button>
                  </form>
                )}

                {/* Guarantee Perks */}
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13.5px", color: "var(--text-secondary)" }}>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <ShieldCheck size={16} color="var(--success)" />
                    <span>30-Day Money-Back Guarantee</span>
                  </div>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <Award size={16} color="var(--primary)" />
                    <span>Verifiable Certificate of Completion</span>
                  </div>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <BookOpen size={16} color="var(--warning)" />
                    <span>Full Lifetime Access</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 960px) {
          .course-detail-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default CourseDetailPage;
