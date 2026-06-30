import React, { useState } from 'react';
import Topbar from '../Sidebar/Topbar';
import { useApp } from '../../context/AppContext';
import { User, Mail, Phone, GraduationCap, Tag, Calendar, Trophy, Zap, Target, Flame, Edit2, Lock, Save } from 'lucide-react';
import './Profile.css';

const Profile = () => {
  const { user } = useApp();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    batch: user.batch,
  });

  const infoRows = [
    { label: 'Full Name', value: form.fullName, icon: <User size={18} /> },
    { label: 'Email Address', value: form.email, icon: <Mail size={18} /> },
    { label: 'Phone Number', value: form.phone, icon: <Phone size={18} /> },
    { label: 'Batch / Class', value: form.batch, icon: <GraduationCap size={18} /> },
    { label: 'Role', value: user.role, icon: <Tag size={18} /> },
    { label: 'Joined On', value: user.joinDate, icon: <Calendar size={18} /> },
  ];

  const achievements = [
    { icon: <Trophy size={20} />, label: 'Top Performer', desc: 'Top 10% in batch', color: '#f5a623' },
    { icon: <Zap size={20} />, label: 'Quick Learner', desc: '5 sessions this week', color: '#3b82f6' },
    { icon: <Target size={20} />, label: 'Test Ace', desc: 'Scored 80%+ twice', color: '#22c55e' },
    { icon: <Flame size={20} />, label: '7-Day Streak', desc: 'Logged in 7 days', color: '#ef4444' },
  ];

  return (
    <div>
      <Topbar title="Profile" subtitle="Manage your account information and view achievements." />
      <div className="page-container">

        {/* Profile Header */}
        <div className="profile-header card animate-fadeIn">
          <div className="profile-header-bg" />
          <div className="profile-avatar-section">
            <div className="profile-avatar">
              <span>{user.avatar}</span>
            </div>
            <div className="profile-avatar-badge" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Edit2 size={12} /></div>
          </div>
          <div className="profile-header-info">
            <h2 className="profile-name">{user.fullName}</h2>
            <p className="profile-batch">{user.batch}</p>
            <div className="profile-badges">
              <span className="badge badge-gold">🎓 {user.role}</span>
              <span className="badge badge-green">✅ Active</span>
              <span className="badge badge-blue">📅 Joined {user.joinDate}</span>
            </div>
          </div>
          <button
            id="profile-edit-btn"
            className={`btn ${editing ? 'btn-primary' : 'btn-secondary'} profile-edit-btn`}
            onClick={() => setEditing(!editing)}
          >
            {editing ? '💾 Save Changes' : '✏️ Edit Profile'}
          </button>
        </div>

        <div className="profile-grid animate-fadeIn delay-1">
          {/* Info Card */}
          <div className="card">
            <div className="card-header">
              <h3>Personal Information</h3>
              {editing && <span className="badge badge-gold">Editing</span>}
            </div>
            <div className="profile-info-list">
              {infoRows.map((row, i) => (
                <div key={i} className="profile-info-row">
                  <span className="profile-info-icon">{row.icon}</span>
                  <div className="profile-info-content">
                    <span className="profile-info-label">{row.label}</span>
                    {editing && row.label !== 'Role' && row.label !== 'Joined On' ? (
                      <input
                        className="input profile-info-input"
                        value={form[Object.keys(form).find(k => row.value === form[k])] || row.value}
                        onChange={e => {
                          const key = Object.keys(form).find(k => row.value === form[k]);
                          if (key) setForm({ ...form, [key]: e.target.value });
                        }}
                      />
                    ) : (
                      <span className="profile-info-value">{row.value}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div>
            <div className="card">
              <div className="card-header">
                <h3>Achievements</h3>
                <span className="section-tag">{achievements.length} earned</span>
              </div>
              <div className="achievements-grid">
                {achievements.map((a, i) => (
                  <div key={i} className="achievement-card" style={{ '--ach-color': a.color }}>
                    <span className="achievement-icon">{a.icon}</span>
                    <div>
                      <p className="achievement-label" style={{ color: a.color }}>{a.label}</p>
                      <p className="achievement-desc">{a.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Progress Summary */}
            <div className="card" style={{ marginTop: '16px' }}>
              <div className="card-header"><h3>Progress Summary</h3></div>
              {[
                { label: 'Attendance', value: 72, color: '#22c55e' },
                { label: 'Tests Completed', value: 50, color: '#3b82f6' },
                { label: 'Videos Watched', value: 50, color: '#8b5cf6' },
                { label: 'Resources Downloaded', value: 40, color: '#f5a623' },
              ].map((p, i) => (
                <div key={i} className="profile-progress-row">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>{p.label}</span>
                    <span style={{ fontSize: '13px', color: p.color, fontWeight: 700 }}>{p.value}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${p.value}%`, background: p.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
