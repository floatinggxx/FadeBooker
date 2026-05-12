import api from '../api';
import { LoginRequest, LoginResponse, RegisterRequest, Usuario } from '@/types';

export const authService = {
  async login(email: string, contrasena: string): Promise<LoginResponse> {
    const response = await api.post<{ usuario: any; token: string }>('/usuarios/login', {
      email,
      contrasena
    });
    const { usuario, token } = response.data;
    return {
      id: usuario.id_usuario?.toString() || '',
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
      token
    };
  },

  async register(data: RegisterRequest): Promise<Usuario> {
    const response = await api.post<Usuario>('/usuarios/register', data);
    return response.data;
  },

  async logout(): Promise<void> {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getStoredToken(): string | null {
    return localStorage.getItem('token');
  },

  getStoredUser(): Usuario | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};
