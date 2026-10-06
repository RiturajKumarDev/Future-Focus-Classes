import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";
import { useAuth } from "./AuthContext";

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [toast, setToast] = useState(null); // { message, type: 'success' | 'error' | 'info' }

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const fetchUserData = async () => {
    if (!isAuthenticated) {
      setUnreadNotifications(0);
      setWishlistIds(new Set());
      return;
    }

    try {
      const [notifRes, wishRes] = await Promise.allSettled([
        api.get("notifications"),
        api.get("wishlist"),
      ]);

      if (notifRes.status === "fulfilled" && notifRes.value.success) {
        setUnreadNotifications(notifRes.value.unreadCount || 0);
      }

      if (wishRes.status === "fulfilled" && wishRes.value.success) {
        const ids = new Set((wishRes.value.data || []).map((c) => c._id));
        setWishlistIds(ids);
      }
    } catch (e) {
      console.warn("Could not load user app state:", e.message);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [isAuthenticated]);

  const toggleWishlist = async (courseId) => {
    if (!isAuthenticated) {
      showToast("Please log in to add courses to your wishlist.", "info");
      return false;
    }

    try {
      const res = await api.post(`wishlist/toggle/${courseId}`);
      if (res.success) {
        setWishlistIds((prev) => {
          const updated = new Set(prev);
          if (res.isWishlisted) updated.add(courseId);
          else updated.delete(courseId);
          return updated;
        });
        showToast(res.message, "success");
        return res.isWishlisted;
      }
    } catch (err) {
      showToast(err.message, "error");
    }
    return false;
  };

  return (
    <AppContext.Provider
      value={{
        unreadNotifications,
        setUnreadNotifications,
        wishlistIds,
        toggleWishlist,
        showToast,
        addToast: showToast,
        refreshAppData: fetchUserData,
      }}
    >
      {children}
      {/* Toast Notification Container */}
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            zIndex: 9999,
            backgroundColor:
              toast.type === "success"
                ? "#10B981"
                : toast.type === "error"
                ? "#EF4444"
                : "#4F46E5",
            color: "#ffffff",
            padding: "12px 20px",
            borderRadius: "10px",
            boxShadow: "0 10px 15px -3px rgba(0,0,0,0.15)",
            fontSize: "14px",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            animation: "slideIn 0.3s ease-out",
          }}
        >
          <span>{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            style={{
              color: "#ffffff",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "16px",
              marginLeft: "10px",
            }}
          >
            ✕
          </button>
        </div>
      )}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within an AppProvider");
  return context;
};
