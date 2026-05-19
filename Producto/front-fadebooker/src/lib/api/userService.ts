import api from '../api';
import { Usuario } from '@/types';

export const userService = {
  // Obtener perfil del usuario actual (requiere auth)
  async getPerfil(): Promise<Usuario> {
    const response = await api.get<Usuario>('/usuarios/perfil');
    const u = response.data;
    return {
      ...u,
      id: u.id_usuario || u.id
    };
  },

  // Actualizar perfil del usuario
  async updatePerfil(data: Partial<Usuario>): Promise<Usuario> {
    const response = await api.put<Usuario>('/usuarios/perfil', data);
    const u = response.data;
    return {
      ...u,
      id: u.id_usuario || u.id
    };
  },

  // Obtener usuario por ID
  async getUserById(usuarioId: number): Promise<Usuario> {
    const response = await api.get<Usuario>(`/usuarios/${usuarioId}`);
    const u = response.data;
    return {
      ...u,
      id: u.id_usuario || u.id
    };
  },

  // Listar todos los usuarios (admin)
  async listUsuarios(): Promise<Usuario[]> {
    const response = await api.get<Usuario[]>('/usuarios');
    return response.data.map(u => ({
      ...u,
      id: u.id_usuario || u.id
    }));
  },

  // Eliminar usuario
  async deleteUsuario(usuarioId: number): Promise<void> {
    await api.delete(`/usuarios/${usuarioId}`);
  },

  // Cambiar contraseña
  async changePassword(contrasenaActual: string, contrasenaNueva: string): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>('/usuarios/cambiar-contrasena', {
      contrasenaActual,
      contrasenaNueva
    });
    return response.data;
  }
};
