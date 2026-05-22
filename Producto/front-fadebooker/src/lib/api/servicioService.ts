import api from '../api';
import { Servicio } from '@/types';

export const servicioService = {
  getAll: async (): Promise<Servicio[]> => {
    const response = await api.get('/servicios');
    return response.data;
  },

  getById: async (id: number): Promise<Servicio> => {
    const response = await api.get(`/servicios/${id}`);
    return response.data;
  },

  getByBarbero: async (barberoId: number): Promise<Servicio[]> => {
    const response = await api.get(`/servicios/barbero/${barberoId}`);
    return response.data;
  },

  create: async (data: Partial<Servicio>): Promise<Servicio> => {
    const response = await api.post('/servicios', data);
    return response.data;
  },

  update: async (id: number, data: Partial<Servicio>): Promise<Servicio> => {
    const response = await api.put(`/servicios/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/servicios/${id}`);
  }
};
