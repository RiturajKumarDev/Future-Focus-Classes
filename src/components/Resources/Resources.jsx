import React, { useState, useEffect } from 'react';
import Topbar from '../Sidebar/Topbar';
import { subjects } from '../../data/mockData';
import { studentService } from '../../services/studentService';
import { Search, Package, Folder, FileText, FileEdit, BarChart, Video, Save, Calendar, Eye, Download } from 'lucide-react';
import './Resources.css';

const typeColor  = { PDF: '#ef4444', DOC: '#3b82f6', PPT: '#f5a623', VIDEO: '#22c55e' };
const typeEmoji  = { PDF: <FileText size={24} />, DOC: <FileEdit size={24} />, PPT: <BarChart size={24} />, VIDEO: <Video size={24} /> };

const Resources = () => {
  const [filterSubject, setFilterSubject] = useState('All Subjects');
  const [search, setSearch] = useState('');
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadResources = async () => {
      setLoading(true);
      const data = await studentService.getResources();
      setResources(data || []);
      setLoading(false);
    };
    loadResources();
  }, []);

  const filtered = resources.filter(r =>
    (filterSubject === 'All Subjects' || r.subject === filterSubject) &&
    String(r.title).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <Topbar title="Resources" subtitle="Download class notes, formula sheets & study materials." />
      <div className="page-container">

        {/* ── Filter Bar ── */}
        <div className="res-filterbar animate-fadeIn">
          {/* Search */}
          <div className="res-search-wrap">
            <span className="res-search-icon"><Search size={18} /></span>
            <input
              id="res-search"
              type="text"
              className="res-search-input"
              placeholder="Search resources…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Subject Filter */}
          <select
            id="res-subject-filter"
            className="res-select select"
            value={filterSubject}
            onChange={e => setFilterSubject(e.target.value)}
          >
            {subjects.map(s => <option key={s}>{s}</option>)}
          </select>

          {/* Count */}
          <div className="res-count" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Package size={18} /> <strong>{filtered.length}</strong> {filtered.length === 1 ? 'file' : 'files'}
          </div>
        </div>

        {/* ── Empty State ── */}
        {/* ── Content ── */}
        {loading ? (
          <div style={{ color: 'var(--text-muted)', margin: '20px 0' }}>Loading resources...</div>
        ) : (
          <div className="res-grid animate-fadeIn delay-1">
            {filtered.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon"><Folder size={48} /></div>
                <h3>No materials found</h3>
                <p>Try adjusting your search or subject filters.</p>
              </div>
            ) : (
              filtered.map(res => {
                const color = typeColor[res.type] || '#3b82f6';
                return (
                  <div key={res.id} id={`resource-${res.id}`} className="res-item card">

                    {/* Icon */}
                    <div className="res-icon" style={{ background: `${color}18`, color: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span className="res-icon-emoji" style={{ display: 'flex' }}>{typeEmoji[res.type] || <Folder size={24} />}</span>
                      <span className="res-type-pill" style={{ background: color }}>{res.type}</span>
                    </div>

                    {/* Info */}
                    <div className="res-info">
                      <p className="res-title">{res.title}</p>
                      <p className="res-subject">{res.subject}</p>
                      <div className="res-meta" style={{ display: 'flex', gap: '12px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Save size={14} /> {res.size}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={14} /> {res.uploadedOn}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="res-actions">
                      <button
                        id={`res-preview-${res.id}`}
                        className="res-btn res-btn-ghost"
                        title="Preview"
                        style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <Eye size={16} /> Preview
                      </button>
                      <button
                        id={`res-download-${res.id}`}
                        className="res-btn res-btn-primary"
                        title="Download"
                        style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <Download size={16} /> Download
                      </button>
                    </div>

                  </div>
                );
              })
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default Resources;
