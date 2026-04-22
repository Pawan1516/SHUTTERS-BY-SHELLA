import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
});

// Auto-attach auth token to every request
api.interceptors.request.use((config) => {
  try {
    const admin = JSON.parse(localStorage.getItem('admin'));
    if (admin?.token) {
      config.headers.Authorization = `Bearer ${admin.token}`;
    }
  } catch {}
  return config;
});

export default api;
export { API_URL };
