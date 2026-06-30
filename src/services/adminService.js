import { apiClient } from './apiClient';

/**
 * Service for Admin Panel operations (POST, PUT, DELETE).
 * Endpoints are assumed standard REST structures until backend specifies otherwise.
 */

export const adminService = {
  // Users (Registrations)
  registerUser: async (userData) => {
    return apiClient('/users/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Courses
  addCourse: async (courseData) => {
    return apiClient('/courses', {
      method: 'POST',
      body: JSON.stringify(courseData),
    });
  },

  // Resources
  uploadResource: async (resourceData) => {
    // If resourceData is FormData (for files), we would omit Content-Type header
    return apiClient('/resources', {
      method: 'POST',
      body: JSON.stringify(resourceData),
    });
  },
  deleteResource: async (id) => {
    return apiClient(`/resources/${id}`, { method: 'DELETE' });
  },

  // Videos
  addVideo: async (videoData) => {
    return apiClient('/videos', {
      method: 'POST',
      body: JSON.stringify(videoData),
    });
  },
  deleteVideo: async (id) => {
    return apiClient(`/videos/${id}`, { method: 'DELETE' });
  },

  // Tests
  createTest: async (testData) => {
    return apiClient('/tests', {
      method: 'POST',
      body: JSON.stringify(testData),
    });
  },

  // Toppers
  addTopper: async (topperData) => {
    return apiClient('/toppers/save', {
      method: 'POST',
      body: JSON.stringify(topperData),
    });
  },
  deleteTopper: async (id) => {
    return apiClient(`/toppers/${id}`, { method: 'DELETE' });
  },
};
