import React from 'react';
import { useApp } from '../../context/AppContext';
import { LayoutDashboard, BookOpen, PenTool, ShieldCheck, Video, Folder, User, Settings, LogOut, X, Shield, ChevronLeft, ChevronRight } from 'lucide-react';
import './Sidebar.css';

const navItems = [
  { id: 'dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
  { id: 'mylearning', icon: <BookOpen size={20} />, label: 'My Learning' },
  { id: 'practicetests', icon: <PenTool size={20} />, label: 'Practice Tests' },
  { id: 'procturedtests', icon: <ShieldCheck size={20} />, label: 'Proctored Tests' },
  { id: 'videos', icon: <Video size={20} />, label: 'Videos' },
  { id: 'resources', icon: <Folder size={20} />, label: 'Resources' },
  { id: 'profile', icon: <User size={20} />, label: 'Profile' },
];

const Sidebar = () => {
  const { sidebarCollapsed, toggleSidebar, isMobile, mobileOpen, closeMobileSidebar, activeRoute, setActiveRoute, user, logout } = useApp();

  // On mobile: drawer is open/closed via mobileOpen
  // On desktop: sidebar is collapsed/expanded via sidebarCollapsed
  const isCollapsed = !isMobile && sidebarCollapsed;
  const sidebarClass = [
    'sidebar',
    isCollapsed ? 'collapsed' : '',
    isMobile ? 'mobile' : '',
    isMobile && mobileOpen ? 'mobile-open' : '',
  ].filter(Boolean).join(' ');

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isMobile && mobileOpen && (
        <div className="sidebar-overlay" onClick={closeMobileSidebar} />
      )}

      <aside className={sidebarClass}>
        {/* Brand */}
        <div className="sidebar-brand">
          <div className="sidebar-logo-wrap">
            <img src="/logo.png" alt="Future Focus Classes" className="sidebar-logo" />
          </div>
          {!isCollapsed && (
            <div className="sidebar-brand-text">
              <span className="sidebar-brand-name">Future Focus</span>
              <span className="sidebar-brand-sub">Classes LMS</span>
            </div>
          )}
          {isMobile ? (
            <button
              id="sidebar-close-btn"
              className="sidebar-toggle"
              onClick={closeMobileSidebar}
              title="Close"
            >
              <X size={18} />
            </button>
          ) : (
            <button
              id="sidebar-toggle-btn"
              className="sidebar-toggle"
              onClick={toggleSidebar}
              title={sidebarCollapsed ? 'Expand' : 'Collapse'}
            >
              {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
          )}
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          <div className="sidebar-nav-label">{!isCollapsed && 'NAVIGATION'}</div>
          {navItems.map((item) => (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              className={`sidebar-nav-item ${activeRoute === item.id ? 'active' : ''} tooltip`}
              onClick={() => setActiveRoute(item.id)}
            >
              <span className="sidebar-nav-icon">{item.icon}</span>
              {!isCollapsed && <span className="sidebar-nav-label-text">{item.label}</span>}
              {isCollapsed && <span className="tooltip-text">{item.label}</span>}
            </button>
          ))}
          {user?.role?.toLowerCase() === 'admin' && (
            <div className="sidebar-nav" style={{ flex: 'none', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
              <p className="sidebar-nav-label">{!isCollapsed && 'ADMINISTRATION'}</p>
              <button
                id={`nav-admin`}
                className={`sidebar-nav-item ${activeRoute === 'admin' ? 'active' : ''}`}
                onClick={() => setActiveRoute('admin')}
                title={isCollapsed ? 'Admin Panel' : undefined}
              >
                <span className="sidebar-nav-icon"><Settings size={20} /></span>
                {!isCollapsed && <span className="sidebar-nav-text">Admin Panel</span>}
                {isCollapsed && <span className="tooltip-text">Admin Panel</span>}
              </button>
            </div>
          )}
        </nav>

        {/* User Section */}
        <div className="sidebar-footer">
          {isCollapsed ? (
            <div className="sidebar-user-mini tooltip">
              <div className="avatar avatar-primary" style={{ width: '36px', height: '36px', fontSize: '12px' }}>{user.avatar}</div>
              <span className="tooltip-text">Profile</span>
            </div>
          ) : (
            <div className="sidebar-user" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div className="avatar avatar-primary sidebar-avatar">{user.avatar}</div>
              <div className="sidebar-user-info">
                <span className="sidebar-user-name">{user.fullName}</span>
                <span className="sidebar-user-role">{user.role}</span>
              </div>
            </div>
          )}
          <button
            id="sidebar-logout-btn"
            className={`sidebar-signout ${isCollapsed ? 'mini tooltip' : ''}`}
            onClick={logout}
          >
            <LogOut size={18} />
            {!isCollapsed && <span>Sign Out</span>}
            {isCollapsed && <span className="tooltip-text">Sign Out</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
