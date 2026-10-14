import axios from "axios";

const rawBaseUrl =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_BASE_URL ||
  "http://localhost:3000/api";

export const API_BASE_URL = rawBaseUrl.endsWith("/")
  ? rawBaseUrl
  : `${rawBaseUrl}/`;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach JWT Token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("learnx_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Standardize responses and handle 401
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong. Please try again.";

    // If 401 and not already on auth page, can trigger logout
    if (error.response?.status === 401) {
      // Don't auto-redirect if checking auth state
      if (!error.config.url.includes("auth/me")) {
        console.warn("Session expired or unauthorized request");
      }
    }

    return Promise.reject(new Error(message));
  }
);

export default api;
