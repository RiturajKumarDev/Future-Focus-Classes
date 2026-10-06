import React from "react";
import { Link } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { Star, Clock, Users, Heart, BookOpen } from "lucide-react";

const CourseCard = ({ course }) => {
  const { wishlistIds, toggleWishlist } = useApp();
  const isWishlisted = wishlistIds.has(course._id);

  const isFree = course.pricing?.isFree;
  const price = course.pricing?.price || 0;
  const discountPrice = course.pricing?.discountPrice || 0;
  const hasDiscount = !isFree && discountPrice > 0 && discountPrice < price;

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(course._id);
  };

  return (
    <div
      className="card"
      style={{
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        position: "relative",
        textDecoration: "none",
        color: "inherit",
      }}
    >
      {/* Thumbnail + Badges */}
      <div style={{ position: "relative", width: "100%", height: "185px", backgroundColor: "#e2e8f0" }}>
        <img
          src={course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600"}
          alt={course.title}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          loading="lazy"
        />

        {/* Level Badge */}
        <span
          className="badge"
          style={{
            position: "absolute",
            top: "12px",
            left: "12px",
            backgroundColor: "rgba(15, 23, 42, 0.75)",
            backdropFilter: "blur(4px)",
            color: "#ffffff",
            textTransform: "capitalize",
            fontSize: "11px",
          }}
        >
          {course.level || "All Levels"}
        </span>

        {/* Wishlist Heart Toggle */}
        <button
          onClick={handleWishlistClick}
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            width: "34px",
            height: "34px",
            borderRadius: "50%",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "var(--shadow-sm)",
            color: isWishlisted ? "var(--danger)" : "var(--text-muted)",
            transition: "var(--transition)",
          }}
          title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          aria-label="Wishlist"
        >
          <Heart size={18} fill={isWishlisted ? "#ef4444" : "none"} />
        </button>
      </div>

      {/* Course Content */}
      <div style={{ padding: "18px", display: "flex", flexDirection: "column", flex: 1 }}>
        {/* Category */}
        <div
          style={{
            fontSize: "12px",
            fontWeight: "700",
            color: "var(--primary)",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            marginBottom: "6px",
          }}
        >
          {course.category?.name || "General"}
        </div>

        {/* Title */}
        <Link
          to={`/courses/${course.slug || course._id}`}
          style={{
            fontSize: "16px",
            fontWeight: "700",
            lineHeight: "1.4",
            color: "var(--text-main)",
            marginBottom: "8px",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            height: "44px",
          }}
          title={course.title}
        >
          {course.title}
        </Link>

        {/* Instructor */}
        <div
          style={{
            fontSize: "13px",
            color: "var(--text-secondary)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "14px",
          }}
        >
          <span>By {course.instructor?.fullName || "Instructor"}</span>
        </div>

        {/* Metrics Row (Rating, Students, Duration) */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            fontSize: "12.5px",
            color: "var(--text-muted)",
            marginBottom: "16px",
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <Star size={15} color="#f59e0b" fill="#f59e0b" />
            <span style={{ fontWeight: "700", color: "var(--text-main)" }}>
              {course.rating?.average ? course.rating.average.toFixed(1) : "4.9"}
            </span>
            <span>({course.rating?.count || 120})</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <Users size={14} />
            <span>{course.enrollmentCount || 0}</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <Clock size={14} />
            <span>{course.durationHours || 12}h</span>
          </div>
        </div>

        {/* Price & Action Row */}
        <div
          style={{
            marginTop: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: "14px",
            borderTop: "1px solid var(--border-light)",
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
            {isFree ? (
              <span style={{ fontSize: "18px", fontWeight: "800", color: "var(--success)" }}>
                FREE
              </span>
            ) : hasDiscount ? (
              <>
                <span style={{ fontSize: "19px", fontWeight: "800", color: "var(--text-main)" }}>
                  ₹{discountPrice}
                </span>
                <span
                  style={{
                    fontSize: "13px",
                    color: "var(--text-muted)",
                    textDecoration: "line-through",
                  }}
                >
                  ₹{price}
                </span>
              </>
            ) : (
              <span style={{ fontSize: "19px", fontWeight: "800", color: "var(--text-main)" }}>
                ₹{price}
              </span>
            )}
          </div>

          <Link
            to={`/courses/${course.slug || course._id}`}
            className="btn btn-outline btn-sm"
          >
            Enroll Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
