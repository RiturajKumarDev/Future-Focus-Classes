import React, { createContext, useContext, useState, useEffect } from 'react';
import { studentService } from '../services/studentService';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [activeRoute, setActiveRoute] = useState('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false); // false = show home page

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoadingUser(true);
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const fetchedUser = await studentService.getCurrentUser();
          if (fetchedUser) {
            setUser(fetchedUser);
            setIsLoggedIn(true);
          }
        } catch (err) {
          console.warn("Failed to fetch user with token, clearing token.", err);
          localStorage.removeItem('token');
        }
      }
      setIsLoadingUser(false);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) setMobileOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileOpen(prev => !prev);
    } else {
      setSidebarCollapsed(prev => !prev);
    }
  };

  const closeMobileSidebar = () => setMobileOpen(false);

  const goToLogin = () => setShowLogin(true);
  const goToHome  = () => setShowLogin(false);

  const login = async (email, password) => {
    try {
      const res = await studentService.login(email, password);
      if (res && res.token) {
        localStorage.setItem('token', res.token);
        if (res.user) {
          setUser(res.user);
          // also store basic user data if needed, or rely on fetchUser
          localStorage.setItem('user', JSON.stringify(res.user));
        }
        setIsLoggedIn(true);
        setShowLogin(false);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Login failed", err);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsLoggedIn(false);
    setActiveRoute('dashboard');
    setMobileOpen(false);
    setShowLogin(false); // back to home on logout
  };

  const handleSetActiveRoute = (route) => {
    setActiveRoute(route);
    if (isMobile) setMobileOpen(false);
  };

  return (
    <AppContext.Provider value={{
      sidebarCollapsed,
      isMobile,
      mobileOpen,
      toggleSidebar,
      closeMobileSidebar,
      user,
      isLoadingUser,
      activeRoute,
      setActiveRoute: handleSetActiveRoute,
      isLoggedIn,
      login,
      logout,
      showLogin,
      goToLogin,
      goToHome,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
