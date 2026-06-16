import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

// Interceptor: adjuntar JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor: manejar 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // No redirigir si estamos en login (para permitir que se muestren errores de credenciales)
      const isLoginRoute = window.location.pathname === '/login' || window.location.pathname === '/register';
      const isAuthEndpoint = error.config?.url?.includes('/usuarios/login') || error.config?.url?.includes('/usuarios/register');
      
      if (!isLoginRoute && !isAuthEndpoint) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
