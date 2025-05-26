import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Activity API methods
export const activityAPI = {
  // Create new activity
  create: async (data) => {
    const response = await api.post('/api/activities', data);
    return response.data;
  },

  // Get activities by week and day
  getByDate: async (week, day) => {
    const response = await api.get(`/api/activities?week=${week}&day=${day}`);
    return response.data;
  },

  // Get all activities for user
  getAll: async () => {
    const response = await api.get('/api/activities/all');
    return response.data;
  },

  // Update activity
  update: async (id, data) => {
    const response = await api.put(`/api/activities/${id}`, data);
    return response.data;
  },

  // Delete activity
  delete: async (id) => {
    const response = await api.delete(`/api/activities/${id}`);
    return response.data;
  },
};

// Auth API methods
export const authAPI = {
  // Login
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // Register
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
  },
};

export default api;