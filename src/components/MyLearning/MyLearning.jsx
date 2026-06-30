import React, { useState } from 'react';
import Topbar from '../Sidebar/Topbar';
import { learningSessions, subjects } from '../../data/mockData';
import { Search, List, Grid, Calendar, ClipboardList, CheckCircle, CalendarDays, Inbox, XCircle, Clock, Paperclip, ChevronDown, ChevronUp, Folder, FileText, Download } from 'lucide-react';
import './MyLearning.css';

const MyLearning = () => {
  const [search, setSearch] = useState('');
  const [filterSubject, setFilterSubject] = useState('All Subjects');
  const [view, setView] = useState('list');
  const [expandedId, setExpandedId] = useState(null);

  const filtered = learningSessions.filter(s =>
    (filterSubject === 'All Subjects' || s.subject === filterSubject) &&
    (s.topic.toLowerCase().includes(search.toLowerCase()) || s.subject.toLowerCase().includes(search.toLowerCase()))
  );

  const attendanceColor = { Present: '#22c55e', Absent: '#ef4444', Pending: '#f5a623' };

  return (
    <div>
      <Topbar title="My Learning" subtitle="Access all your class sessions, class sheets, and attendance in one place." />
      <div className="page-container">

        {/* Filters */}
        <div className="ml-filters animate-fadeIn">
          <div className="search-wrapper" style={{ flex: 1, maxWidth: '360px' }}>
            <span className="search-icon"><Search size={18} /></span>
            <input
              id="ml-search"
              type="text"
              className="input search-input"
              placeholder="Search by class, subject, or topic..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select
            id="ml-subject-filter"
            className="select"
            value={filterSubject}
            onChange={e => setFilterSubject(e.target.value)}
          >
            {subjects.map(s => <option key={s}>{s}</option>)}
          </select>
          <div className="pill-tabs">
            <button id="ml-view-list" className={`pill-tab ${view === 'list' ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '6px' }} onClick={() => setView('list')}><List size={16} /> List</button>
            <button id="ml-view-grid" className={`pill-tab ${view === 'grid' ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '6px' }} onClick={() => setView('grid')}><Grid size={16} /> Grid</button>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="ml-stats animate-fadeIn delay-1">
          {[
            { label: 'Total Classes', value: learningSessions.length, icon: <Calendar size={24} />, color: '#3b82f6' },
            { label: 'Class Sheets', value: '2%', icon: <ClipboardList size={24} />, color: '#8b5cf6', sub: '1/44 completed' },
            { label: 'Attendance Rate', value: '72%', icon: <CheckCircle size={24} />, color: '#22c55e', sub: 'Overall' },
            { label: 'This Week', value: 3, icon: <CalendarDays size={24} />, color: '#f5a623', sub: 'Sessions' },
          ].map((s, i) => (
            <div key={i} className="stat-card ml-stat-card">
              <p className="ml-stat-icon" style={{ color: s.color }}>{s.icon}</p>
              <p className="ml-stat-value" style={{ color: s.color }}>{s.value}</p>
              <p className="ml-stat-label">{s.label}</p>
              {s.sub && <p className="ml-stat-sub">{s.sub}</p>}
            </div>
          ))}
        </div>

        {/* Session List */}
        <div className={`ml-sessions animate-fadeIn delay-2 ${view}`}>
          {filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon"><Inbox size={48} /></div>
              <h3>No sessions found</h3>
              <p>Try adjusting your search or filter options.</p>
            </div>
          ) : filtered.map((session) => (
            <div
              key={session.id}
              id={`session-${session.id}`}
              className={`ml-session-card card ${expandedId === session.id ? 'expanded' : ''}`}
            >
              <div className="ml-session-header" onClick={() => setExpandedId(expandedId === session.id ? null : session.id)}>
                <div className="ml-session-date">
                  <span className="mls-day">{session.date.split(' ')[0]}</span>
                  <span className="mls-month">{session.date.split(' ')[1]}</span>
                  <span className="mls-year">{session.date.split(' ')[2]}</span>
                </div>
                <div className="ml-session-info">
                  <p className="mls-topic">{session.topic}</p>
                  <p className="mls-subject">{session.subject} · <span className="mls-type">{session.type}</span></p>
                </div>
                <div className="ml-session-meta">
                  <span className="badge" style={{
                    background: `${attendanceColor[session.attendance]}18`,
                    color: attendanceColor[session.attendance],
                    border: `1px solid ${attendanceColor[session.attendance]}30`,
                    display: 'flex', alignItems: 'center', gap: '4px'
                  }}>
                    {session.attendance === 'Present' ? <CheckCircle size={14} /> : session.attendance === 'Absent' ? <XCircle size={14} /> : <Clock size={14} />} {session.attendance}
                  </span>
                  <span className="mls-files-count" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Paperclip size={14} /> {session.materials.length + (session.extraFiles || 0)} files</span>
                  <span className="mls-chevron">{expandedId === session.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}</span>
                </div>
              </div>

              {expandedId === session.id && (
                <div className="ml-session-materials">
                  <p className="materials-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Folder size={16} /> Class Materials</p>
                  <div className="materials-grid">
                    {session.materials.map((m, i) => (
                      <div key={i} className="material-item">
                        <span className="material-icon" style={{ display: 'flex', color: 'var(--text-muted)' }}><FileText size={18} /></span>
                        <span className="material-name">{m}</span>
                        <button className="btn btn-ghost material-download" style={{ padding: '4px 8px' }}>
                          <Download size={16} />
                        </button>
                      </div>
                    ))}
                    {session.extraFiles > 0 && (
                      <div className="material-more">
                        <button className="btn btn-secondary" style={{ fontSize: '13px', padding: '8px 14px' }}>
                          +{session.extraFiles} more files
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyLearning;
