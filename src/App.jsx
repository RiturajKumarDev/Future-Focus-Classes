import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import HomePage from './components/Home/HomePage';
import Login from './components/Login/Login';
import Sidebar from './components/Sidebar/Sidebar';
import Dashboard from './components/Dashboard/Dashboard';
import MyLearning from './components/MyLearning/MyLearning';
import PracticeTests from './components/PracticeTests/PracticeTests';
import ProcturedTests from './components/ProcturedTests/ProcturedTests';
import Videos from './components/Videos/Videos';
import Resources from './components/Resources/Resources';
import Profile from './components/Profile/Profile';
import Admin from './components/Admin/Admin';
import './App.css';

const AppContent = () => {
  const { isLoggedIn, showLogin, isLoadingUser, activeRoute, sidebarCollapsed } = useApp();

  if (isLoadingUser) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
        <h2 style={{ color: 'var(--accent-gold)' }}>Loading Future Focus LMS...</h2>
      </div>
    );
  }

  // Flow: Home → Login → LMS Dashboard
  if (!isLoggedIn && !showLogin) return <HomePage />;
  if (!isLoggedIn && showLogin)  return <Login />;

  const renderPage = () => {
    switch (activeRoute) {
      case 'dashboard':      return <Dashboard />;
      case 'mylearning':     return <MyLearning />;
      case 'practicetests':  return <PracticeTests />;
      case 'procturedtests': return <ProcturedTests />;
      case 'videos':         return <Videos />;
      case 'resources':      return <Resources />;
      case 'profile':        return <Profile />;
      case 'admin':          return <Admin />;
      default:               return <Dashboard />;
    }
  };

  return (
    <div className={`app-layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar />
      <main className={`main-content ${sidebarCollapsed ? 'collapsed' : ''}`}>
        {renderPage()}
      </main>
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
