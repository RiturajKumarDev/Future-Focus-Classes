import React from 'react';
import { useApp } from '../../context/AppContext';
import { Menu, Bell } from 'lucide-react';
import './Topbar.css';

const Topbar = ({ title, subtitle }) => {
  const { user, toggleSidebar } = useApp();

  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  const dateStr = now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button id="topbar-menu-btn" className="topbar-menu-btn" onClick={toggleSidebar} title="Toggle Menu">
          <Menu size={20} />
        </button>
        <div className="topbar-title-wrap">
          <h1 className="topbar-title">{title}</h1>
          {subtitle && <p className="topbar-subtitle">{subtitle}</p>}
        </div>
      </div>

      <div className="topbar-right">
        <div className="topbar-datetime">
          <span className="topbar-time">{timeStr}</span>
          <span className="topbar-date">{dateStr}</span>
        </div>
        <div className="topbar-divider" />
        <div className="topbar-notification tooltip">
          <button id="topbar-notify-btn" className="topbar-icon-btn" title="Notifications">
            <Bell size={20} />
            <span className="notify-dot" />
          </button>
          <span className="tooltip-text" style={{ left: 'auto', right: '110%' }}>Notifications</span>
        </div>
        <div className="topbar-user">
          <div className="avatar avatar-primary">{user.avatar}</div>
          <div className="topbar-user-info">
            <span className="topbar-user-name">{user.fullName}</span>
            <span className="topbar-user-batch">{user.batch}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
