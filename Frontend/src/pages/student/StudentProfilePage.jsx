import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";
import api from "../../services/api";
import { User, Mail, Phone, Lock, Save, Key } from "lucide-react";

const StudentProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const { showToast } = useApp();

  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || "",
    headline: user?.headline || "",
    bio: user?.bio || "",
    phone: user?.phone || "",
    skills: user?.skills?.join(", ") || "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      const skillsArray = profileData.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      await updateProfile({
        fullName: profileData.fullName,
        headline: profileData.headline,
        bio: profileData.bio,
        phone: profileData.phone,
        skills: skillsArray,
      });

      showToast("Profile details updated successfully!", "success");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast("New passwords do not match", "error");
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await api.put("auth/change-password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      if (res.success) {
        showToast("Password updated successfully!", "success");
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      }
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "800px", display: "flex", flexDirection: "column", gap: "32px" }}>
      <div>
        <h1 style={{ fontSize: "26px", fontWeight: "800", marginBottom: "6px" }}>
          Account Profile & Security
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "14.5px" }}>
          Manage your personal details, public portfolio info, and account credentials.
        </p>
      </div>

      {/* Profile Form */}
      <div className="card" style={{ padding: "32px" }}>
        <h2 style={{ fontSize: "18px", fontWeight: "800", marginBottom: "20px" }}>
          Profile Details
        </h2>

        <form onSubmit={handleProfileSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                value={profileData.fullName}
                onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email (Read-only)</label>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="form-input"
                style={{ backgroundColor: "var(--bg-subtle)", opacity: 0.8 }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Professional Headline</label>
            <input
              type="text"
              placeholder="e.g. Full Stack Developer • React & Node.js"
              value={profileData.headline}
              onChange={(e) => setProfileData({ ...profileData, headline: e.target.value })}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Bio</label>
            <textarea
              rows="3"
              placeholder="Brief summary of your learning journey..."
              value={profileData.bio}
              onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
              className="form-input"
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="text"
                placeholder="+91 9876543210"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Skills (Comma separated)</label>
              <input
                type="text"
                placeholder="React, Node.js, MongoDB, Docker"
                value={profileData.skills}
                onChange={(e) => setProfileData({ ...profileData, skills: e.target.value })}
                className="form-input"
              />
            </div>
          </div>

          <button type="submit" disabled={profileLoading} className="btn btn-primary" style={{ marginTop: "10px" }}>
            <Save size={16} /> {profileLoading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>

      {/* Password Change Form */}
      <div className="card" style={{ padding: "32px" }}>
        <h2 style={{ fontSize: "18px", fontWeight: "800", marginBottom: "20px" }}>
          Change Password
        </h2>

        <form onSubmit={handlePasswordSubmit}>
          <div className="form-group">
            <label className="form-label">Current Password</label>
            <input
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              className="form-input"
              required
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className="form-input"
                required
              />
            </div>
          </div>

          <button type="submit" disabled={passwordLoading} className="btn btn-secondary" style={{ marginTop: "10px" }}>
            <Key size={16} /> {passwordLoading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentProfilePage;
