import api from '../api';
import { Tienda } from '@/types';

export const tiendaService = {
  listTiendas: async (comunaOrFilters?: string | { comuna?: string; region?: string; ciudad?: string }): Promise<Tienda[]> => {
    const params: any = {};
    if (typeof comunaOrFilters === 'string') {
      params.comuna = comunaOrFilters;
    } else if (comunaOrFilters) {
      if (comunaOrFilters.comuna) params.comuna = comunaOrFilters.comuna;
      if (comunaOrFilters.region) params.region = comunaOrFilters.region;
      if (comunaOrFilters.ciudad) params.comuna = comunaOrFilters.ciudad;
    }
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

  listComunas: async (): Promise<string[]> => {
    const response = await api.get('/tiendas');
    const tiendas: Tienda[] = response.data;
    const comunas = Array.from(new Set(tiendas.map(t => t.comuna).filter(Boolean)));
    return comunas.sort();
  },

  listRegiones: async (): Promise<string[]> => {
    const response = await api.get('/tiendas');
    const tiendas: Tienda[] = response.data;
    const regiones = Array.from(new Set(tiendas.map(t => t.region).filter(Boolean)));
    return regiones.sort();
  },

  listCiudades: async (): Promise<string[]> => {
    const response = await api.get('/tiendas');
    const tiendas: Tienda[] = response.data;
    const comunas = Array.from(new Set(tiendas.map(t => t.comuna || (t as any).ciudad).filter(Boolean)));
    return comunas.sort();
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
