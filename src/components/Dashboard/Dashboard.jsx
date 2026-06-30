import React from 'react';
import Topbar from '../Sidebar/Topbar';
import { statsData, recentActivity, learningSessions, practiceTests } from '../../data/mockData';
import { useApp } from '../../context/AppContext';
import { Calendar, ClipboardList, CheckCircle, CalendarDays, BookOpen, PenTool, ShieldCheck, Video, GraduationCap, Trophy, PlusCircle, Clock } from 'lucide-react';
import './Dashboard.css';

const CircleProgress = ({ value, max = 100, color = '#f5a623', size = 90 }) => {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(value, max) / max;
  const dash = pct * circ;

  return (
    <svg width={size} height={size} viewBox="0 0 80 80" className="circle-progress">
      <circle cx="40" cy="40" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
      <circle
        cx="40" cy="40" r={r}
        fill="none"
        stroke={color}
        strokeWidth="8"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        transform="rotate(-90 40 40)"
        style={{ transition: 'stroke-dasharray 1s ease' }}
      />
      <text x="40" y="40" textAnchor="middle" dy="0.35em" fill={color} fontSize="14" fontWeight="800" fontFamily="Outfit, sans-serif">
        {value}%
      </text>
    </svg>
  );
};

const Dashboard = () => {
  const { user, setActiveRoute } = useApp();
  const { attendance, totalClasses, completedClasses, classSheets, thisWeek } = statsData;

  const statCards = [
    { label: 'Total Classes', value: totalClasses, icon: <Calendar size={24} />, color: '#3b82f6', sub: 'All time' },
    { label: 'Class Sheets', value: `${Math.round((classSheets.completed / classSheets.total) * 100)}%`, icon: <ClipboardList size={24} />, color: '#8b5cf6', sub: `${classSheets.completed}/${classSheets.total} completed` },
    { label: 'Attendance', value: `${attendance}%`, icon: <CheckCircle size={24} />, color: '#22c55e', sub: 'Overall rate' },
    { label: 'This Week', value: thisWeek, icon: <CalendarDays size={24} />, color: '#f5a623', sub: 'Sessions' },
  ];

  const quickActions = [
    { icon: <BookOpen size={28} />, label: 'My Learning', id: 'mylearning', color: '#3b82f6' },
    { icon: <PenTool size={28} />, label: 'Practice Tests', id: 'practicetests', color: '#f5a623' },
    { icon: <ShieldCheck size={28} />, label: 'Proctored Tests', id: 'procturedtests', color: '#8b5cf6' },
    { icon: <Video size={28} />, label: 'Videos', id: 'videos', color: '#14b8a6' },
  ];

  const activityTypeColor = { LEARNING: '#3b82f6', TEST: '#f5a623', VIDEO: '#14b8a6' };

  return (
    <div>
      <Topbar
        title={`${user.fullName}'s Dashboard`}
        subtitle="Track your learning progress, attendance, and upcoming actions."
      />
      <div className="page-container">

        {/* Welcome Banner */}
        <div className="dashboard-welcome animate-fadeIn">
          <div className="dashboard-welcome-left">
            <p className="welcome-greeting">Welcome back,</p>
            <h2 className="welcome-name">{user.fullName}</h2>
            <div className="welcome-meta">
              <span className="badge badge-blue" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><GraduationCap size={14} /> {user.batch}</span>
            </div>
            <p className="welcome-sub">Keep pushing forward! You're on the right track.</p>
            <div className="welcome-actions">
              <button id="view-learning-btn" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => setActiveRoute('mylearning')}>
                <BookOpen size={16} /> View My Learning
              </button>
              <button id="view-tests-btn" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => setActiveRoute('practicetests')}>
                <PenTool size={16} /> Take a Test
              </button>
            </div>
          </div>
          <div className="dashboard-welcome-right">
            <div className="attendance-ring-card">
              <CircleProgress value={attendance} color="#22c55e" size={110} />
              <div>
                <p className="ring-label">Attendance</p>
                <p className="ring-sub">{completedClasses} of {totalClasses} classes</p>
              </div>
            </div>
            <div className="welcome-art">
              <div className="floating-card floating-card-1" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ display: 'flex', alignItems: 'center', color: '#3b82f6' }}><BookOpen size={18} /></span> {classSheets.completed} sheets done
              </div>
              <div className="floating-card floating-card-2" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ display: 'flex', alignItems: 'center', color: '#f5a623' }}><Trophy size={18} /></span> Top performer
              </div>
            </div>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="dashboard-stats animate-fadeIn delay-1">
          {statCards.map((s, i) => (
            <div key={i} className="stat-card dashboard-stat-card" style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="stat-icon-wrap" style={{ background: `${s.color}18`, color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {s.icon}
              </div>
              <div>
                <p className="stat-value" style={{ color: s.color }}>{s.value}</p>
                <p className="stat-label">{s.label}</p>
                <p className="stat-sub">{s.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="dashboard-section-header animate-fadeIn delay-2">
          <h3>Quick Access</h3>
          <span className="section-tag">Shortcuts</span>
        </div>
        <div className="quick-actions animate-fadeIn delay-2">
          {quickActions.map((a) => (
            <button
              key={a.id}
              id={`quick-${a.id}`}
              className="quick-action-btn"
              onClick={() => setActiveRoute(a.id)}
              style={{ '--qa-color': a.color }}
            >
              <span className="qa-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{a.icon}</span>
              <span className="qa-label">{a.label}</span>
              <span className="qa-arrow">→</span>
            </button>
          ))}
        </div>

        <div className="dashboard-grid animate-fadeIn delay-3">
          {/* Recent Activity */}
          <div className="card">
            <div className="card-header">
              <h3>Recent Activity</h3>
              <span className="section-tag">Last 30 days</span>
            </div>
            <div className="activity-list">
              {recentActivity.map((a) => (
                <div key={a.id} className="activity-item">
                  <div className="activity-dot" style={{ background: activityTypeColor[a.type] || '#fff' }} />
                  <div className="activity-content">
                    <div className="activity-top">
                      <span className="activity-label">{a.label}</span>
                      <span className="badge" style={{
                        background: `${activityTypeColor[a.type]}18`,
                        color: activityTypeColor[a.type],
                        border: `1px solid ${activityTypeColor[a.type]}30`,
                        fontSize: '10px',
                      }}>{a.type}</span>
                    </div>
                    <p className="activity-detail">{a.detail}</p>
                    <p className="activity-time">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Tests */}
          <div className="card">
            <div className="card-header">
              <h3>Pending Tests</h3>
              <button className="btn btn-ghost" style={{ fontSize: '12px', padding: '4px 8px' }} onClick={() => setActiveRoute('practicetests')}>
                View All →
              </button>
            </div>
            <div className="tests-list">
              {practiceTests.filter(t => t.status !== 'Completed').map(test => (
                <div key={test.id} className="test-item">
                  <div className="test-item-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {test.status === 'New' ? <PlusCircle size={20} color="#3b82f6" /> : <Clock size={20} color="#f5a623" />}
                  </div>
                  <div className="test-item-content">
                    <p className="test-item-title">{test.title}</p>
                    <div className="test-item-meta">
                      <span>{test.totalQuestions}Q</span>
                      <span>•</span>
                      <span>{test.duration}</span>
                      <span>•</span>
                      <span>Due: {test.dueDate}</span>
                    </div>
                  </div>
                  <span className={`badge ${test.status === 'New' ? 'badge-blue' : 'badge-gold'}`}>
                    {test.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Latest Learning */}
          <div className="card">
            <div className="card-header">
              <h3>Latest Classes</h3>
              <button className="btn btn-ghost" style={{ fontSize: '12px', padding: '4px 8px' }} onClick={() => setActiveRoute('mylearning')}>
                View All →
              </button>
            </div>
            <div className="latest-classes">
              {learningSessions.slice(0, 3).map(s => (
                <div key={s.id} className="latest-class-item">
                  <div className="latest-class-date">
                    <span className="lcd-day">{s.date.split(' ')[0]}</span>
                    <span className="lcd-month">{s.date.split(' ')[1]}</span>
                  </div>
                  <div className="latest-class-info">
                    <p className="lcd-topic">{s.topic}</p>
                    <p className="lcd-subject">{s.subject}</p>
                  </div>
                  <span className={`badge ${s.attendance === 'Present' ? 'badge-green' : s.attendance === 'Absent' ? 'badge-red' : 'badge-gold'}`}>
                    {s.attendance}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
