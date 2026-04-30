import api from '../api';
import { Servicio } from '@/types';

export const serviceService = {
  // Listar todos los servicios
  async listServicios(): Promise<Servicio[]> {
    const response = await api.get<Servicio[]>('/servicios');
    return response.data;
  },

  // Obtener un servicio por ID
  async getServicioById(servicioId: number): Promise<Servicio> {
    const response = await api.get<Servicio>(`/servicios/${servicioId}`);
    return response.data;
  },

  // Crear un servicio
  async createServicio(data: Omit<Servicio, 'id'>): Promise<Servicio> {
    const response = await api.post<Servicio>('/servicios', data);
    return response.data;
  },

  // Actualizar un servicio
  async updateServicio(servicioId: number, data: Partial<Servicio>): Promise<Servicio> {
    const response = await api.put<Servicio>(`/servicios/${servicioId}`, data);
    return response.data;
  },

  // Eliminar un servicio
  async deleteServicio(servicioId: number): Promise<void> {
    await api.delete(`/servicios/${servicioId}`);
  },

  // Buscar servicios por nombre
  async buscarPorNombre(nombre: string): Promise<Servicio[]> {
    const response = await api.get<Servicio[]>('/servicios', {
      params: { nombre }
    });
    return response.data;
  }
};
