import React, { useState } from 'react';
import Topbar from '../Sidebar/Topbar';
import { procturedTests } from '../../data/mockData';
import { ShieldCheck, Unlock, Calendar, CheckCircle, HelpCircle, Timer, Eye, Rocket, Info } from 'lucide-react';
import './ProcturedTests.css';

const ProcturedTests = () => {
  const [filterStatus, setFilterStatus] = useState('All');

  const filtered = procturedTests.filter(t =>
    filterStatus === 'All' || t.status === filterStatus
  );

  const counts = {
    total: procturedTests.length,
    openNow: procturedTests.filter(t => t.status === 'Open').length,
    scheduled: procturedTests.filter(t => t.status === 'Scheduled').length,
    completed: procturedTests.filter(t => t.status === 'Completed').length,
  };

  const statusColor = { Scheduled: '#8b5cf6', Open: '#3b82f6', Completed: '#22c55e' };
  const statusBadge = { Scheduled: 'badge-purple', Open: 'badge-blue', Completed: 'badge-green' };

  return (
    <div>
      <Topbar title="Proctored Tests" subtitle="Strictly monitored exams with live proctoring." />
      <div className="page-container">

        {/* Stat Cards */}
        <div className="prt-stats animate-fadeIn">
          {[
            { label: 'Total Tests', value: counts.total, icon: <ShieldCheck size={24} />, color: '#3b82f6', sub: 'Assigned' },
            { label: 'Open Now', value: counts.openNow, icon: <Unlock size={24} />, color: '#22c55e', sub: 'Ready to start' },
            { label: 'Scheduled', value: counts.scheduled, icon: <Calendar size={24} />, color: '#8b5cf6', sub: 'Upcoming' },
            { label: 'Completed', value: counts.completed, icon: <CheckCircle size={24} />, color: '#22c55e', sub: 'Submitted' },
          ].map((s, i) => (
            <div key={i} className="stat-card prt-stat-card">
              <div className="prt-stat-icon" style={{ background: `${s.color}18`, color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {s.icon}
              </div>
              <p className="prt-stat-value" style={{ color: s.color }}>{s.value}</p>
              <p className="prt-stat-label">{s.label}</p>
              <p className="prt-stat-sub">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="prt-filters animate-fadeIn delay-1">
          <select id="prt-status-filter" className="select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="All">Status: All ({procturedTests.length})</option>
            <option value="Open">Open</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Completed">Completed</option>
          </select>
          <select className="select">
            <option>Newest first</option>
            <option>Oldest first</option>
          </select>
        </div>

        {/* Tests */}
        {filtered.length === 0 ? (
          <div className="card animate-fadeIn delay-2">
            <div className="empty-state">
              <div className="empty-state-icon"><ShieldCheck size={48} /></div>
              <h3>No proctored tests</h3>
              <p>Proctored assignments for your batch will appear here.</p>
            </div>
          </div>
        ) : (
          <div className="prt-list animate-fadeIn delay-2">
            {filtered.map(test => (
              <div key={test.id} id={`prt-${test.id}`} className="prt-card card">
                <div className="prt-card-left">
                  <div className="prt-card-icon" style={{ background: `${statusColor[test.status]}18`, color: statusColor[test.status], display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ShieldCheck size={28} />
                  </div>
                  <div>
                    <h3 className="prt-card-title">{test.title}</h3>
                    <p className="prt-card-subject">{test.subject}</p>
                    <div className="prt-card-meta">
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><HelpCircle size={14} /> {test.totalQuestions}Q</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Timer size={14} /> {test.duration}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={14} /> {test.scheduledDate}</span>
                    </div>
                  </div>
                </div>
                <div className="prt-card-right">
                  <span className={`badge ${statusBadge[test.status]}`}>{test.status}</span>
                  {test.score !== null && (
                    <div className="prt-score">
                      <span className="prt-score-val">{test.score}%</span>
                      <span className="prt-score-label">Score</span>
                    </div>
                  )}
                  {test.status === 'Completed' ? (
                    <button id={`prt-review-${test.id}`} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Eye size={16} /> View Results</button>
                  ) : test.status === 'Open' ? (
                    <button id={`prt-start-${test.id}`} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Rocket size={16} /> Start Now</button>
                  ) : (
                    <button className="btn btn-secondary" disabled style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={16} /> Scheduled</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Notice */}
        <div className="prt-notice animate-fadeIn delay-3">
          <span className="prt-notice-icon"><Info size={24} /></span>
          <div>
            <p className="prt-notice-title">Proctoring Guidelines</p>
            <p className="prt-notice-text">Proctored tests require a stable internet connection and camera access. Ensure a distraction-free environment before starting. Any suspicious activity may lead to disqualification.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcturedTests;
