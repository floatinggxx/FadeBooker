import api from '../api';
import { Tienda } from '@/types';

export const tiendaService = {
  listTiendas: async (ciudad?: string): Promise<Tienda[]> => {
    const params = ciudad ? { ciudad } : {};
    const response = await api.get('/tiendas', { params });
    return response.data;
  },

  getTiendaById: async (id: string | number): Promise<Tienda> => {
    const response = await api.get(`/tiendas/${id}`);
    return response.data;
  },

  getBarberosByTienda: async (id: string | number): Promise<any[]> => {
    const response = await api.get(`/tiendas/${id}/barberos`);
    return response.data;
  },

  getResenasByTienda: async (id: string | number): Promise<any[]> => {
    const response = await api.get(`/tiendas/${id}/resenas`);
    return response.data;
  },

  listCiudades: async (): Promise<string[]> => {
    // Podríamos tener un endpoint específico o deducirlo de las tiendas
    const response = await api.get('/tiendas');
    const tiendas: Tienda[] = response.data;
    const ciudades = Array.from(new Set(tiendas.map(t => t.ciudad)));
    return ciudades.sort();
  },

  updateTienda: async (id: string | number, data: Partial<Tienda>): Promise<Tienda> => {
    const response = await api.put(`/tiendas/${id}`, data);
    return response.data;
  },

  updateTiendaPhoto: async (id: string | number, image: string): Promise<{ fotoUrl: string }> => {
    const response = await api.post(`/tiendas/${id}/foto`, { image });
    return response.data;
  },

  updateTiendaGallery: async (id: string | number, image: string): Promise<{ fotoUrl: string }> => {
    const response = await api.post(`/tiendas/${id}/galeria`, { image });
    return response.data;
  }
};
