import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/',
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    console.log('Interceptor triggered:', error.response?.status, originalRequest.url);
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        console.log('Already refreshing, queuing request');
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => api(originalRequest)).catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;
      console.log('Attempting token refresh');

      try {
        // Fetch refreshToken from cookie manually if needed, but for now rely on backend
        const refreshResponse = await api.post('auth/jwt/refresh/', {}, { withCredentials: true });
        console.log('Refresh successful:', refreshResponse.data);
        isRefreshing = false;
        processQueue(null);
        return api(originalRequest);
      } catch (refreshError) {
        console.error('Refresh failed:', refreshError.response?.data || refreshError.message);
        isRefreshing = false;
        processQueue(refreshError);
        useAuthStore.getState().clearAuth();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export const login = async (email, password) => {
  const response = await api.post('auth/jwt/create/', { email, password });
  return response.data;
};

export const register = async (userData) => {
  const response = await api.post('auth/users/', userData);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get('auth/users/me/');
  return response.data;
};

export const logout = async () => {
  await api.post('auth/logout/');
};

export const getProfile = async () => {
  const response = await api.get('auth/users/me/');
  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await api.put('auth/users/me/', profileData);
  return response.data;
};

export const changePassword = async (currentPassword, newPassword) => {
  const response = await api.post('auth/users/set_password/', {
    current_password: currentPassword,
    new_password: newPassword,
  });
  return response.data;
};