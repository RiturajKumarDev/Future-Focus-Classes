import React, { useState, useEffect } from "react";
import api from "../../services/api";
import CourseCard from "../../components/common/CourseCard";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

const WishlistPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await api.get("wishlist");
        if (res.success) setCourses(res.data);
      } catch (err) {
        console.error("Wishlist error:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  if (loading) {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" }}>
        {[1, 2, 3].map((n) => (
          <div key={n} className="card skeleton" style={{ height: "320px" }} />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "26px", fontWeight: "800", marginBottom: "6px" }}>
          My Wishlist
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "14.5px" }}>
          Courses you've bookmarked to enroll in later.
        </p>
      </div>

      {courses.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "60px 20px" }}>
          <Heart size={44} color="var(--danger)" style={{ marginBottom: "16px" }} />
          <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "8px" }}>
            Your wishlist is empty
          </h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginBottom: "20px" }}>
            Browse our catalog and click the heart icon on any course card to save it here.
          </p>
          <Link to="/courses" className="btn btn-primary">
            Explore Courses
          </Link>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "24px" }}>
          {courses.map((c) => (
            <CourseCard key={c._id} course={c} />
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
