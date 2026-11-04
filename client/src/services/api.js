import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach guest session ID if available in localStorage
api.interceptors.request.use((config) => {
  let sessionId = localStorage.getItem('autox_session_id');
  if (!sessionId) {
    sessionId = `guest_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem('autox_session_id', sessionId);
  }
  config.headers['x-session-id'] = sessionId;
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor for consistent error extraction
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const customError = {
      message: error.response?.data?.message || error.message || 'An unexpected error occurred',
      errors: error.response?.data?.errors || [],
      status: error.response?.status
    };
    return Promise.reject(customError);
  }
);

export default api;

