import axios from 'axios';
import { Tienda } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const tiendaService = {
  listTiendas: async (ciudad?: string): Promise<Tienda[]> => {
    const params = ciudad ? { ciudad } : {};
    const response = await axios.get(`${API_URL}/tiendas`, { params });
    return response.data;
  },

  getTiendaById: async (id: string | number): Promise<Tienda> => {
    const response = await axios.get(`${API_URL}/tiendas/${id}`);
    return response.data;
  },

  getBarberosByTienda: async (id: string | number): Promise<any[]> => {
    const response = await axios.get(`${API_URL}/tiendas/${id}/barberos`);
    return response.data;
  },

  listCiudades: async (): Promise<string[]> => {
    // Podríamos tener un endpoint específico o deducirlo de las tiendas
    const response = await axios.get(`${API_URL}/tiendas`);
    const tiendas: Tienda[] = response.data;
    const ciudades = Array.from(new Set(tiendas.map(t => t.ciudad)));
    return ciudades.sort();
  },

  updateTienda: async (id: string | number, data: Partial<Tienda>): Promise<Tienda> => {
    const response = await axios.put(`${API_URL}/tiendas/${id}`, data);
    return response.data;
  }
};
