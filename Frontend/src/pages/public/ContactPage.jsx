import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";
import { useApp } from "../../context/AppContext";

const ContactPage = () => {
  const { addToast } = useApp();
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    addToast("Your inquiry has been received! Our support engineers will contact you.", "success");
  };

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "60px 24px" }}>
      <div style={{ textAlign: "center", marginBottom: "48px" }}>
        <h1 style={{ fontSize: "2.6rem", fontWeight: "900", marginBottom: "12px" }}>Contact Future Focus Classes</h1>
        <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", maxWidth: "600px", margin: "0 auto" }}>
          Have questions regarding offline coaching batches, online courses, test series, or admissions? We are here to guide you.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "40px",
        }}
      >
        {/* Info Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div className="card" style={{ padding: "24px", display: "flex", alignItems: "flex-start", gap: "16px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                backgroundColor: "var(--primary-light)",
                color: "var(--primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Mail size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "700", marginBottom: "4px" }}>Email Support & Admissions</h3>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", margin: 0 }}>
                admissions@futurefocusclasses.com / support@futurefocusclasses.com
              </p>
              <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Average response time: &lt; 2 hours</span>
            </div>
          </div>

          <div className="card" style={{ padding: "24px", display: "flex", alignItems: "flex-start", gap: "16px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                backgroundColor: "#ECFDF5",
                color: "var(--accent-green)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Phone size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "700", marginBottom: "4px" }}>Helpline & Counselor Desk</h3>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", margin: 0 }}>
                +91 (800) 456-7890 / +91 98765 43210
              </p>
              <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Mon - Sat, 8:00 AM - 8:00 PM IST</span>
            </div>
          </div>

          <div className="card" style={{ padding: "24px", display: "flex", alignItems: "flex-start", gap: "16px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                backgroundColor: "#FFFBEB",
                color: "var(--accent-amber)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <MapPin size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "700", marginBottom: "4px" }}>Main Institute Campus</h3>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", margin: 0 }}>
                Future Focus Classes, Main Educational Complex, Patna / Delhi NCR, India
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="card" style={{ padding: "36px" }}>
          {submitted ? (
            <div style={{ textAlign: "center", padding: "40px 10px" }}>
              <CheckCircle2 size={56} style={{ color: "var(--accent-green)", margin: "0 auto 16px" }} />
              <h3 style={{ fontSize: "1.4rem", fontWeight: "800", marginBottom: "8px" }}>Message Received!</h3>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "20px" }}>
                Thank you, {formData.name}. A specialist has been assigned to your ticket and will email you shortly.
              </p>
              <button onClick={() => setSubmitted(false)} className="btn btn-secondary">
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <h3 style={{ fontSize: "1.3rem", fontWeight: "800", marginBottom: "4px" }}>Send Us a Direct Message</h3>
              <div>
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rituraj Kumar"
                  className="input-field"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="your.email@domain.com"
                  className="input-field"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label">Subject / Purpose</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Enterprise inquiry, Course query, Certificate verification"
                  className="input-field"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label">Message Details</label>
                <textarea
                  required
                  rows={4}
                  placeholder="How can our educational staff assist your learning goals?"
                  className="input-field"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ justifyContent: "center", marginTop: "8px" }}>
                <Send size={18} /> Submit Inquiry
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
