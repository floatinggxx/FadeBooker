import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach token from localStorage if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      // Error de red o servidor caído
      console.error('Network Error: El backend no responde');
      return Promise.reject({
        ...error,
        message: 'No se pudo conectar con el servidor. Por favor, verifica tu conexión a internet o asegúrate de que el servicio de FadeBooker esté activo.',
        isNetworkError: true
      });
    }
    return Promise.reject(error);
  }
);

export default api;
