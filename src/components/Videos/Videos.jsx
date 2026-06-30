import React, { useState, useEffect } from 'react';
import Topbar from '../Sidebar/Topbar';
import { subjects } from '../../data/mockData';
import { studentService } from '../../services/studentService';
import { Search, PlayCircle, CheckCircle, Clapperboard, Calendar, User, RotateCcw, Video } from 'lucide-react';
import './Videos.css';

const Videos = () => {
  const [filterSubject, setFilterSubject] = useState('All Subjects');
  const [search, setSearch] = useState('');
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVideos = async () => {
      setLoading(true);
      const data = await studentService.getVideos();
      setVideos(data || []);
      setLoading(false);
    };
    loadVideos();
  }, []);

  const filtered = videos.filter(v =>
    (filterSubject === 'All Subjects' || v.subject === filterSubject) &&
    v.title.toLowerCase().includes(search.toLowerCase())
  );

  const counts = {
    total: videos.length,
    watched: videos.filter(v => v.status === 'Watched').length,
    pending: videos.filter(v => v.status === 'Pending').length,
  };

  return (
    <div>
      <Topbar title="Videos" subtitle="Watch your recorded class lectures anytime, anywhere." />
      <div className="page-container">

        {/* Stats */}
        {!loading && (
          <div className="vid-stats animate-fadeIn">
            {[
              { label: 'Total Videos', value: counts.total, icon: <Clapperboard size={24} />, color: '#3b82f6', sub: 'Assigned' },
              { label: 'Watched', value: counts.watched, icon: <CheckCircle size={24} />, color: '#22c55e', sub: 'Completed' },
              { label: 'Pending', value: counts.pending, icon: <PlayCircle size={24} />, color: '#f5a623', sub: 'Not watched' },
            ].map((s, i) => (
              <div key={i} className="stat-card vid-stat-card">
                <div className="vid-stat-icon" style={{ background: `${s.color}18`, color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {s.icon}
                </div>
                <p className="vid-stat-value" style={{ color: s.color }}>{s.value}</p>
                <p className="vid-stat-label">{s.label}</p>
                <p className="vid-stat-sub">{s.sub}</p>
              </div>
            ))}
          </div>
        )}

        {loading && <div style={{ color: 'var(--text-muted)', margin: '20px 0' }}>Loading videos...</div>}

        {/* Filters */}
        <div className="vid-filters animate-fadeIn delay-1">
          <div className="search-wrapper" style={{ flex: 1, maxWidth: '340px' }}>
            <span className="search-icon"><Search size={18} /></span>
            <input
              id="vid-search"
              type="text"
              className="input search-input"
              placeholder="Search videos..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select id="vid-subject-filter" className="select" value={filterSubject} onChange={e => setFilterSubject(e.target.value)}>
            {subjects.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>

        {/* Video Grid */}
        {filtered.length === 0 ? (
          <div className="card animate-fadeIn delay-2">
            <div className="empty-state">
              <div className="empty-state-icon"><Video size={48} /></div>
              <h3>No videos found</h3>
              <p>Videos assigned to your batch will appear here.</p>
            </div>
          </div>
        ) : (
          <div className="vid-grid animate-fadeIn delay-2">
            {filtered.map(video => (
              <div key={video.id} id={`video-${video.id}`} className="vid-card card">
                {/* Thumbnail */}
                <div className="vid-thumbnail">
                  <div className="vid-play-btn"><PlayCircle size={48} color="white" /></div>
                  <div className="vid-duration">{video.duration}</div>
                  <div className="vid-subject-badge" style={{ background: video.subject === 'Verbal Ability' ? '#3b82f620' : video.subject === 'Quantitative' ? '#f5a62320' : '#22c55e20' }}>
                    {video.subject}
                  </div>
                </div>
                {/* Info */}
                <div className="vid-info">
                  <h3 className="vid-title">{video.title}</h3>
                  <p className="vid-instructor" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><User size={14} /> {video.instructor}</p>
                  <div className="vid-meta">
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={14} /> {video.uploadedOn}</span>
                    <span className={`badge ${video.status === 'Watched' ? 'badge-green' : 'badge-gold'}`} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {video.status === 'Watched' ? <CheckCircle size={14} /> : <PlayCircle size={14} />} {video.status}
                    </span>
                  </div>
                  <button
                    id={`video-btn-${video.id}`}
                    className={`btn w-full ${video.status === 'Watched' ? 'btn-secondary' : 'btn-primary'}`}
                    style={{ justifyContent: 'center', marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    {video.status === 'Watched' ? <><RotateCcw size={16} /> Watch Again</> : <><PlayCircle size={16} /> Watch Now</>}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Videos;
