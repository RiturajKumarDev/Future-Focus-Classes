import { apiClient } from './apiClient';
import { learningSessions, practiceTests, videos } from '../data/mockData';

/**
 * Service for fetching data for Student/Public views.
 * Currently falls back to mockData if the API fetch fails, 
 * ensuring the UI doesn't break while the backend is being built.
 */

export const studentService = {
  // Login
  login: async (email, password) => {
    try {
      const res = await apiClient('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      return res; // Should contain { token, user }
    } catch (error) {
      throw error;
    }
  },

  // Current User (Auth)
  getCurrentUser: async () => {
    try {
      return await apiClient('/auth/me');
    } catch (error) {
      // Fallback for development
      const { currentUser } = await import('../data/mockData');
      console.warn("Using mock user due to API failure");
      return currentUser;
    }
  },

  // Home Page Toppers
  getTopResults: async () => {
    try {
      const res = await apiClient('/toppers/all');
      return res.data || res; // depending on if API wraps in { data: [] }
    } catch (error) {
      return null; // Return null so HomePage uses its internal mock list
    }
  },

  // Home Page Teachers
  getTeachers: async () => {
    try {
      const res = await apiClient('/teachers/all');
      return res.data || res;
    } catch (error) {
      return null;
    }
  },

  // Videos
  getVideos: async () => {
    try {
      const res = await apiClient('/videos');
      return res.data || res;
    } catch (error) {
      console.warn("Using mock videos");
      return videos; // Fallback
    }
  },

  // Resources (Sessions/Notes)
  getResources: async () => {
    try {
      const res = await apiClient('/resources');
      return res.data || res;
    } catch (error) {
      console.warn("Using mock resources");
      return learningSessions; // Fallback
    }
  },

  // Tests
  getTests: async () => {
    try {
      const res = await apiClient('/tests');
      return res.data || res;
    } catch (error) {
      console.warn("Using mock tests");
      return practiceTests; // Fallback
    }
  }
};
