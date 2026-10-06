import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { Code, BookOpen, GraduationCap, Target, Library, ArrowRight } from "lucide-react";

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("categories").then((res) => {
      if (res.success) setCategories(res.data);
      setLoading(false);
    });
  }, []);

  const getCategoryIcon = (iconName) => {
    switch (iconName) {
      case "BookOpen":
        return <BookOpen size={28} />;
      case "GraduationCap":
        return <GraduationCap size={28} />;
      case "Target":
        return <Target size={28} />;
      case "Library":
        return <Library size={28} />;
      case "Code":
      default:
        return <Code size={28} />;
    }
  };

  return (
    <div className="container" style={{ padding: "60px 24px 100px" }}>
      <div style={{ textAlign: "center", maxWidth: "680px", margin: "0 auto 50px" }}>
        <h1 style={{ fontSize: "36px", fontWeight: "900", marginBottom: "12px" }}>
          Explore Academic Streams & Batches
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "16px", lineHeight: "1.6" }}>
          Structured academic tracks spanning Class 8th-12th School Boards, IIT-JEE & NEET target batches, College Engineering, and Coding.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
        {categories.map((cat) => (
          <Link
            key={cat._id}
            to={`/courses?category=${cat.slug}`}
            className="card"
            style={{ padding: "30px", display: "flex", flexDirection: "column" }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "14px",
                backgroundColor: "var(--primary-light)",
                color: "var(--primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "20px",
              }}
            >
              {getCategoryIcon(cat.icon)}
            </div>

            <h2 style={{ fontSize: "20px", fontWeight: "800", marginBottom: "8px" }}>
              {cat.name}
            </h2>

            <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: "1.6", marginBottom: "24px", flex: 1 }}>
              {cat.description}
            </p>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "16px", borderTop: "1px solid var(--border-light)" }}>
              <span style={{ fontSize: "13px", fontWeight: "700", color: "var(--primary)" }}>
                {cat.courseCount || 1} Batches Available
              </span>
              <span style={{ fontSize: "13.5px", fontWeight: "600", display: "flex", alignItems: "center", gap: "4px" }}>
                View Batches <ArrowRight size={14} />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoriesPage;
