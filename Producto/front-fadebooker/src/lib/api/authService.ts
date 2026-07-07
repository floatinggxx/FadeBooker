import api from '../api';
import { LoginRequest, LoginResponse, RegisterRequest, Usuario } from '@/types';

export const authService = {
  async login(email: string, contrasena: string): Promise<LoginResponse> {
    const response = await api.post<{ usuario: any; token: string }>('/usuarios/login', {
      email,
      contrasena
    });
    // El backend devuelve { usuario, token } directamente según usuario.service.js
    const { usuario, token } = response.data;
    return {
      id: (usuario.id_usuario || usuario.id)?.toString() || '',
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
      id_tienda: usuario.id_tienda,
      id_barbero: usuario.id_barbero,
      token
    };
  },

  async register(data: RegisterRequest): Promise<any> {
    const response = await api.post<any>('/usuarios/register', data);
    // Backend may return either the created user or a pending registration message
    if (response.status === 201 && response.data?.status === 'success' && response.data?.data) {
      const maybe = response.data.data;
      // Si el backend devolvió datos del usuario
      if (maybe.id_usuario || maybe.id) {
        const user = maybe;
        return {
          user: {
            ...user,
            id: (user.id_usuario || user.id)?.toString() || ''
          },
          token: response.data.token
        };
      }

      // Si el backend devolvió un objeto con email (registro pendiente)
      if (maybe.email) {
        return { pending: true, email: maybe.email };
      }
    }

    return response.data;
  },

  async logout(): Promise<void> {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  async confirmEmail(token: string): Promise<any> {
    const response = await api.get<any>(`/usuarios/confirm-email?token=${encodeURIComponent(token)}`);
    return response.data;
  },

  async resendConfirmation(email: string): Promise<any> {
    const response = await api.post<any>('/usuarios/resend-confirmation', { email });
    return response.data;
  },

  getStoredToken(): string | null {
    return localStorage.getItem('token');
  },

  getStoredUser(): Usuario | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};
