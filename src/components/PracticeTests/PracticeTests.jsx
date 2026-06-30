import React, { useState, useEffect } from 'react';
import Topbar from '../Sidebar/Topbar';
import { subjects } from '../../data/mockData';
import { studentService } from '../../services/studentService';
import { ClipboardList, PlusCircle, Clock, CheckCircle, Search, ClipboardEdit, HelpCircle, Timer, Calendar, Eye, Rocket } from 'lucide-react';
import './PracticeTests.css';

const statusColor = { New: '#3b82f6', Pending: '#f5a623', Completed: '#22c55e' };
const statusBadge = { New: 'badge-blue', Pending: 'badge-gold', Completed: 'badge-green' };

const PracticeTests = () => {
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterSubject, setFilterSubject] = useState('All Subjects');
  const [search, setSearch] = useState('');
  const [practiceTests, setPracticeTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTests = async () => {
      setLoading(true);
      const data = await studentService.getTests();
      setPracticeTests(data || []);
      setLoading(false);
    };
    loadTests();
  }, []);

  const filtered = practiceTests.filter(t =>
    (filterStatus === 'All' || t.status === filterStatus) &&
    (filterSubject === 'All Subjects' || t.subject === filterSubject) &&
    t.title.toLowerCase().includes(search.toLowerCase())
  );

  const counts = {
    total: practiceTests.length,
    new: practiceTests.filter(t => t.status === 'New').length,
    pending: practiceTests.filter(t => t.status === 'Pending').length,
    completed: practiceTests.filter(t => t.status === 'Completed').length,
  };

  return (
    <div>
      <Topbar title="Practice Tests" subtitle="Complete pending tests and review your submitted results." />
      <div className="page-container">

        {/* Stat Cards */}
        {!loading && (
          <div className="pt-stats animate-fadeIn">
            {[
              { label: 'Total Tests', value: counts.total, icon: <ClipboardList size={24} />, color: '#3b82f6', sub: 'Assigned' },
              { label: 'New Tests', value: counts.new, icon: <PlusCircle size={24} />, color: '#3b82f6', sub: 'Assigned recently' },
              { label: 'Pending Tests', value: counts.pending, icon: <Clock size={24} />, color: '#f5a623', sub: 'Not attempted yet' },
              { label: 'Completed Tests', value: counts.completed, icon: <CheckCircle size={24} />, color: '#22c55e', sub: 'Submitted tests' },
            ].map((s, i) => (
              <div key={i} className="stat-card pt-stat-card">
                <div className="pt-stat-icon-wrap" style={{ background: `${s.color}18`, color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {s.icon}
                </div>
                <p className="pt-stat-value" style={{ color: s.color }}>{s.value}</p>
                <p className="pt-stat-label">{s.label}</p>
                <p className="pt-stat-sub">{s.sub}</p>
              </div>
            ))}
          </div>
        )}
        
        {loading && <div style={{ color: 'var(--text-muted)', margin: '20px 0' }}>Loading tests...</div>}

        {/* Filters */}
        <div className="pt-filters animate-fadeIn delay-1">
          <div className="search-wrapper" style={{ flex: 1, maxWidth: '320px' }}>
            <span className="search-icon"><Search size={18} /></span>
            <input
              id="pt-search"
              type="text"
              className="input search-input"
              placeholder="Search tests..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select id="pt-status-filter" className="select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="All">Status: All ({practiceTests.length})</option>
            <option value="New">New</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>
          <select id="pt-subject-filter" className="select" value={filterSubject} onChange={e => setFilterSubject(e.target.value)}>
            {subjects.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>

        {/* Tests Grid */}
        {filtered.length === 0 ? (
          <div className="card animate-fadeIn delay-2">
            <div className="empty-state">
              <div className="empty-state-icon"><ClipboardList size={48} /></div>
              <h3>No tests assigned yet.</h3>
              <p>Tests assigned to your batch will appear here once your manager assigns them.</p>
            </div>
          </div>
        ) : (
          <div className="pt-grid animate-fadeIn delay-2">
            {filtered.map(test => (
              <div key={test.id} id={`test-${test.id}`} className="pt-card card">
                <div className="pt-card-header">
                  <div className="pt-card-icon" style={{ background: `${statusColor[test.status]}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: statusColor[test.status] }}>
                    <ClipboardEdit size={22} />
                  </div>
                  <span className={`badge ${statusBadge[test.status]}`}>{test.status}</span>
                </div>
                <h3 className="pt-card-title">{test.title}</h3>
                <p className="pt-card-subject">{test.subject}</p>
                <div className="pt-card-meta">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><HelpCircle size={14} /> {test.totalQuestions} Questions</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Timer size={14} /> {test.duration}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={14} /> Due: {test.dueDate}</span>
                </div>
                {test.score !== null && (
                  <div className="pt-score">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${test.score}%` }} />
                    </div>
                    <span className="pt-score-label">Score: {test.score}%</span>
                  </div>
                )}
                <div className="pt-card-actions">
                  {test.status === 'Completed' ? (
                    <button id={`test-review-${test.id}`} className="btn btn-secondary w-full" style={{ justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Eye size={16} /> View Results
                    </button>
                  ) : (
                    <button id={`test-start-${test.id}`} className="btn btn-primary w-full" style={{ justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Rocket size={16} /> {test.status === 'New' ? 'Start Test' : 'Continue Test'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PracticeTests;
