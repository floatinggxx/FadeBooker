import api from '../api';
import { LoginRequest, LoginResponse, RegisterRequest, Usuario } from '@/types';

export const authService = {
  async login(email: string, contrasena: string): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/usuarios/login', {
      email,
      contrasena
    });
    return response.data;
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
