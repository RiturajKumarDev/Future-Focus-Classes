import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../../services/api";
import CourseCard from "../../components/common/CourseCard";
import { Search, Filter, SlidersHorizontal, ArrowUpDown } from "lucide-react";

const CourseCatalogPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  // Filters state from URL or defaults
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const level = searchParams.get("level") || "all";
  const priceType = searchParams.get("priceType") || "";
  const rating = searchParams.get("rating") || "";
  const sort = searchParams.get("sort") || "newest";
  const page = parseInt(searchParams.get("page") || "1", 10);

  // Fetch categories
  useEffect(() => {
    api.get("categories").then((res) => {
      if (res.success) setCategories(res.data);
    });
  }, []);

  // Fetch courses on filter change
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams({
          search,
          category,
          level,
          priceType,
          rating,
          sort,
          page: String(page),
          limit: "9",
        }).toString();

        const res = await api.get(`courses?${queryParams}`);
        if (res.success) {
          setCourses(res.data);
          setPagination(res.pagination || { page: 1, pages: 1, total: res.data.length });
        }
      } catch (err) {
        console.error("Failed to fetch courses:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [search, category, level, priceType, rating, sort, page]);

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== "all") {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  return (
    <div className="container" style={{ padding: "40px 24px 80px" }}>
      {/* Header */}
      <div style={{ marginBottom: "36px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: "800", marginBottom: "8px" }}>
          Explore Batches & Courses
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "15px" }}>
          Showing {pagination.total} programs across Class 8th-12th Boards, JEE/NEET, College & Coding.
        </p>
      </div>

      {/* Main Layout (Filters Sidebar + Course Grid) */}
      <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: "36px" }} className="catalog-layout">
        {/* Filter Panel */}
        <aside
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            height: "fit-content",
          }}
        >
          {/* Search Input */}
          <div className="card" style={{ padding: "20px" }}>
            <label className="form-label" style={{ marginBottom: "8px" }}>Search Keyword</label>
            <div style={{ position: "relative" }}>
              <Search size={16} style={{ position: "absolute", left: "12px", top: "12px", color: "var(--text-muted)" }} />
              <input
                type="text"
                placeholder="Title, keyword, skill..."
                value={search}
                onChange={(e) => updateFilter("search", e.target.value)}
                className="form-input"
                style={{ paddingLeft: "36px" }}
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="card" style={{ padding: "20px" }}>
            <label className="form-label" style={{ marginBottom: "12px" }}>Category</label>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <button
                onClick={() => updateFilter("category", "")}
                style={{
                  textAlign: "left",
                  padding: "6px 10px",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "13.5px",
                  fontWeight: !category ? "700" : "500",
                  color: !category ? "var(--primary)" : "var(--text-secondary)",
                  backgroundColor: !category ? "var(--primary-light)" : "transparent",
                }}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => updateFilter("category", cat.slug)}
                  style={{
                    textAlign: "left",
                    padding: "6px 10px",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "13.5px",
                    fontWeight: category === cat.slug ? "700" : "500",
                    color: category === cat.slug ? "var(--primary)" : "var(--text-secondary)",
                    backgroundColor: category === cat.slug ? "var(--primary-light)" : "transparent",
                  }}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Experience Level */}
          <div className="card" style={{ padding: "20px" }}>
            <label className="form-label" style={{ marginBottom: "12px" }}>Experience Level</label>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {[
                { label: "All Levels", val: "all" },
                { label: "Beginner", val: "beginner" },
                { label: "Intermediate", val: "intermediate" },
                { label: "Advanced", val: "advanced" },
              ].map((lvl) => (
                <button
                  key={lvl.val}
                  onClick={() => updateFilter("level", lvl.val)}
                  style={{
                    textAlign: "left",
                    padding: "6px 10px",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "13.5px",
                    fontWeight: level === lvl.val ? "700" : "500",
                    color: level === lvl.val ? "var(--primary)" : "var(--text-secondary)",
                    backgroundColor: level === lvl.val ? "var(--primary-light)" : "transparent",
                  }}
                >
                  {lvl.label}
                </button>
              ))}
            </div>
          </div>

          {/* Pricing Filter */}
          <div className="card" style={{ padding: "20px" }}>
            <label className="form-label" style={{ marginBottom: "12px" }}>Pricing</label>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {[
                { label: "All Prices", val: "" },
                { label: "Free Preview Courses", val: "free" },
                { label: "Paid Pro Tracks", val: "paid" },
              ].map((p) => (
                <button
                  key={p.val}
                  onClick={() => updateFilter("priceType", p.val)}
                  style={{
                    textAlign: "left",
                    padding: "6px 10px",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "13.5px",
                    fontWeight: priceType === p.val ? "700" : "500",
                    color: priceType === p.val ? "var(--primary)" : "var(--text-secondary)",
                    backgroundColor: priceType === p.val ? "var(--primary-light)" : "transparent",
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <div>
          {/* Top Sort Bar */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "24px",
              paddingBottom: "16px",
              borderBottom: "1px solid var(--border-light)",
            }}
          >
            <div style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
              Showing {courses.length} of {pagination.total} courses
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <ArrowUpDown size={16} color="var(--text-muted)" />
              <select
                value={sort}
                onChange={(e) => updateFilter("sort", e.target.value)}
                className="form-input"
                style={{ width: "auto", padding: "8px 12px", fontSize: "13.5px" }}
              >
                <option value="newest">Newest First</option>
                <option value="popular">Most Enrolled</option>
                <option value="rating">Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Course Grid */}
          {loading ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" }}>
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="card skeleton" style={{ height: "350px" }} />
              ))}
            </div>
          ) : courses.length === 0 ? (
            <div className="card" style={{ textAlign: "center", padding: "60px 20px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "8px" }}>No courses found</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginBottom: "20px" }}>
                Try adjusting your search criteria or clear your current filters.
              </p>
              <button onClick={() => setSearchParams({})} className="btn btn-primary">
                Clear Filters
              </button>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" }}>
              {courses.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "40px" }}>
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((pNum) => (
                <button
                  key={pNum}
                  onClick={() => updateFilter("page", String(pNum))}
                  className={`btn ${pagination.page === pNum ? "btn-primary" : "btn-secondary"} btn-sm`}
                  style={{ minWidth: "36px" }}
                >
                  {pNum}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 868px) {
          .catalog-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default CourseCatalogPage;
