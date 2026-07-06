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
  async (error) => {
    if (!error.response) {
      // Error de red o servidor caído
      console.error('Network Error: El backend no responde');
      return Promise.reject({
        ...error,
        message: 'No se pudo conectar con el servidor. Por favor, verifica tu conexión a internet o asegúrate de que el servicio de FadeBooker esté activo.',
        isNetworkError: true
      });
    }

    const originalRequest = error.config;

    // If 401, try refresh token flow once
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refresh_token');

      const refreshEndpoints = [
        '/auth/refresh',
        '/usuarios/refresh',
        '/auth/token/refresh',
        '/refresh'
      ];

      for (const ep of refreshEndpoints) {
        try {
          const url = (api.defaults.baseURL || '') + ep;
          const payload = refreshToken ? { refreshToken } : {};
          const resp = await axios.post(url, payload, { headers: { 'Content-Type': 'application/json' }, withCredentials: true });
          if (resp && (resp.status === 200 || resp.status === 201)) {
            const newToken = resp.data?.token || resp.data?.accessToken || resp.data?.access_token;
            const newRefresh = resp.data?.refreshToken || resp.data?.refresh_token;
            if (newToken) {
              localStorage.setItem('token', newToken);
              if (newRefresh) localStorage.setItem('refresh_token', newRefresh);
              // update Authorization header and retry original request
              originalRequest.headers = originalRequest.headers || {};
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return api(originalRequest);
            }
          }
        } catch (e) {
          // try next endpoint
        }
      }

      // If refresh failed, fall back to logout flow
      console.warn('Token expirado o inválido y refresh falló. Limpiando localStorage y redirigiendo...');
      try { localStorage.setItem('logout_reason', 'Tu sesión expiró o es inválida. Por favor inicia sesión nuevamente.'); } catch {}
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default api;
