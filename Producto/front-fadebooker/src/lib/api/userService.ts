import api from './axios';

export interface UserProfile {
  id: string;
  nombre: string;
  email: string;
  rol?: string;
}

export const getMyProfile = async (): Promise<UserProfile> => {
  const resp = await api.get('/usuarios/me');
  return resp.data;
};

export const updateMyProfile = async (payload: Partial<UserProfile>) => {
  const resp = await api.put('/usuarios/me', payload);
  return resp.data;
};

export default { getMyProfile, updateMyProfile };
import api from '../api';
import { Usuario } from '@/types';

export const userService = {
  // Obtener perfil del usuario actual (requiere auth)
  async getPerfil(): Promise<Usuario> {
    const response = await api.get<Usuario>('/usuarios/perfil');
    return response.data;
  },

  // Actualizar perfil del usuario
  async updatePerfil(data: Partial<Usuario>): Promise<Usuario> {
    const response = await api.put<Usuario>('/usuarios/perfil', data);
    return response.data;
  },

  // Obtener usuario por ID
  async getUserById(usuarioId: number): Promise<Usuario> {
    const response = await api.get<Usuario>(`/usuarios/${usuarioId}`);
    return response.data;
  },

  // Listar todos los usuarios (admin)
  async listUsuarios(): Promise<Usuario[]> {
    const response = await api.get<Usuario[]>('/usuarios');
    return response.data;
  },

  // Eliminar usuario
  async deleteUsuario(usuarioId: number): Promise<void> {
    await api.delete(`/usuarios/${usuarioId}`);
  },

  // Cambiar contraseña
  async changePassword(contraseñaActual: string, contraseñaNueva: string): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>('/usuarios/cambiar-contraseña', {
      contraseñaActual,
      contraseñaNueva
    });
    return response.data;
  }
};
