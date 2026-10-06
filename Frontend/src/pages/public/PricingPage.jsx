import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Check, Zap, Sparkles, Shield, HelpCircle } from "lucide-react";

const PricingPage = () => {
  const [billingCycle, setBillingCycle] = useState("annual"); // 'monthly' or 'annual'

  const plans = [
    {
      id: "free",
      name: "Starter Learner",
      badge: "Free Tier",
      priceMonthly: 0,
      priceAnnual: 0,
      description: "Ideal for curious minds looking to explore introductory computer science and coding lessons.",
      features: [
        "Access to 50+ free preview lessons",
        "Community forum discussions",
        "Course completion badges",
        "Mobile and tablet browser access",
        "Standard community support",
      ],
      cta: "Get Started Free",
      ctaLink: "/register",
      popular: false,
    },
    {
      id: "pro",
      name: "Future Focus All-Access Pass",
      badge: "Most Popular",
      priceMonthly: 799,
      priceAnnual: 599,
      description: "Complete access to all verified masterclasses, automated quizzes, real project grading, and verified certificates.",
      features: [
        "Unlimited access to all 500+ courses",
        "Instant verified certificates with QR verification",
        "Direct code grading from top instructors",
        "Offline lesson access & PDF resource downloads",
        "Built-in AI Copilot Tutor with 24/7 Q&A",
        "Resume and portfolio project showcases",
        "Priority 1-on-1 mentor guidance",
      ],
      cta: "Unlock Pro Pass",
      ctaLink: "/courses",
      popular: true,
    },
    {
      id: "team",
      name: "Enterprise & Teams",
      badge: "For Organizations",
      priceMonthly: 1999,
      priceAnnual: 1499,
      description: "Scale technical talent across your engineering team with centralized analytics and customized syllabi.",
      features: [
        "Everything in Pro for up to 25 team members",
        "Centralized Admin Dashboard & skill analytics",
        "Custom internal training tracks",
        "Dedicated LMS account manager",
        "Custom domain & corporate SSO integration",
        "Quarterly tech stack skill audit",
      ],
      cta: "Contact Enterprise Sales",
      ctaLink: "/contact",
      popular: false,
    },
  ];

  const faqs = [
    {
      q: "Can I buy individual batches without an all-access subscription?",
      a: "Yes! Every batch on Future Focus Classes (Boards, JEE, NEET, College, or Coding) can be enrolled in individually with full access.",
    },
    {
      q: "Are the certificates verified and shareable?",
      a: "Yes, every completed course with passed quizzes generates an immutable certificate with an authenticity verification ID and QR code.",
    },
    {
      q: "Can I use discount coupons during enrollment?",
      a: "Absolutely. During checkout, apply valid promo coupons like FUTURE50, LEARNX50 or WELCOME20 to get instant fee discounts.",
    },
    {
      q: "What is your refund policy?",
      a: "We offer a 14-day money-back guarantee if you are not fully satisfied with our academic lectures.",
    },
  ];

  return (
    <div style={{ padding: "60px 24px", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "48px" }}>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "6px 14px",
            borderRadius: "999px",
            backgroundColor: "var(--primary-light)",
            color: "var(--primary)",
            fontSize: "13px",
            fontWeight: "700",
            marginBottom: "16px",
          }}
        >
          <Sparkles size={16} /> Affordable, Quality-Driven Education
        </span>
        <h1 style={{ fontSize: "2.75rem", fontWeight: "900", color: "var(--text-main)", marginBottom: "16px" }}>
          Transparent Fee Plans for Every Aspirant
        </h1>
        <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", maxWidth: "680px", margin: "0 auto 28px" }}>
          Choose the learning track that matches your goals. Whether you are aiming for 95%+ in Board Exams, cracking JEE/NEET, or mastering Software Coding.
        </p>

        {/* Toggle */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "12px",
            backgroundColor: "var(--bg-subtle)",
            padding: "6px",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--border-light)",
          }}
        >
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`btn btn-sm ${billingCycle === "monthly" ? "btn-primary" : "btn-secondary"}`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setBillingCycle("annual")}
            className={`btn btn-sm ${billingCycle === "annual" ? "btn-primary" : "btn-secondary"}`}
          >
            Annual Billing <span style={{ color: "var(--accent-amber)", fontWeight: "800", marginLeft: "4px" }}>(Save 25%)</span>
          </button>
        </div>
      </div>

      {/* Plan Cards Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "28px",
          alignItems: "stretch",
          marginBottom: "64px",
        }}
      >
        {plans.map((p) => {
          const price = billingCycle === "annual" ? p.priceAnnual : p.priceMonthly;
          return (
            <div
              key={p.id}
              className="card"
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                border: p.popular ? "2px solid var(--primary)" : "1px solid var(--border-light)",
                boxShadow: p.popular ? "var(--shadow-xl)" : "var(--shadow-sm)",
                padding: "36px 30px",
                borderRadius: "var(--radius-xl)",
                backgroundColor: "var(--bg-surface)",
              }}
            >
              {p.popular && (
                <div
                  style={{
                    position: "absolute",
                    top: "-14px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    backgroundColor: "var(--primary)",
                    color: "#fff",
                    padding: "4px 16px",
                    borderRadius: "999px",
                    fontSize: "12px",
                    fontWeight: "800",
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                  }}
                >
                  Most Popular Choice
                </div>
              )}

              <div style={{ marginBottom: "20px" }}>
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: "700",
                    textTransform: "uppercase",
                    color: p.popular ? "var(--primary)" : "var(--text-muted)",
                  }}
                >
                  {p.badge}
                </span>
                <h3 style={{ fontSize: "1.4rem", fontWeight: "800", marginTop: "4px" }}>{p.name}</h3>
                <p style={{ fontSize: "13.5px", color: "var(--text-secondary)", marginTop: "6px" }}>{p.description}</p>
              </div>

              <div style={{ margin: "16px 0 24px", display: "flex", alignItems: "baseline", gap: "6px" }}>
                <span style={{ fontSize: "2.8rem", fontWeight: "900", color: "var(--text-main)" }}>
                  {price === 0 ? "₹0" : `₹${price}`}
                </span>
                {price > 0 && (
                  <span style={{ fontSize: "14px", color: "var(--text-muted)" }}>
                    / month {billingCycle === "annual" ? "(billed annually)" : ""}
                  </span>
                )}
              </div>

              <Link
                to={p.ctaLink}
                className={`btn ${p.popular ? "btn-primary" : "btn-secondary"}`}
                style={{ width: "100%", justifyContent: "center", marginBottom: "28px" }}
              >
                {p.cta}
              </Link>

              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: "13px", textTransform: "uppercase", fontWeight: "700", color: "var(--text-muted)", marginBottom: "14px" }}>
                  What's included:
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {p.features.map((feat, idx) => (
                    <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "14px", color: "var(--text-main)" }}>
                      <Check size={18} style={{ color: "var(--accent-green)", flexShrink: 0, marginTop: "2px" }} />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Trust Banner */}
      <div
        className="card"
        style={{
          padding: "36px",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "24px",
          borderRadius: "var(--radius-xl)",
          marginBottom: "64px",
          backgroundColor: "#F1F5F9",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px", maxWidth: "600px" }}>
          <Shield size={44} style={{ color: "var(--primary)", flexShrink: 0 }} />
          <div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: "800", marginBottom: "4px" }}>30-Day Happiness Guarantee</h3>
            <p style={{ fontSize: "14px", color: "var(--text-secondary)", margin: 0 }}>
              Try Future Focus Classes risk-free. If you don't feel noticeably sharper in your conceptual grasp within 14 days, get a swift refund.
            </p>
          </div>
        </div>
        <Link to="/courses" className="btn btn-primary">
          Explore Courses First
        </Link>
      </div>

      {/* FAQs */}
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <h2 style={{ fontSize: "1.8rem", fontWeight: "800", textAlign: "center", marginBottom: "32px" }}>
          Frequently Asked Questions
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {faqs.map((f, i) => (
            <div key={i} className="card" style={{ padding: "20px 24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", fontWeight: "700", fontSize: "15px", marginBottom: "8px" }}>
                <HelpCircle size={18} style={{ color: "var(--primary)" }} />
                <span>{f.q}</span>
              </div>
              <p style={{ margin: 0, fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.6, paddingLeft: "28px" }}>
                {f.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
